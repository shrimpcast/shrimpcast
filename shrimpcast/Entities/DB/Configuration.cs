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

        public required int MaxConnectedUsers { get; set; }

        public required string DefaultName { get; set; }

        public required int MaxMessagesToShow { get; set; }

        public required bool StreamEnabled { get; set; }

        public List<Source> Sources { get; set; } = [];

        public required string StreamTitle { get; set; }

        public required string StreamDescription  { get; set; }

        public required int MessageDelayTime { get; set; }

        public required int RequiredTokenTimeInMinutes { get; set; }

        public required int MaxLengthTruncation { get; set; }

        public required int OffsetDateTimeInMinutes { get; set; }

        public required bool ShowBingo { get; set; }

        public required string BingoTitle { get; set; }

        public required bool EnableAutoBingoMarking { get; set; }

        public required int AutoMarkingUserCountThreshold { get; set; }

        public required int AutoMarkingSecondsThreshold { get; set; }

        public required bool ShowPoll { get; set; }

        public required bool AcceptNewOptions { get; set; }

        public required bool AcceptNewVotes { get; set; }

        public required bool ShowVotes { get; set; }

        public required string PollTitle { get; set; }

        public required int MinSentToParticipate { get; set; }

        public required int MuteLenghtInMinutes { get; set; }

        public required bool EnableFireworks { get; set; }

        public required bool EnableChristmasTheme { get; set; }

        public required int SnowflakeCount { get; set; }

        public required bool SiteBlockTORConnections { get; set; }

        public required bool ChatBlockTORConnections { get; set; }

        public required bool SiteBlockVPNConnections { get; set; }

        public required bool ChatBlockVPNConnections { get; set; }

        public required string IPServiceApiURL { get; set; }

        [JsonIgnore]
        public string? IPServiceApiKey { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? IPServiceApiKeyNotMapped { get; set; }

        public required string OptionalApiKeyHeader { get; set; }

        public required string VPNDetectionMatchCriteria { get; set; }

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

        public required bool ShowGoldenPassButton { get; set; }

        public required int GoldenPassValue { get; set; }

        public required string GoldenPassTitle { get; set; }

        public required string BTCServerInstanceURL { get; set; }

        public required string BTCServerStoreId { get; set; }

        [JsonIgnore]
        public string? BTCServerWebhookSecret { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? BTCServerWebhookSecretNotMapped { get; set; }

        [JsonIgnore]
        public string? BTCServerApiKey { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? BTCServerApiKeyNotMapped { get; set; }

        public required string PalettePrimary { get; set; }

        public required string PaletteSecondary { get; set; }

        public required bool UseDarkTheme { get; set; }

        public required bool EnableHalloweenTheme { get; set; }

        public required bool EnableStripe { get; set; }

        public required bool EnableBTCServer { get; set; }

        [JsonIgnore]
        public string? StripeSecretKey { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? StripeSecretKeyNotMapped { get; set; }

        [JsonIgnore]
        public string? StripeWebhookSecret { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? StripeWebhookSecretNotMapped { get; set; }

        public required bool EnableTurnstileMode { get; set; }

        public string? TurnstileTitle { get; set; }

        public string? TurnstilePublicKey { get; set; }

        [JsonIgnore]
        public string? TurnstileSecretKey { get; set; } = string.Empty;

        [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
        [NotMapped]
        public string? TurnstileSecretKeyNotMapped { get; set; }

        public required bool EnablePWA { get; set; }

        public required bool ShowConnectedUsers { get; set; }

        public required bool ForceLatestVersion { get; set; }

        public required bool ShowViewerCountPerStream { get; set; }

        public required int RequiredTimeToPostLinksMinutes { get; set; }

        public required bool TurnstileManagedMode { get; set; }

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
                        new { name = nameof(config.EnablePWA).ToLower(), label = "Enable PWA", value = config.EnablePWA },
                        new { name = nameof(config.ForceLatestVersion).ToLower(), label = "Force latest version", value = config.ForceLatestVersion },
                        new { name = nameof(config.ShowConnectedUsers).ToLower(), label = "Publicly display connected users", value = config.ShowConnectedUsers },
                        new { name = nameof(config.MaxConnectionsPerIP).ToLower(), label = "Max connections per IP", value = config.MaxConnectionsPerIP },
                        new { name = nameof(config.MaxConnectedUsers).ToLower(), label = "Max connected users (0 = ∞)", value = config.MaxConnectedUsers },
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
                        new { name = nameof(config.RequiredTokenTimeInMinutes).ToLower(), label = "Required time for new users (min)", value = config.RequiredTokenTimeInMinutes },
                        new { name = nameof(config.RequiredTimeToPostLinksMinutes).ToLower(), label = "Required time to post links (min)", value = config.RequiredTimeToPostLinksMinutes },
                        new { name = nameof(config.MessageDelayTime).ToLower(), label = "Cooldown between messages", value = config.MessageDelayTime },
                        new { name = nameof(config.MuteLenghtInMinutes).ToLower(), label = "Mute time in minutes", value = config.MuteLenghtInMinutes },
                        new { name = nameof(config.MaxLengthTruncation).ToLower(), label = "Message length before truncation", value = config.MaxLengthTruncation },
                        new { name = nameof(config.DefaultName).ToLower(), label = "Default name for new users", value = config.DefaultName },
                    }
                },
                new
                {
                    name = "Stream",
                    values = new object[]
                    {
                        new { name = nameof(config.StreamEnabled).ToLower(), label = "Enable stream", value = config.StreamEnabled },
                        new { name = nameof(config.ShowViewerCountPerStream).ToLower(), label = "Show viewer count per stream", value = config.ShowViewerCountPerStream },
                        new
                        {
                            name = nameof(config.Sources).ToLower(),
                            label = "Sources",
                            fields = new[]
                            {
                                new { name = nameof(Source.IsEnabled).ToLower(), label = "Enabled" },
                                new { name = nameof(Source.Name).ToLower(), label = "Name" },
                                new { name = nameof(Source.Title).ToLower(), label = "Title" },
                                new { name = nameof(Source.Url).ToLower(), label = "URL" },
                                new { name = nameof(Source.Thumbnail).ToLower(), label = "Thumbnail" },
                                new { name = nameof(Source.UseLegacyPlayer).ToLower(), label = "Native player" },
                                new { name = nameof(Source.UseRTCEmbed).ToLower(), label = "Embed" },
                                new { name = nameof(Source.WithCredentials).ToLower(), label = "With credentials" },
                                new { name = nameof(Source.ResetOnScheduledSwitch).ToLower(), label = "Reset on start" },
                                new { name = nameof(Source.StartsAt).ToLower(), label = "Schedule start" },
                                new { name = nameof(Source.EndsAt).ToLower(), label = "Schedule end" },
                                new { name = "delete", label = string.Empty },
                            }
                        }
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
                    name = "TOR & VPNs",
                    values = new object[]
                    {
                        new { name = nameof(config.SiteBlockTORConnections).ToLower(), label = "Block TOR connections site-wide", value = config.SiteBlockTORConnections },
                        new { name = nameof(config.ChatBlockTORConnections).ToLower(), label = "Block TOR connections for chat only", value = config.ChatBlockTORConnections },
                        new { name = nameof(config.SiteBlockVPNConnections).ToLower(), label = "Block VPN connections site-wide", value = config.SiteBlockVPNConnections },
                        new { name = nameof(config.ChatBlockVPNConnections).ToLower(), label = "Block VPN connections for chat only", value = config.ChatBlockVPNConnections },
                        new { name = nameof(config.IPServiceApiURL).ToLower(), label = "API URL for the IP detection service", value = config.IPServiceApiURL },
                        new { name = nameof(config.IPServiceApiKeyNotMapped).ToLower(), label = "API key for the VPN Detection Service", value = config.IPServiceApiKey },
                        new { name = nameof(config.OptionalApiKeyHeader).ToLower(), label = "Optional header to send the API key", value = config.OptionalApiKeyHeader },
                        new { name = nameof(config.VPNDetectionMatchCriteria).ToLower(), label = "VPN detection match criteria", value = config.VPNDetectionMatchCriteria },
                    }
                },
                new
                {
                    name = "Bingo",
                    values = new object[]
                    {
                        new { name = nameof(config.ShowBingo).ToLower(), label = "Show bingo", value = config.ShowBingo },
                        new { name = nameof(config.EnableAutoBingoMarking).ToLower(), label = "Enable auto marking", value = config.EnableAutoBingoMarking },
                        new { name = nameof(config.AutoMarkingSecondsThreshold).ToLower(), label = "Auto marking seconds threshold", value = config.AutoMarkingSecondsThreshold },
                        new { name = nameof(config.AutoMarkingUserCountThreshold).ToLower(), label = "Auto marking user count threshold", value = config.AutoMarkingUserCountThreshold },
                        new { name = nameof(config.BingoTitle).ToLower(), label = "Bingo title", value = config.BingoTitle },
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
                        new { name = nameof(config.EnableHalloweenTheme).ToLower(), label = "Enable halloween theme", value = config.EnableHalloweenTheme },
                        new { name = nameof(config.SnowflakeCount).ToLower(), label = "Christmas theme snowflake count", value = config.SnowflakeCount },
                        new { name = nameof(config.UseDarkTheme).ToLower(), label = "Use dark contrast (recommended)", value = config.UseDarkTheme },
                        new { name = nameof(config.PalettePrimary).ToLower(), label = "Primary color", value = config.PalettePrimary },
                        new { name = nameof(config.PaletteSecondary).ToLower(), label = "Secondary color", value = config.PaletteSecondary },
                    }
                },
                new
                {
                    name = "Vapid",
                    values = new object[]
                    {
                        new { name = nameof(config.VAPIDPublicKey).ToLower(), label = "VAPID Public key", value = config.VAPIDPublicKey },
                        new { name = nameof(config.VAPIDPrivateKeyNotMapped).ToLower(), label = "VAPID Private key", value = config.VAPIDPrivateKey },
                        new { name = nameof(config.VAPIDMailNotMapped).ToLower(), label = "VAPID Mail", value = config.VAPIDMail },
                    }
                },
                new
                {
                    name = "Golden pass",
                    values = new object[]
                    {
                        new { name = nameof(config.ShowGoldenPassButton).ToLower(), label = "Enable golden pass purchases", value = config.ShowGoldenPassButton },
                        new { name = nameof(config.EnableBTCServer).ToLower(), label = "Enable crypto purchases", value = config.EnableBTCServer },
                        new { name = nameof(config.EnableStripe).ToLower(), label = "Enable stripe purchases", value = config.EnableStripe },
                        new { name = nameof(config.GoldenPassValue).ToLower(), label = "Golden pass value (USD)", value = config.GoldenPassValue },
                        new { name = nameof(config.GoldenPassTitle).ToLower(), label = "Golden pass title", value = config.GoldenPassTitle },
                        new { name = nameof(config.BTCServerInstanceURL).ToLower(), label = "BTCServer instance URL", value = config.BTCServerInstanceURL },
                        new { name = nameof(config.BTCServerStoreId).ToLower(), label = "BTCServer store ID", value = config.BTCServerStoreId },
                        new { name = nameof(config.BTCServerApiKeyNotMapped).ToLower(), label = "BTCServer API key", value = config.BTCServerApiKey },
                        new { name = nameof(config.BTCServerWebhookSecretNotMapped).ToLower(), label = "BTCServer webhook secret", value = config.BTCServerWebhookSecret },
                        new { name = nameof(config.StripeSecretKeyNotMapped).ToLower(), label = "Stripe secret key", value = config.StripeSecretKey },
                        new { name = nameof(config.StripeWebhookSecretNotMapped).ToLower(), label = "Stripe webhook secret", value = config.StripeWebhookSecret },
                    }
                },
                new
                {
                    name = "Turnstile",
                    values = new object[]
                    {
                        new { name = nameof(config.EnableTurnstileMode).ToLower(), label = "Enable turnstile for new users", value = config.EnableTurnstileMode },
                        new { name = nameof(config.TurnstileManagedMode).ToLower(), label = "Enable managed mode", value = config.TurnstileManagedMode },
                        new { name = nameof(config.TurnstileTitle).ToLower(), label = "Turnstile title ", value = config.TurnstileTitle },
                        new { name = nameof(config.TurnstilePublicKey).ToLower(), label = "Turnstile public key", value = config.TurnstilePublicKey },
                        new { name = nameof(config.TurnstileSecretKeyNotMapped).ToLower(), label = "Turnstile private key", value = config.TurnstileSecretKey },
                    }
                }
            };
    }
}

