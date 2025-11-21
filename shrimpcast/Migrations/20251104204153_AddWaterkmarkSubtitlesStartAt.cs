using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddWaterkmarkSubtitlesStartAt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<TimeSpan>(
                name: "StartAt",
                table: "MediaServerStreams",
                type: "interval",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Subtitles",
                table: "MediaServerStreams",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Watermark",
                table: "MediaServerStreams",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StartAt",
                table: "MediaServerStreams");

            migrationBuilder.DropColumn(
                name: "Subtitles",
                table: "MediaServerStreams");

            migrationBuilder.DropColumn(
                name: "Watermark",
                table: "MediaServerStreams");
        }
    }
}
