using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ticket_api.Migrations
{
    public partial class changedTbls : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketRevisions_AppUsers_UserId",
                table: "TicketRevisions");

            migrationBuilder.DropIndex(
                name: "IX_TicketRevisions_UserId",
                table: "TicketRevisions");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TicketRevisions");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Tickets",
                type: "Date",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Tickets",
                type: "Date",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketRevisions_CreatedById",
                table: "TicketRevisions",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_TicketRevisions_AppUsers_CreatedById",
                table: "TicketRevisions",
                column: "CreatedById",
                principalTable: "AppUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TicketRevisions_AppUsers_CreatedById",
                table: "TicketRevisions");

            migrationBuilder.DropIndex(
                name: "IX_TicketRevisions_CreatedById",
                table: "TicketRevisions");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Tickets");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Tickets");

            migrationBuilder.AddColumn<long>(
                name: "UserId",
                table: "TicketRevisions",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);

            migrationBuilder.CreateIndex(
                name: "IX_TicketRevisions_UserId",
                table: "TicketRevisions",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_TicketRevisions_AppUsers_UserId",
                table: "TicketRevisions",
                column: "UserId",
                principalTable: "AppUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
