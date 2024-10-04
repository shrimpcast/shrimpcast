using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddBTCServerStoreId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BTCServerStoreId",
                table: "Configuration",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BTCServerStoreId",
                table: "Configuration");
        }
    }
}
