namespace shrimpcast.Entities.DB
{
    public class MediaServerStream
    {
        public int MediaServerStreamId { get; set; }

        public required bool IsEnabled { get; set; }

        public required string Name { get; set; }

        public required string IngressUri { get; set; }

        public required int HlsVersion { get; set; }   

        public required int SegmentLength { get; set; }

        public required int ListSize { get; set; }

        public required int SnapshotInterval { get; set; }

        public required bool LowLatency { get; set; }

        public string? CustomHeaders { get; set; }

        public string? CustomAudioHeaders { get; set; }

        public required int VideoStreamIndex { get; set; }

        public required string VideoEncodingPreset { get; set; }

        public int VideoTranscodingBitrate { get; set; }

        public int VideoTranscodingFramerate { get; set; }

        public string? VideoTranscodingPreset { get; set; }

        public int? AudioStreamIndex { get; set; }

        public string? AudioEncodingPreset { get; set; }

        public int AudioAACBitrate { get; set; }

        public int AudioTranscodingVolume { get; set; }

        public bool AudioTranscodingLoudnessNormalization { get; set; }

        public string? AudioCustomSource { get; set; }
    }
}
