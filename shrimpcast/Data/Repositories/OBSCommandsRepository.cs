using shrimpcast.Entities;
using System.Net.WebSockets;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace shrimpcast.Data.Repositories.Interfaces
{
    public class OBSCommandsRepository(ConfigurationSingleton configurationSingleton) : IOBSCommandsRepository
    {
        private readonly ConfigurationSingleton _configurationSingleton = configurationSingleton;
        
        private string HashEncode(string input) =>
            Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(input)));

        private async Task<string> ReadWS(ClientWebSocket ws)
        {
            var buffer = new byte[2048];
            var result = await ws.ReceiveAsync(buffer, CancellationToken.None);
            return Encoding.UTF8.GetString(buffer, 0, result.Count);
        }

        private async Task WriteWS(ClientWebSocket ws, string payload)
        {
            var bytes = Encoding.UTF8.GetBytes(payload);
            await ws.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, endOfMessage: true, cancellationToken: CancellationToken.None);
        }

        private async Task<ClientWebSocket> ConnectToOBS()
        {
            string host = _configurationSingleton.Configuration.OBSHost ?? string.Empty;
            var ws = new ClientWebSocket();
            await ws.ConnectAsync(new Uri(host), CancellationToken.None);

            // Perform authentication
            var authChallenge = await ReadWS(ws);
            using (JsonDocument document = JsonDocument.Parse(authChallenge))
            {
                // Access the "authentication" value
                JsonElement authenticationNode = document.RootElement.GetProperty("d").GetProperty("authentication");

                // Extract the values "challenge" and "salt"
                var challengeValue = authenticationNode.GetProperty("challenge").GetString();
                var saltValue = authenticationNode.GetProperty("salt").GetString();
                var password = _configurationSingleton.Configuration.OBSPassword;

                var secret = HashEncode(password + saltValue);
                var authResponse = HashEncode(secret + challengeValue);
                var payload = Constants.OBS_AUTH_JSON(authResponse);
             
                //Send payload
                await WriteWS(ws, payload);
                var result = await ReadWS(ws);
                if (string.IsNullOrEmpty(result)) throw new Exception("Could not connect to OBS.");
            }
            return ws;
        }

        private async Task<int> GetSceneItemId(ClientWebSocket ws, string source)
        {
            var config = _configurationSingleton.Configuration;
            var payload = Constants.GET_SCENE_ITEM_ID(config.OBSMainScene, source);
            await WriteWS(ws, payload);
            var result = await ReadWS(ws);
            using JsonDocument document = JsonDocument.Parse(result);
            // Access the "sceneItemId" value
            int sceneItemId = document.RootElement.GetProperty("d").GetProperty("responseData").GetProperty("sceneItemId").GetInt32();
            return sceneItemId;
        }

        private async Task SetSourceStatus(ClientWebSocket ws, string source, bool enabled)
        {
            var SceneItemId = await GetSceneItemId(ws, source);
            var config = _configurationSingleton.Configuration;
            var payload = Constants.SET_SOURCE_ENABLED(config.OBSMainScene, SceneItemId, enabled);
            await WriteWS(ws, payload);
            var result = await ReadWS(ws);
            using JsonDocument document = JsonDocument.Parse(result);
            // Access the "result" value
            bool resultValue = document.RootElement.GetProperty("d").GetProperty("requestStatus").GetProperty("result").GetBoolean();
            if (!resultValue) throw new Exception($"Could not set state {enabled} for {source}.");
        }

        private async Task SetSourceMuted(ClientWebSocket ws, string source, bool muted)
        {
            var payload = Constants.SET_SOURCE_MUTED(source, muted);
            await WriteWS(ws, payload);
            var result = await ReadWS(ws);
            using JsonDocument document = JsonDocument.Parse(result);
            // Access the "result" value
            bool resultValue = document.RootElement.GetProperty("d").GetProperty("requestStatus").GetProperty("result").GetBoolean();
            if (!resultValue) throw new Exception($"Could not set state {muted} for {source}.");
        }

        private async Task SetSourceURL(ClientWebSocket ws, string source, string url)
        {
            var payload = Constants.CHANGE_SOURCE(source, url);
            await WriteWS(ws, payload);
            var result = await ReadWS(ws);
            using JsonDocument document = JsonDocument.Parse(result);
            // Access the "result" value
            bool resultValue = document.RootElement.GetProperty("d").GetProperty("requestStatus").GetProperty("result").GetBoolean();
            if (!resultValue) throw new Exception($"Could not set state {url} for {source}.");
        }

        public async Task<bool> PlayMain(string? url)
        {
            var config = _configurationSingleton.Configuration;
            using (var ws = await ConnectToOBS())
            {
                await SetSourceStatus(ws, config.OBSKinoSource, false);
                await SetSourceStatus(ws, config.OBSMusicSource, false);
                if (url != null)
                {
                    await SetSourceStatus(ws, config.OBSMainSource, false);
                    await SetSourceURL(ws, config.OBSMainSource, url);
                    await Task.Delay(100);
                }
                await SetSourceStatus(ws, config.OBSMainSource, true);
                await SetSourceMuted(ws, config.OBSMainSource, false);
                await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
            }
            return true;
        }

        public async Task<bool> PlayKino(string? url)
        {
            var config = _configurationSingleton.Configuration;
            using (var ws = await ConnectToOBS())
            {
                await SetSourceStatus(ws, config.OBSMainSource, false);
                await SetSourceStatus(ws, config.OBSMusicSource, false);
                if (url != null)
                {
                    await SetSourceStatus(ws, config.OBSKinoSource, false);
                    await SetSourceURL(ws, config.OBSKinoSource, url);
                    await Task.Delay(100);
                }
                await SetSourceStatus(ws, config.OBSKinoSource, true);
                await SetSourceMuted(ws, config.OBSKinoSource, false);
                await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
            }
            return true;
        }

        public async Task<bool> PlayMusic(string? url)
        {
            var config = _configurationSingleton.Configuration;
            using (var ws = await ConnectToOBS())
            {
                await SetSourceStatus(ws, config.OBSMainSource, true);
                if (url != null)
                {
                    await SetSourceStatus(ws, config.OBSMusicSource, false);
                    await SetSourceURL(ws, config.OBSMusicSource, url);
                    await Task.Delay(100);
                }
                await SetSourceStatus(ws, config.OBSMusicSource, true);
                await SetSourceStatus(ws, config.OBSKinoSource, false);
                await SetSourceMuted(ws, config.OBSMainSource, true);
                await SetSourceMuted(ws, config.OBSMusicSource, false);
                await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "", CancellationToken.None);
            }
            return true;
        }
    }
}

