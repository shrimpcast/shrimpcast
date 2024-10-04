using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class GoldenPassDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsGolden",
                table: "Session",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "GoldenPassTitle",
                table: "Configuration",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "GoldenPassValue",
                table: "Configuration",
                type: "integer",
                nullable: false,
                defaultValue: 50);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsGolden",
                table: "Session");

            migrationBuilder.DropColumn(
                name: "GoldenPassTitle",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "GoldenPassValue",
                table: "Configuration");
        }
    }
}
