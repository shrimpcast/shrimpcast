using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddTurnstileVerificationMode : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EnableTurnstileMode",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "TurnstilePublicKey",
                table: "Configuration",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TurnstileSecretKey",
                table: "Configuration",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnableTurnstileMode",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "TurnstilePublicKey",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "TurnstileSecretKey",
                table: "Configuration");
        }
    }
}
