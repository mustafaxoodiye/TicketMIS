using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ticket_api.Migrations
{
    public partial class changedTbls3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_AppUsers_AssignedToId",
                table: "Tickets");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_WorkGroups_AssignedToId",
                table: "Tickets",
                column: "AssignedToId",
                principalTable: "WorkGroups",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_WorkGroups_AssignedToId",
                table: "Tickets");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_AppUsers_AssignedToId",
                table: "Tickets",
                column: "AssignedToId",
                principalTable: "AppUsers",
                principalColumn: "Id");
        }
    }
}
