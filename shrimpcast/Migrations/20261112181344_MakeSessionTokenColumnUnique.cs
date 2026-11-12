using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class MakeSessionTokenColumnUnique : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
        }
    }
}
