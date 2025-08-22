using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class RenameColorColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserDisplayColor",
                table: "Session",
                newName: "UserColorDisplay");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UserColorDisplay",
                table: "Session",
                newName: "UserDisplayColor");
        }
    }
}
