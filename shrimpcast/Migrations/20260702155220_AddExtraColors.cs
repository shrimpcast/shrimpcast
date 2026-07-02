using Microsoft.EntityFrameworkCore.Migrations;
using shrimpcast.Entities.DB;

#nullable disable

namespace shrimpcast.Migrations
{
    /// <inheritdoc />
    public partial class AddExtraColors : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData("NameColour", [nameof(NameColour.ColourHex)], new object[,]
            {
               { "#795548"},
               { "#9e9e9e"},
               { "#607d8b"},
            });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
               table: "NameColour",
               keyColumn: nameof(NameColour.ColourHex),
               keyValues:
               [
                 "#795548",
                 "#9e9e9e",
                 "#607d8b",
               ]);
        }
    }
}
