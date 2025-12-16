using Microsoft.EntityFrameworkCore.Migrations;
using shrimpcast.Helpers;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddLoadBalancingMetrics : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LbAuthToken",
                table: "Configuration",
                type: "text",
                nullable: true,
                defaultValue: SecureToken.GenerateTokenThreadSafe());

            migrationBuilder.AddColumn<bool>(
                name: "LbSendInstanceMetrics",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "LbTargetDomain",
                table: "Configuration",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LbAuthToken",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "LbSendInstanceMetrics",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "LbTargetDomain",
                table: "Configuration");
        }
    }
}
