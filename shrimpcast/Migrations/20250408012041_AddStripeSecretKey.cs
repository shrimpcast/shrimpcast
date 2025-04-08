using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddStripeSecretKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "StripeSecretKey",
                table: "Configuration",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StripeSecretKey",
                table: "Configuration");
        }
    }
}
