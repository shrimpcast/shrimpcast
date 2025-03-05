using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Newtonsoft.Json;
using shrimpcast.Entities.DB;
using shrimpcast.Helpers;
using WebPush;

namespace shrimpcast.Data
{
    public static class DBInitialize
    {
        public static readonly string INITIAL_ADMIN_TOKEN = SecureToken.GenerateTokenThreadSafe();

        public static void Initialize(APPContext context)
        {
            context.Database.Migrate();
        }

        public static void SetInitialData(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData("Session", [nameof(Session.SessionToken), nameof(Session.CreatedAt), nameof(Session.IsAdmin), "IsModerator", nameof(Session.UserDisplayColor)], new object[,]
            {
                { INITIAL_ADMIN_TOKEN, DateTime.UtcNow, true, false, string.Empty},
            });

            migrationBuilder.InsertData("SessionName", [nameof(SessionName.SessionId), nameof(SessionName.CreatedAt), nameof(SessionName.Name)], new object[,]
            {
                { 1,  DateTime.UtcNow, "Admin"},
            });

            List<string> types = ["ConfigurationId", "ChatEnabled", "MaxConnectionsPerIP", "DefaultName", "MaxMessagesToShow", "PrimaryStreamUrl", "SecondaryStreamUrl", "StreamEnabled", "StreamTitle", "StreamDescription", "MessageDelayTime", "RequiredTokenTimeInMinutes", "OffsetDateTimeInMinutes", "ShowPoll", "AcceptNewOptions", "AcceptNewVotes", "PollTitle", "MinSentToParticipate", "UseLegacyPlayer", "UsePrimarySource", "UseRTCEmbed", "MuteLenghtInMinutes", "EnableFireworks", "EnableChristmasTheme", "SnowflakeCount", "BlockTORConnections", "OBSMainScene", "OBSMainSource", "OBSKinoSource", "OBSMusicSource", "OpenAt", "MinABTimeInMs", "MaxABTimeInMs", "VAPIDPublicKey", "VAPIDPrivateKey", "VAPIDMail"];
            List<object?> values = [];
            var RemovedTypes = new Dictionary<string, object> 
            {
                { "BlockTORConnections", false },
                { "PrimaryStreamUrl", string.Empty },
                { "SecondaryStreamUrl", string.Empty },
                { "UseRTCEmbed", false },
                { "UsePrimarySource", false},
                { "UseLegacyPlayer", false }
            };

            foreach (string type in types)
            {
                var property = typeof(Configuration).GetProperty(type);
                if (property == null)
                {
                    values.Add(RemovedTypes[type]);
                    continue;
                };
                Type propType = property.PropertyType;
                if (typeof(string) == propType) values.Add(string.Empty);
                else values.Add(Activator.CreateInstance(propType));
            }

            values[types.IndexOf("MaxConnectionsPerIP")] = 3;
            values[types.IndexOf("DefaultName")] = "Anonymous";
            values[types.IndexOf("MaxMessagesToShow")] = 150;
            values[types.IndexOf("StreamTitle")] = "Stream title";
            values[types.IndexOf("StreamDescription")] = "Stream description";
            values[types.IndexOf("MessageDelayTime")] = 1;
            values[types.IndexOf("OffsetDateTimeInMinutes")] = 240;
            values[types.IndexOf("PollTitle")] = "Poll title";
            values[types.IndexOf("MuteLenghtInMinutes")] = 5;
            values[types.IndexOf("SnowflakeCount")] = 10;

            var vapidKeys = VapidHelper.GenerateVapidKeys();
            values[types.IndexOf("VAPIDPublicKey")] = vapidKeys.PublicKey;
            values[types.IndexOf("VAPIDPrivateKey")] = vapidKeys.PrivateKey;
            values[types.IndexOf("VAPIDMail")] = "mailto:fake@mail.com";

            var finalValues = new object?[1, values.Count];
            for (int i = 0; i < values.Count; i++)
            {
                finalValues[0, i] = values[i];
            }

            migrationBuilder.InsertData("Configuration", [.. types], finalValues);
            migrationBuilder.InsertData("NameColour", [nameof(NameColour.ColourHex)], new object[,]
            {
               { "#e91e63"},
               { "#9c27b0"},
               { "#673ab7"},
               { "#3f51b5"},
               { "#2196f3"},
               { "#03a9f4"},
               { "#00bcd4"},
               { "#009688"},
               { "#4caf50"},
               { "#8bc34a"},
               { "#cddc39"},
               { "#ffeb3b"},
               { "#ffc107"},
               { "#ff9800"},
            });

            var parsedEmotes = JsonConvert.DeserializeObject <Emote[]>(File.ReadAllText("setup/emotes.json"));
            var emotes = new object[parsedEmotes.Length, 3];
            for (int i = 0; i < parsedEmotes.Length; i++)
            {
                emotes[i, 0] = Path.GetFileNameWithoutExtension(parsedEmotes[i].Name);
                emotes[i, 1] = File.ReadAllBytes($"setup/emotes/{parsedEmotes[i].Name}");
                emotes[i, 2] = parsedEmotes[i].ContentType;
            }

            migrationBuilder.InsertData("Emote", [nameof(Emote.Name), nameof(Emote.Content), nameof(Emote.ContentType)], emotes);
            File.WriteAllText("setup/GeneratedAdminToken.txt", INITIAL_ADMIN_TOKEN);
        }
    }
}

