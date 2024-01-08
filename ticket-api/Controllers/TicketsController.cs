using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ticket_api.Data;
using ticket_api.Entities;
using ticket_api.Helpers;

namespace ticket_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserResolver _userResolver;

        public TicketsController(AppDbContext context, UserResolver userResolver)
        {
            _context = context;
            _userResolver = userResolver;
        }

        // GET: api/Tickets
        [HttpGet]
        public async Task<IActionResult> GetTickets([FromQuery] string? status, RequestParams requestParams)
        {
            var q = _context.Tickets
                .AsNoTracking()
                .Include(t => t.CreatedBy)
                .Include(t => t.Responsible)
                .Include(t => t.AssignedTo)
                .AsQueryable();

            if (status == null)
            {
                q = q.Where(q => q.CreatedById == User.GetUserId());
            }
            else
            {
                Enum.TryParse(status.CapitalizeFirst(), out TicketStatus statusE);
                q = q.Where(q => q.Status == statusE);

                if (statusE == TicketStatus.Approved || statusE == TicketStatus.In_Progress || statusE == TicketStatus.Resolved)
                    q = q.Include(t => t.AssignedTo)
                    .ThenInclude(a => a.workGroupUsers)
                    .Where(q => q.AssignedTo.workGroupUsers.Any(x => x.UserId == User.GetUserId()));

                //if (statusE == TicketStatus.Pending_Approval)
                //{
                //    var x = User.GetUserFlagRestrictions();
                //    q = q.Where(q=> EF.Functions.Like(q.Flags,"%,1,%"));
                //}

            }

            var list = await q.PaginateAsync(requestParams, HttpContext.RequestAborted);

            Enum.TryParse(status?.CapitalizeFirst(), out TicketStatus statusEx);
            if (statusEx == TicketStatus.Pending_Approval)
            {
                var x = User.GetUserFlagRestrictions();
                list.Items = list.Items.Where(q => q.Flags != null && q.Flags.Intersect(x).Any()).ToList();
            }

            return Ok(list);
        }

        // GET: api/Tickets/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Ticket>> GetTicket(long id)
        {
            var ticket = await _context.Tickets.FindAsync(id);

            if (ticket == null)
            {
                return NotFound();
            }

            return ticket;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTicket(long id, EditTicketDTO record)
        {
            if (id != record.Id)
            {
                return BadRequest();
            }

            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null) return new NotFoundObjectResult(new { message = "ticket not found." });

            if (ticket.Status != TicketStatus.New && ticket.Status != TicketStatus.Rejected)
                return new BadRequestObjectResult(new { message = "You can not update the ticket at this stage" });

            ticket.Title = record.Title;
            ticket.Description = record.Description;
            if (ticket.Status == TicketStatus.Rejected) ticket.Status = TicketStatus.New;

            _context.Entry(ticket).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Ticket>> PostTicket(PostTicketDTO record)
        {

            var ticket = new Ticket
            {
                Title = record.Title,
                Description = record.Description,
                Priority = record.Priority,
                ProjectId = _userResolver.GetProjectId(),
                Status = TicketStatus.New
            };

            _context.Tickets.Add(ticket);
            await _context.SaveChangesAsync();

            return Created("", new { });
        }

        // DELETE: api/Tickets/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTicket(long id)
        {
            var ticket = await _context.Tickets.FindAsync(id);
            if (ticket == null)
            {
                return NotFound();
            }

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("ChangeStatus/{id}")]
        public async Task<IActionResult> ChangeStatus(long id, ChangeTicketStatusDTO record)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    if (id != record.Id)
                    {
                        return BadRequest();
                    }

                    var ticket = await _context.Tickets.FirstOrDefaultAsync(t => t.Id == id);
                    if (ticket == null) return new NotFoundObjectResult(new { message = "ticket not found." });

                    ticket.Status = record.Status;

                    if (record.Status == TicketStatus.Pending_Approval)
                    {
                        // If the user assigns the task to a workgroup that he is a member of, Make that status directly In_Progress. No need for approval
                        var selectedWorkGroup = await _context.WorkGroups
                            .Include(w => w.workGroupUsers).FirstOrDefaultAsync(w => w.Id == record.AssignedTo);
                        if (selectedWorkGroup == null) return new NotFoundObjectResult(new { message = "Work group not found." });

                        if (selectedWorkGroup.workGroupUsers.Any(w => w.UserId == User.GetUserId()))
                            ticket.Status = TicketStatus.Approved;

                        ticket.AssignedToId = record.AssignedTo;
                        ticket.Priority = record.Priority ?? ticket.Priority;
                        ticket.Flags = record.Flags;
                    }

                    if (record.Status == TicketStatus.Approved)
                    {
                        ticket.Priority = record.Priority ?? ticket.Priority;
                    }

                    if (record.Status == TicketStatus.In_Progress)
                    {
                        ticket.StartDate = DateTime.Now;
                        ticket.EndDate = record.EndDate;
                        ticket.ResponsibleId = User.GetUserId();
                    }

                    if (record.Status == TicketStatus.Resolved)
                    {
                        ticket.ActualFinishingDate = DateTime.Now;
                    }

                    _context.Entry(ticket).State = EntityState.Modified;

                    var ticketRevission = new TicketRevision
                    {
                        TicketId = ticket.Id,
                        Remarks = record.Remarks,
                        Status = record.Status,
                    };

                    await _context.TicketRevisions.AddAsync(ticketRevission);

                    await _context.SaveChangesAsync();
                    transaction.Commit();

                    return NoContent();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return new BadRequestObjectResult(new
                    {
                        message = "Something went wrong. Please try again.",
                        stackTrace = ex.StackTrace
                    });
                }
            }
        }
    }
}
