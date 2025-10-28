using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddMediaServerStream : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MediaServerStreams",
                columns: table => new
                {
                    MediaServerStreamId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    IngressUri = table.Column<string>(type: "text", nullable: false),
                    HlsVersion = table.Column<int>(type: "integer", nullable: false),
                    SegmentLength = table.Column<int>(type: "integer", nullable: false),
                    ListSize = table.Column<int>(type: "integer", nullable: false),
                    SnapshotInterval = table.Column<int>(type: "integer", nullable: false),
                    LowLatency = table.Column<bool>(type: "boolean", nullable: false),
                    VideoStreamIndex = table.Column<int>(type: "integer", nullable: false),
                    VideoEncodingPreset = table.Column<string>(type: "text", nullable: false),
                    VideoTranscodingBitrate = table.Column<int>(type: "integer", nullable: false),
                    VideoTranscodingFramerate = table.Column<int>(type: "integer", nullable: false),
                    VideoTranscodingPreset = table.Column<string>(type: "text", nullable: true),
                    AudioStreamIndex = table.Column<int>(type: "integer", nullable: false),
                    AudioEncodingPreset = table.Column<string>(type: "text", nullable: false),
                    AudioAACBitrate = table.Column<int>(type: "integer", nullable: false),
                    AudioTranscodingVolume = table.Column<int>(type: "integer", nullable: false),
                    AudioTranscodingLoudnessNormalization = table.Column<bool>(type: "boolean", nullable: false),
                    AudioCustomSource = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaServerStreams", x => x.MediaServerStreamId);
                });

            migrationBuilder.CreateTable(
                name: "MediaServerStreamHeader",
                columns: table => new
                {
                    MediaServerStreamHeaderId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    MediaServerStreamId = table.Column<int>(type: "integer", nullable: false),
                    Header = table.Column<string>(type: "text", nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaServerStreamHeader", x => x.MediaServerStreamHeaderId);
                    table.ForeignKey(
                        name: "FK_MediaServerStreamHeader_MediaServerStreams_MediaServerStrea~",
                        column: x => x.MediaServerStreamId,
                        principalTable: "MediaServerStreams",
                        principalColumn: "MediaServerStreamId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MediaServerStreamHeader_MediaServerStreamId",
                table: "MediaServerStreamHeader",
                column: "MediaServerStreamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MediaServerStreamHeader");

            migrationBuilder.DropTable(
                name: "MediaServerStreams");
        }
    }
}
