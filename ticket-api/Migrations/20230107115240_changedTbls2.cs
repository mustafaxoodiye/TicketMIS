using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ticket_api.Migrations
{
    public partial class changedTbls2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ActualFinishingDate",
                table: "Tickets",
                type: "Date",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActualFinishingDate",
                table: "Tickets");
        }
    }
}
