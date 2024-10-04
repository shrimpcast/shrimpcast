using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddBTCServerDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BTCServerApiKey",
                table: "Configuration",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BTCServerInstanceURL",
                table: "Configuration",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BTCServerApiKey",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "BTCServerInstanceURL",
                table: "Configuration");
        }
    }
}
