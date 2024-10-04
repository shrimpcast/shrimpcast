using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddGoldenPass : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "ShowGoldenPassButton",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShowGoldenPassButton",
                table: "Configuration");
        }
    }
}
