using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUrlNativePlayerEmbedAddLbSettingsStreamOverride : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Url",
                table: "Source");

            migrationBuilder.DropColumn(
                name: "UseLegacyPlayer",
                table: "Source");

            migrationBuilder.DropColumn(
                name: "UseRTCEmbed",
                table: "Source");

            migrationBuilder.AddColumn<string>(
                name: "LbSettings",
                table: "Source",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StreamOverride",
                table: "Source",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LbSettings",
                table: "Source");

            migrationBuilder.DropColumn(
                name: "StreamOverride",
                table: "Source");

            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "Source",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "UseLegacyPlayer",
                table: "Source",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "UseRTCEmbed",
                table: "Source",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
