namespace shrimpcast.Entities.DB
{
    public class PublicConfiguration
    {
        public required bool ChatEnabled { get; set; }

        public required bool ShowUserLabels { get; set; }

        public required bool StreamEnabled { get; set; }

        public List<Source> Sources { get; set; } = [];

        public required string StreamTitle { get; set; }

        public required string StreamDescription { get; set; }

        public required int MaxMessagesToShow { get; set; }

        public required int MaxLengthTruncation { get; set; }

        public required bool ShowBingo { get; set; }
        
        public required string BingoTitle { get; set; }

        public required bool ShowPoll { get; set; }
        
        public required bool AcceptNewOptions { get; set; }
        
        public required bool AcceptNewVotes { get; set; }

        public required bool EnableVoteSkip { get; set; }

        public required ushort VoteSkipMaxTimeMinutes { get; set; }

        public required bool ShowVotes { get; set; }

        public required string PollTitle { get; set; }

        public required bool EnableFireworks { get; set; }

        public required bool EnableChristmasTheme { get; set; }

        public required int SnowflakeCount { get; set; }

        public string? VAPIDPublicKey { get; set; }

        public required bool ShowGoldenPassButton { get; set; }

        public required int GoldenPassValue { get; set; }

        public required string GoldenPassTitle { get; set; }

        public required string PalettePrimary { get; set; }

        public required string PaletteSecondary { get; set; }

        public required bool UseDarkTheme { get; set; }

        public required bool EnableHalloweenTheme { get; set; }
        
        public required bool EnableStripe { get; set; }

        public required bool EnableBTCServer { get; set; }
        
        public required bool EnableTurnstileMode { get; set; }

        public string? TurnstileTitle { get; set; }
        
        public string? TurnstilePublicKey { get; set; }

        public required bool EnablePWA { get; set; }

        public required bool ShowConnectedUsers { get; set; }
        
        public required bool ShowViewerCountPerStream { get; set; }
        
        public required bool TurnstileManagedMode { get; set; }

        public required bool StripNonASCIIChars { get; set; }
    }
}
