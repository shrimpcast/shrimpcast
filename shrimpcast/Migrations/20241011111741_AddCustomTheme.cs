using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomTheme : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "BTCServerWebhookSecret",
                table: "Configuration",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(
                name: "PalettePrimary",
                table: "Configuration",
                type: "text",
                nullable: false,
                defaultValue: "blueGrey");

            migrationBuilder.AddColumn<string>(
                name: "PaletteSecondary",
                table: "Configuration",
                type: "text",
                nullable: false,
                defaultValue: "orange");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PalettePrimary",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "PaletteSecondary",
                table: "Configuration");

            migrationBuilder.AlterColumn<string>(
                name: "BTCServerWebhookSecret",
                table: "Configuration",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
