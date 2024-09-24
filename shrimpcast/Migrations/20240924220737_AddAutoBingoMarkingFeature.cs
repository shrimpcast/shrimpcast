using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddAutoBingoMarkingFeature : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AutoMarkingSecondsThreshold",
                table: "Configuration",
                type: "integer",
                nullable: false,
                defaultValue: 5);

            migrationBuilder.AddColumn<int>(
                name: "AutoMarkingUserCountThreshold",
                table: "Configuration",
                type: "integer",
                nullable: false,
                defaultValue: 3);

            migrationBuilder.AddColumn<bool>(
                name: "EnableAutoBingoMarking",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AutoMarkingSecondsThreshold",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "AutoMarkingUserCountThreshold",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "EnableAutoBingoMarking",
                table: "Configuration");
        }
    }
}
