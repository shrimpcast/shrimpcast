using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddSourcesTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnableMultistreams",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "PrimaryStreamUrl",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "PrimaryUrlName",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "SecondaryStreamUrl",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "SecondaryUrlName",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "StreamEnabled",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "UseLegacyPlayer",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "UsePrimarySource",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "UseRTCEmbed",
                table: "Configuration");

            migrationBuilder.CreateTable(
                name: "Source",
                columns: table => new
                {
                    SourceId = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    Thumbnail = table.Column<string>(type: "text", nullable: false),
                    IsEnabled = table.Column<bool>(type: "boolean", nullable: false),
                    UseLegacyPlayer = table.Column<bool>(type: "boolean", nullable: false),
                    UseRTCEmbed = table.Column<bool>(type: "boolean", nullable: false),
                    ConfigurationId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Source", x => x.SourceId);
                    table.ForeignKey(
                        name: "FK_Source_Configuration_ConfigurationId",
                        column: x => x.ConfigurationId,
                        principalTable: "Configuration",
                        principalColumn: "ConfigurationId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Source_ConfigurationId",
                table: "Source",
                column: "ConfigurationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Source");

            migrationBuilder.AddColumn<bool>(
                name: "EnableMultistreams",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryStreamUrl",
                table: "Configuration",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrimaryUrlName",
                table: "Configuration",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondaryStreamUrl",
                table: "Configuration",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SecondaryUrlName",
                table: "Configuration",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "StreamEnabled",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "UseLegacyPlayer",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "UsePrimarySource",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "UseRTCEmbed",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
