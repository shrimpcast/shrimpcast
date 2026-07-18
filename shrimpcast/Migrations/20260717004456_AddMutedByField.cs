using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddMutedByField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MutedBySessionId",
                table: "Session",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Session_MutedBySessionId",
                table: "Session",
                column: "MutedBySessionId");

            migrationBuilder.AddForeignKey(
                name: "FK_Session_Session_MutedBySessionId",
                table: "Session",
                column: "MutedBySessionId",
                principalTable: "Session",
                principalColumn: "SessionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Session_Session_MutedBySessionId",
                table: "Session");

            migrationBuilder.DropIndex(
                name: "IX_Session_MutedBySessionId",
                table: "Session");

            migrationBuilder.DropColumn(
                name: "MutedBySessionId",
                table: "Session");
        }
    }
}
