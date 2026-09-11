using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class MakeVoteSkipEnabledBoolean : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "MaxRequiredVoteSkipVotes",
                table: "Configuration");

            migrationBuilder.DropColumn(
                name: "VoteSkipPercentageThreshold",
                table: "Configuration");

            migrationBuilder.AddColumn<bool>(
                name: "EnableVoteSkip",
                table: "Configuration",
                type: "boolean",
                nullable: false,
                defaultValue: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EnableVoteSkip",
                table: "Configuration");

            migrationBuilder.AddColumn<int>(
                name: "MaxRequiredVoteSkipVotes",
                table: "Configuration",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "VoteSkipPercentageThreshold",
                table: "Configuration",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
