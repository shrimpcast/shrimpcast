using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddVpnAddressDetectionService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "BlockTORConnections",
                table: "Configuration",
                newName: "SiteBlockVPNConnections");

            migrationBuilder.AddColumn<bool>(
                name: "ChatBlockTORConnections",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ChatBlockVPNConnections",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "IPServiceApiKey",
                table: "Configuration",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SiteBlockTORConnections",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "VpnAddress",
                columns: table => new
                {
                    VpnAddressId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IsVPN = table.Column<bool>(type: "boolean", nullable: false),
                    RemoteAddress = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VpnAddress", x => x.VpnAddressId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_VpnAddress_RemoteAddress",
                table: "VpnAddress",
                column: "RemoteAddress",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VpnAddress");

            migrationBuilder.DropColumn(
                name: "ChatBlockTORConnections",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "ChatBlockVPNConnections",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "IPServiceApiKey",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "SiteBlockTORConnections",
                table: "Configuration");

            migrationBuilder.RenameColumn(
                name: "SiteBlockVPNConnections",
                table: "Configuration",
                newName: "BlockTORConnections");
        }
    }
}
