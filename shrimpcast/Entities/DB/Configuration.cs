using System.Runtime.CompilerServices;

namespace shrimpcast.Entities.DB
{
    public class Configuration : PrivateConfiguration
    {
        public int ConfigurationId { get; set; }
    }

    public static class ConfigurationExtensions
    {
        public static string NormalizeToJavascript(this string value) =>
            char.ToLowerInvariant(value[0]) + value[1..];

        public static PublicConfiguration ToPublicConfiguration (this Configuration config)
        {
            var publicConfiguration = (PublicConfiguration)RuntimeHelpers.GetUninitializedObject(typeof(PublicConfiguration));
            foreach (var p in typeof(PublicConfiguration).GetProperties())
            {
                p.SetValue(publicConfiguration, p.GetValue(config));
            }
            return publicConfiguration;
        }

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
                        new { name = nameof(config.ShowUserLabels).ToLower(), label = "Show user labels", value = config.ShowUserLabels },
                        new { name = nameof(config.EnableVerifiedMode).ToLower(), label = "Allow verified users only", value = config.EnableVerifiedMode },
                        new { name = nameof(config.StripNonASCIIChars).ToLower(), label = "Strip non ASCII characters", value = config.StripNonASCIIChars },
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
                                new { name = nameof(Source.IsEnabled).NormalizeToJavascript(), label = "Enabled", type = Constants.AddTableItem.boolean, color = "primary" },
                                new { name = nameof(Source.Name).NormalizeToJavascript(), label = "Name", type = Constants.AddTableItem.text, color = string.Empty },
                                new { name = nameof(Source.Title).NormalizeToJavascript(), label = "Title", type = Constants.AddTableItem.button, color = "success" },
                                new { name = nameof(Source.StreamOverride).NormalizeToJavascript(), label = "Stream override", type = Constants.AddTableItem.button, color = "info"  },
                                new { name = nameof(Source.Thumbnail).NormalizeToJavascript(), label = "Thumbnail", type = Constants.AddTableItem.image, color = string.Empty },
                                new { name = nameof(Source.WithCredentials).NormalizeToJavascript(), label = "With credentials", type = Constants.AddTableItem.boolean, color = "info" },
                                new { name = nameof(Source.ResetOnScheduledSwitch).NormalizeToJavascript(), label = "Sync on switch", type = Constants.AddTableItem.boolean, color = "warning"  },
                                new { name = nameof(Source.StartsAt).NormalizeToJavascript(), label = "Schedule start", type = Constants.AddTableItem.date, color = string.Empty },
                                new { name = nameof(Source.EndsAt).NormalizeToJavascript(), label = "Schedule end", type = Constants.AddTableItem.date, color = string.Empty  },
                                new { name = nameof(Source.SortPriority).NormalizeToJavascript(), label = "Sort priority", type = Constants.AddTableItem.numeric, color = "primary"  },
                                new { name = nameof(Source.LbSettings).NormalizeToJavascript(), label = "Load balancing rules", type = Constants.AddTableItem.button, color = "success"  },
                            },
                            // Only supports strings at the moment
                            // Do not pass non-string fields or it will break
                            requiredFields = new[]
                            {
                                nameof(Source.Name).NormalizeToJavascript(),
                            },
                            // Field the reserved words apply to
                            reservedWordField = nameof(Source.Name).NormalizeToJavascript(),
                            reservedWords = Constants.SOURCE_RESERVERD_WORDS,
                            model = Source.GetModel(),
                            identifier = nameof(Source.Name).NormalizeToJavascript()
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
                        new { name = nameof(config.EnableVoteSkip).ToLower(), label = "Enable vote skipping", value = config.EnableVoteSkip },
                        new { name = nameof(config.VoteSkipMaxTimeMinutes).ToLower(), label = "Max vote skip time (mins)", value = config.VoteSkipMaxTimeMinutes },
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
                        new { name = nameof(config.IPServiceApiKey).ToLower(), label = "API key for the VPN Detection Service", value = config.IPServiceApiKey },
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
                        new { name = nameof(config.OBSHost).ToLower(), label = "Host", value = config.OBSHost },
                        new { name = nameof(config.OBSPassword).ToLower(), label = "Password", value = config.OBSPassword },
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
                        new { name = nameof(config.VAPIDPrivateKey).ToLower(), label = "VAPID Private key", value = config.VAPIDPrivateKey },
                        new { name = nameof(config.VAPIDMail).ToLower(), label = "VAPID Mail", value = config.VAPIDMail },
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
                        new { name = nameof(config.BTCServerApiKey).ToLower(), label = "BTCServer API key", value = config.BTCServerApiKey },
                        new { name = nameof(config.BTCServerWebhookSecret).ToLower(), label = "BTCServer webhook secret", value = config.BTCServerWebhookSecret },
                        new { name = nameof(config.StripeSecretKey).ToLower(), label = "Stripe secret key", value = config.StripeSecretKey },
                        new { name = nameof(config.StripeWebhookSecret).ToLower(), label = "Stripe webhook secret", value = config.StripeWebhookSecret },
                    }
                },
                new
                {
                    name = "Turnstile",
                    values = new object[]
                    {
                        new { name = nameof(config.EnableTurnstileMode).ToLower(), label = "Enable turnstile for new users", value = config.EnableTurnstileMode },
                        new { name = nameof(config.TurnstileManagedMode).ToLower(), label = "Enable managed mode", value = config.TurnstileManagedMode },
                        new { name = nameof(config.TurnstileSkipThreshold).ToLower(), label = "Messages sent skip threshold", value = config.TurnstileSkipThreshold },
                        new { name = nameof(config.TurnstileTitle).ToLower(), label = "Turnstile title ", value = config.TurnstileTitle },
                        new { name = nameof(config.TurnstilePublicKey).ToLower(), label = "Turnstile public key", value = config.TurnstilePublicKey },
                        new { name = nameof(config.TurnstileSecretKey).ToLower(), label = "Turnstile private key", value = config.TurnstileSecretKey },
                    }
                },
                new
                {
                    name = "Load balancing",
                    values = new object[]
                    {
                        new { name = nameof(config.LbSendInstanceMetrics).ToLower(), label = "Send metrics", value = config.LbSendInstanceMetrics },
                        new { name = nameof(config.LbTargetDomain).ToLower(), label = "Master instance domain", value = config.LbTargetDomain },
                        new { name = nameof(config.LbAuthToken).ToLower(), label = "Auth token", value = config.LbAuthToken },
                    }
                },
                new
                {
                    name = "Backups",
                    values = new object[]
                    {
                        new { name = nameof(config.EnableDatabaseBackup).ToLower(), label = "Enable database backups", value = config.EnableDatabaseBackup },
                        new { name = nameof(config.GithubToken).ToLower(), label = "GitHub personal token", value = config.GithubToken },
                        new { name = nameof(config.GithubRepositoryName).ToLower(), label = "GitHub repository name", value = config.GithubRepositoryName },
                        new { name = nameof(config.GithubReleaseId).ToLower(), label = "GitHub release id", value = config.GithubReleaseId },
                    }
                }
            };
    }
}

