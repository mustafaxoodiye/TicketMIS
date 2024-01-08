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
    public class ProjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProjectsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Projects
        [HttpGet("userProjects")]
        public async Task<IActionResult> GetUserProjects()
        {
            return Ok(await _context.UserProjectsVW.Where(u=>u.UserId == User.GetUserId()).ToListAsync());
        }

    }
}
