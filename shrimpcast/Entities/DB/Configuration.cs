using Microsoft.AspNetCore.Components.Web;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace shrimpcast.Entities.DB
{
    public class Configuration : ICloneable
    {
        [JsonIgnore]
        public int ConfigurationId { get; set; }

        public required bool ChatEnabled { get; set; }

        public required bool EnableVerifiedMode { get;set; }
        
        public required int MaxConnectionsPerIP { get; set; }

        public required string DefaultName { get; set; }

        public required int MaxMessagesToShow { get; set; }

        public required string? PrimaryStreamUrl { get; set; }

        public required string? SecondaryStreamUrl { get; set; }

        public required bool StreamEnabled { get; set; }

        public required bool EnableMultistreams { get; set; }

        public required bool HideStreamTitle { get; set; }

        public required string StreamTitle { get; set; }

        public required string StreamDescription  { get; set; }

        public required int MessageDelayTime { get; set; }

        public required int RequiredTokenTimeInMinutes { get; set; }

        public required int OffsetDateTimeInMinutes { get; set; }

        public required bool ShowPoll { get; set; }

        public required bool AcceptNewOptions { get; set; }

        public required bool AcceptNewVotes { get; set; }

        public required bool ShowVotes { get; set; }

        public required string PollTitle { get; set; }

        public required int MinSentToParticipate { get; set; }

        public required bool UseLegacyPlayer { get; set; }

        public required bool UsePrimarySource { get; set; }

        public required bool UseRTCEmbed { get; set; }

        public required int MuteLenghtInMinutes { get; set; }

        public required bool EnableFireworks { get; set; }

        public required bool EnableChristmasTheme { get; set; }

        public required int SnowflakeCount { get; set; }

        public required bool BlockTORConnections { get; set; }

        [JsonIgnore]
        public string? OBSHost { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? OBSHostNotMapped { get; set; }

        [JsonIgnore]
        public string? OBSPassword { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? OBSPasswordtNotMapped { get; set; }

        public required string OBSMainScene { get; set; }

        public required string OBSMainSource { get; set; }

        public required string OBSKinoSource { get; set; }

        public required string OBSMusicSource { get; set; }

        public required DateTime OpenAt { get; set; }

        public required int MinABTimeInMs { get; set; }

        public required int MaxABTimeInMs { get; set; }

        public string? VAPIDPublicKey { get; set; }

        [JsonIgnore]
        public string? VAPIDPrivateKey { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? VAPIDPrivateKeyNotMapped { get; set; }

        [JsonIgnore]
        public string? VAPIDMail { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? VAPIDMailNotMapped { get; set; }

        public object Clone() => MemberwiseClone();
    }

    public static class ConfigurationExtensions
    {
        public static object BuildJSONConfiguration(this Configuration config) => new object[]
            {
                new
                {
                    name = "Site",
                    values = new object[]
                    {
                        new { name = nameof(config.BlockTORConnections).ToLower(), label = "Block TOR connections", value = config.BlockTORConnections },
                        new { name = nameof(config.HideStreamTitle).ToLower(), label = "Hide stream title", value = config.HideStreamTitle },
                        new { name = nameof(config.MaxConnectionsPerIP).ToLower(), label = "Max connections per IP", value = config.MaxConnectionsPerIP },
                        new { name = nameof(config.MinABTimeInMs).ToLower(), label = "Min auto-mod time (ms)", value = config.MinABTimeInMs },
                        new { name = nameof(config.MaxABTimeInMs).ToLower(), label = "Max auto-mod time (ms)", value = config.MaxABTimeInMs },
                        new { name = nameof(config.OpenAt).ToLower(), label = "Open site at", value = config.OpenAt },
                        new { name = nameof(config.StreamTitle).ToLower(), label = "Stream title", value = config.StreamTitle },
                        new { name = nameof(config.StreamDescription).ToLower(), label = "Stream description", value = config.StreamDescription },
                    }
                },
                new
                {
                    name = "Chat",
                    values = new object[]
                    {
                        new { name = nameof(config.ChatEnabled).ToLower(), label = "Enable chat", value = config.ChatEnabled },
                        new { name = nameof(config.EnableVerifiedMode).ToLower(), label = "Allow verified users only", value = config.EnableVerifiedMode },
                        new { name = nameof(config.MaxMessagesToShow).ToLower(), label = "Max visible messages", value = config.MaxMessagesToShow },
                        new { name = nameof(config.OffsetDateTimeInMinutes).ToLower(), label = "Message age limit (mins)", value = config.OffsetDateTimeInMinutes },
                        new { name = nameof(config.RequiredTokenTimeInMinutes).ToLower(), label = "Required time for new users (mins)", value = config.RequiredTokenTimeInMinutes },
                        new { name = nameof(config.MessageDelayTime).ToLower(), label = "Cooldown between messages", value = config.MessageDelayTime },
                        new { name = nameof(config.MuteLenghtInMinutes).ToLower(), label = "Mute time in minutes", value = config.MuteLenghtInMinutes },
                        new { name = nameof(config.DefaultName).ToLower(), label = "Default name for new users", value = config.DefaultName },
                    }
                },
                new
                {
                    name = "Stream",
                    values = new object[]
                    {
                        new { name = nameof(config.StreamEnabled).ToLower(), label = "Enable stream", value = config.StreamEnabled },
                        new { name = nameof(config.UsePrimarySource).ToLower(), label = "Use primary source", value = config.UsePrimarySource },
                        new { name = nameof(config.UseLegacyPlayer).ToLower(), label = "Use native player", value = config.UseLegacyPlayer },
                        new { name = nameof(config.UseRTCEmbed).ToLower(), label = "Treat url as embed", value = config.UseRTCEmbed },
                        new { name = nameof(config.EnableMultistreams).ToLower(), label = "Enable multistreams", value = config.EnableMultistreams },
                        new { name = nameof(config.PrimaryStreamUrl).ToLower(), label = "Primary stream url", value = config.PrimaryStreamUrl },
                        new { name = nameof(config.SecondaryStreamUrl).ToLower(), label = "Secondary stream url", value = config.SecondaryStreamUrl },
                    }
                },
                new
                {
                    name = "Poll",
                    values = new object[]
                    {
                        new { name = nameof(config.ShowPoll).ToLower(), label = "Show poll", value = config.ShowPoll },
                        new { name = nameof(config.AcceptNewOptions).ToLower(), label = "Accept new options", value = config.AcceptNewOptions },
                        new { name = nameof(config.AcceptNewVotes).ToLower(), label = "Accept new votes", value = config.AcceptNewVotes },
                        new { name = nameof(config.ShowVotes).ToLower(), label = "Make votes public", value = config.ShowVotes },
                        new { name = nameof(config.MinSentToParticipate).ToLower(), label = "Minimum sent to participate", value = config.MinSentToParticipate },
                        new { name = nameof(config.PollTitle).ToLower(), label = "Poll title", value = config.PollTitle },
                    }
                },
                new
                {
                    name = "OBS",
                    values = new object[]
                    {
                        new { name = nameof(config.OBSHostNotMapped).ToLower(), label = "Host", value = config.OBSHost },
                        new { name = nameof(config.OBSPasswordtNotMapped).ToLower(), label = "Password", value = config.OBSPassword },
                        new { name = nameof(config.OBSMainScene).ToLower(), label = "Main scene", value = config.OBSMainScene },
                        new { name = nameof(config.OBSMainSource).ToLower(), label = "Main source", value = config.OBSMainSource },
                        new { name = nameof(config.OBSKinoSource).ToLower(), label = "Kino source", value = config.OBSKinoSource },
                        new { name = nameof(config.OBSMusicSource).ToLower(), label = "Music source", value = config.OBSMusicSource },
                    }
                },
                new
                {
                    name = "Theme",
                    values = new object[]
                    {
                        new { name = nameof(config.EnableFireworks).ToLower(), label = "Enable fireworks", value = config.EnableFireworks },
                        new { name = nameof(config.EnableChristmasTheme).ToLower(), label = "Enable christmas theme", value = config.EnableChristmasTheme },
                        new { name = nameof(config.SnowflakeCount).ToLower(), label = "Christmas theme snowflake count", value = config.SnowflakeCount },
                    }
                },
                new
                {
                    name = "Notifications",
                    values = new object[]
                    {
                        new { name = nameof(config.VAPIDPublicKey).ToLower(), label = "VAPID Public key", value = config.VAPIDPublicKey },
                        new { name = nameof(config.VAPIDPrivateKeyNotMapped).ToLower(), label = "VAPID Private key", value = config.VAPIDPrivateKey },
                        new { name = nameof(config.VAPIDMailNotMapped).ToLower(), label = "VAPID Mail", value = config.VAPIDMail },
                    }
                }
            };
    }
}

