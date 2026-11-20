using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class V226 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SessionToken",
                table: "Session",
                newName: "HashedSessionToken");

            migrationBuilder.AddColumn<bool>(
                name: "RequiresGoldStatus",
                table: "MediaServerStreams",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Session_HashedSessionToken",
                table: "Session",
                column: "HashedSessionToken",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Session_HashedSessionToken",
                table: "Session");

            migrationBuilder.DropColumn(
                name: "RequiresGoldStatus",
                table: "MediaServerStreams");

            migrationBuilder.RenameColumn(
                name: "HashedSessionToken",
                table: "Session",
                newName: "SessionToken");
        }
    }
}
