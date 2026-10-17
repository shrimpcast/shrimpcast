using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddDatabaseBackup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "EnableDatabaseBackup",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<long>(
                name: "GithubReleaseId",
                table: "Configuration",
                type: "bigint",
                nullable: true,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "GithubRepositoryName",
                table: "Configuration",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GithubToken",
                table: "Configuration",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnableDatabaseBackup",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "GithubReleaseId",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "GithubRepositoryName",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "GithubToken",
                table: "Configuration");
        }
    }
}
