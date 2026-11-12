namespace shrimpcast.Entities.DB
{
    public class PrivateConfiguration : PublicConfiguration
    {
        public required bool EnableVerifiedMode { get; set; }

        public required int MaxConnectionsPerIP { get; set; }

        public required int MaxConnectedUsers { get; set; }

        public required string DefaultName { get; set; }

        public required int MessageDelayTime { get; set; }

        public required int RequiredTokenTimeInMinutes { get; set; }

        public required int OffsetDateTimeInMinutes { get; set; }

        public required bool EnableAutoBingoMarking { get; set; }

        public required int AutoMarkingUserCountThreshold { get; set; }

        public required int AutoMarkingSecondsThreshold { get; set; }

        public required int MinSentToParticipate { get; set; }

        public required int MuteLenghtInMinutes { get; set; }

        public required bool SiteBlockTORConnections { get; set; }

        public required bool ChatBlockTORConnections { get; set; }

        public required bool SiteBlockVPNConnections { get; set; }

        public required bool ChatBlockVPNConnections { get; set; }

        public string? IPServiceApiURL { get; set; } = string.Empty;

        public string? IPServiceApiKey { get; set; } = string.Empty;

        public required string OptionalApiKeyHeader { get; set; }

        public string? VPNDetectionMatchCriteria { get; set; } = string.Empty;

        public string? OBSHost { get; set; } = string.Empty;

        public string? OBSPassword { get; set; } = string.Empty;

        public required string OBSMainScene { get; set; }

        public required string OBSMainSource { get; set; }

        public required string OBSKinoSource { get; set; }

        public required string OBSMusicSource { get; set; }

        public required int MinABTimeInMs { get; set; }

        public required int MaxABTimeInMs { get; set; }

        public string? VAPIDPrivateKey { get; set; } = string.Empty;

        public string? VAPIDMail { get; set; } = string.Empty;

        public required string BTCServerInstanceURL { get; set; }

        public required string BTCServerStoreId { get; set; }

        public string? BTCServerWebhookSecret { get; set; } = string.Empty;

        public string? BTCServerApiKey { get; set; } = string.Empty;

        public string? StripeSecretKey { get; set; } = string.Empty;

        public string? StripeWebhookSecret { get; set; } = string.Empty;

        public string? TurnstileSecretKey { get; set; } = string.Empty;

        public required bool ForceLatestVersion { get; set; }

        public required int RequiredTimeToPostLinksMinutes { get; set; }

        public required uint TurnstileSkipThreshold { get; set; }

        public required bool LbSendInstanceMetrics { get; set; }

        public required string LbTargetDomain { get; set; }

        public string? LbAuthToken { get; set; } = string.Empty;

        public bool EnableDatabaseBackup { get; set; }

        public string? GithubToken { get; set; } = string.Empty;

        public long? GithubReleaseId { get; set; } = null;

        public string? GithubRepositoryName { get; set; } = string.Empty;
        
        public required DateTime OpenAt { get; set; }
    }
}
