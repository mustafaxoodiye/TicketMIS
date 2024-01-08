using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ticket_api.Migrations
{
    public partial class changedTbls4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "ResponsibleId",
                table: "Tickets",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_ResponsibleId",
                table: "Tickets",
                column: "ResponsibleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_AppUsers_ResponsibleId",
                table: "Tickets",
                column: "ResponsibleId",
                principalTable: "AppUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_AppUsers_ResponsibleId",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_ResponsibleId",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "ResponsibleId",
                table: "Tickets");
        }
    }
}
