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
    public class WorkGroupsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WorkGroupsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetWorkGroups()
        {
            return Ok (await _context.WorkGroups
                .AsNoTracking()
                //.Include(w=>w.workGroupUsers)
                .ToListAsync());
        }

    }
}
