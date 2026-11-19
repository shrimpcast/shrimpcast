using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class V226PendingChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "SessionTokenLookupKey",
                table: "Session",
                type: "character varying(16)",
                maxLength: 16,
                nullable: true);

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

            migrationBuilder.CreateIndex(
                name: "IX_Session_SessionTokenLookupKey",
                table: "Session",
                column: "SessionTokenLookupKey",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Session_HashedSessionToken",
                table: "Session");

            migrationBuilder.DropIndex(
                name: "IX_Session_SessionTokenLookupKey",
                table: "Session");

            migrationBuilder.DropColumn(
                name: "SessionTokenLookupKey",
                table: "Session");

            migrationBuilder.DropColumn(
                name: "RequiresGoldStatus",
                table: "MediaServerStreams");
        }
    }
}
