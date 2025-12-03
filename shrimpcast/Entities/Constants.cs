using shrimpcast.Helpers;

namespace shrimpcast.Entities
{
    public class Constants
    {
        public const string BACKEND_VERSION = "2.0.3";

        public const string PING_COMMAND = "!ping";

        public const string PLAY_COMMAND = "!play";

        public const string PLAY_MAIN_COMMAND = $"{PLAY_COMMAND}main";

        public const string PLAY_KINO_COMMAND = $"{PLAY_COMMAND}kino";

        public const string PLAY_MUSIC_MAIN_MUTED = $"{PLAY_COMMAND}music";

        public const string TRY_IP_SERVICE_COMMAND = $"!tryipservice";

        public const string RESET_VPN_RECORDS = $"!resetallsavedvpnrecords";

        public const string REDIRECT_SOURCE = $"!redirectsource";

        public const string FILTERS = "filters.json";

        public static readonly string FIREANDFORGET_TOKEN = SecureToken.GenerateTokenThreadSafe();

        public const string BANNED_MESSAGE = "You are banned.";

        public const string TOR_DISABLED_MESSAGE = "Tor connections are temporarily disabled.";

        public const string VPN_DISABLED_MESSAGE = "VPN connections are temporarily disabled.";

        public const string MAX_USERS_REACHED = "Our site is currently experiencing high traffic and can't accommodate new users at the moment. Please try again later.";

        public const string MAX_IP_USER_REACHED = "You have exceeded the maximum amount of permitted simultaneous connections. Refresh to try again.";

        public const string TURNSTILE_REQUIRED = "TURNSTILE_VERIFICATION_REQUIRED";

        public const string FRONTEND_OUTDATED = "Outdated frontend, please reload.";

        public readonly static string[] SOURCE_RESERVERD_WORDS = ["chat", "live", "api", "embed"];

        public enum AddTableItem
        {
            boolean = 1,
            text = 2,
            button = 3,
            image = 4,
            date = 5,
            numeric = 6,
        }

        public static string EMOTE_GET (string name) => $"/api/emote/get/{name}";

        #region OBS
        public static string OBS_AUTH_JSON(string auth) => @"
        {
        	""op"": 1,
        	""d"": {
        		""rpcVersion"": 1,
        		""authentication"": ""{0}"",
        		""eventSubscriptions"": 33
        	}
        }".Replace("{0}", auth);

        public static string GET_SCENE_ITEM_ID(string scene, string source) => @"
        {
          ""op"": 6,
          ""d"": {
            ""requestType"": ""GetSceneItemId"",
            ""requestId"": ""f819dcf0-89cc-11eb-8f0e-382c4ac93b9c"",
            ""requestData"": {
             ""sceneName"":""{0}"",
             ""sourceName"":""{1}""
            }
          }
        }".Replace("{0}", scene).Replace("{1}", source);

        public static string SET_SOURCE_ENABLED(string scene, int sourceId, bool enabled) => @"
        {
          ""op"": 6,
          ""d"": {
            ""requestType"": ""SetSceneItemEnabled"",
            ""requestId"": ""f819dcf0-89cc-11eb-8f0e-382c4ac93b9c"",
            ""requestData"": {
            ""sceneName"":""{0}"",
             ""sceneItemId"":{1},
             ""sceneItemEnabled"": {2}
            }
          }
        }".Replace("{0}", scene).Replace("{1}", sourceId.ToString()).Replace("{2}", enabled.ToString().ToLower());

        public static string SET_SOURCE_MUTED(string inputName, bool muted) => @"
        {
          ""op"": 6,
          ""d"": {
            ""requestType"": ""SetInputMute"",
            ""requestId"": ""f819dcf0-89cc-11eb-8f0e-382c4ac93b9c"",
            ""requestData"": {
             ""inputName"":""{0}"",
             ""inputMuted"":{1}
            }
          }
        }".Replace("{0}", inputName).Replace("{1}", muted.ToString().ToLower());

        public static string CHANGE_SOURCE(string inputName, string url) => @"
        {
          ""op"": 6,
          ""d"": {
            ""requestType"": ""SetInputSettings"",
            ""requestId"": ""f819dcf0-89cc-11eb-8f0e-382c4ac93b9c"",
            ""requestData"": {
            ""inputName"":""{0}"",
            ""inputSettings"":{
                ""playlist"":[
                    {
                        ""value"":""{1}""
                    }
                ]
            },
            ""sourceType"":""vlc_source"",
            ""status"":""ok""
            }
          }
        }".Replace("{0}", inputName).Replace("{1}", url);
        #endregion
    }
}

