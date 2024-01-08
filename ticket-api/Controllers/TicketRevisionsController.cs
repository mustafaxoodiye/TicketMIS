using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ticket_api.Data;
using ticket_api.Entities;

namespace ticket_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketRevisionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TicketRevisionsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("Ticket/{id}")]
        public async Task<IActionResult> GetTicketRevisions(long id)
        {
            return Ok(await _context.TicketRevisions.Include(r=>r.CreatedBy).Where(r => r.TicketId == id).ToListAsync());
        }

    }
}
