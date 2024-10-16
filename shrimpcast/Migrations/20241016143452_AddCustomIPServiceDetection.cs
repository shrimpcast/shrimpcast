using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomIPServiceDetection : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IPServiceApiURL",
                table: "Configuration",
                type: "text",
                nullable: false,
                defaultValue: "http://ip-api.com/json/{IP}?fields=66846719");

            migrationBuilder.AddColumn<string>(
                name: "OptionalApiKeyHeader",
                table: "Configuration",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "VPNDetectionMatchCriteria",
                table: "Configuration",
                type: "text",
                nullable: false,
                defaultValue: "[hosting:true][proxy:true]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IPServiceApiURL",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "OptionalApiKeyHeader",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "VPNDetectionMatchCriteria",
                table: "Configuration");
        }
    }
}
