using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ticket_api.Migrations
{
    public partial class fixedcreatedBy : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsDelated",
                table: "Tickets",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Tickets",
                newName: "CreatedById");

            migrationBuilder.RenameColumn(
                name: "IsDelated",
                table: "TicketRevisions",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "TicketRevisions",
                newName: "CreatedById");

            migrationBuilder.RenameColumn(
                name: "IsDelated",
                table: "Roles",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Roles",
                newName: "CreatedById");

            migrationBuilder.RenameColumn(
                name: "IsDelated",
                table: "Projects",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "Projects",
                newName: "CreatedById");

            migrationBuilder.RenameColumn(
                name: "IsDelated",
                table: "ProjectAssignees",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "ProjectAssignees",
                newName: "CreatedById");

            migrationBuilder.RenameColumn(
                name: "IsDelated",
                table: "AppUsers",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "AppUsers",
                newName: "CreatedById");

            migrationBuilder.RenameColumn(
                name: "IsDelated",
                table: "ApprovalWorkflows",
                newName: "IsDeleted");

            migrationBuilder.RenameColumn(
                name: "CreatedBy",
                table: "ApprovalWorkflows",
                newName: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Tickets_CreatedById",
                table: "Tickets",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Tickets_AppUsers_CreatedById",
                table: "Tickets",
                column: "CreatedById",
                principalTable: "AppUsers",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tickets_AppUsers_CreatedById",
                table: "Tickets");

            migrationBuilder.DropIndex(
                name: "IX_Tickets_CreatedById",
                table: "Tickets");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "Tickets",
                newName: "IsDelated");

            migrationBuilder.RenameColumn(
                name: "CreatedById",
                table: "Tickets",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "TicketRevisions",
                newName: "IsDelated");

            migrationBuilder.RenameColumn(
                name: "CreatedById",
                table: "TicketRevisions",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "Roles",
                newName: "IsDelated");

            migrationBuilder.RenameColumn(
                name: "CreatedById",
                table: "Roles",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "Projects",
                newName: "IsDelated");

            migrationBuilder.RenameColumn(
                name: "CreatedById",
                table: "Projects",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "ProjectAssignees",
                newName: "IsDelated");

            migrationBuilder.RenameColumn(
                name: "CreatedById",
                table: "ProjectAssignees",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "AppUsers",
                newName: "IsDelated");

            migrationBuilder.RenameColumn(
                name: "CreatedById",
                table: "AppUsers",
                newName: "CreatedBy");

            migrationBuilder.RenameColumn(
                name: "IsDeleted",
                table: "ApprovalWorkflows",
                newName: "IsDelated");

            migrationBuilder.RenameColumn(
                name: "CreatedById",
                table: "ApprovalWorkflows",
                newName: "CreatedBy");
        }
    }
}
