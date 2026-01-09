using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddProbeForceHLS : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AudioCustomSourceProbeForceHLS",
                table: "MediaServerStreams",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "VideoStreamProbeForceHLS",
                table: "MediaServerStreams",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AudioCustomSourceProbeForceHLS",
                table: "MediaServerStreams");

            migrationBuilder.DropColumn(
                name: "VideoStreamProbeForceHLS",
                table: "MediaServerStreams");
        }
    }
}
