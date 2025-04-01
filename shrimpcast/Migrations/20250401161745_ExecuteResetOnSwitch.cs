using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class ExecuteResetOnSwitch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PreStart",
                table: "Source");

            migrationBuilder.AddColumn<bool>(
                name: "ResetOnScheduledSwitch",
                table: "Source",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResetOnScheduledSwitch",
                table: "Source");

            migrationBuilder.AddColumn<string>(
                name: "PreStart",
                table: "Source",
                type: "text",
                nullable: true);
        }
    }
}
