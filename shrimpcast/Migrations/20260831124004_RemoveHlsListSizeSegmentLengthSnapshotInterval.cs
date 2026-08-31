using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class RemoveHlsListSizeSegmentLengthSnapshotInterval : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ListSize",
                table: "MediaServerStreams");

            migrationBuilder.DropColumn(
                name: "SegmentLength",
                table: "MediaServerStreams");

            migrationBuilder.DropColumn(
                name: "SnapshotInterval",
                table: "MediaServerStreams");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ListSize",
                table: "MediaServerStreams",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SegmentLength",
                table: "MediaServerStreams",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SnapshotInterval",
                table: "MediaServerStreams",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
