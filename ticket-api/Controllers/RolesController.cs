using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.Differencing;
using Microsoft.EntityFrameworkCore;
using ticket_api.Data;
using ticket_api.Entities;

namespace ticket_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RolesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [PermissionFilter(PermissionList.ListRoles)]
        public async Task<ActionResult<IEnumerable<Role>>> GetRoles(RequestParams requestParams)
        {
            if (_context.Roles == null)
            {
                return NotFound();
            }
            var query = await _context.Roles
                .AsNoTracking()
               .PaginateAsync(requestParams, HttpContext.RequestAborted);

            return Ok(query);
        }

        // GET: api/Roles/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Role>> GetRole(long id)
        {
            if (_context.Roles == null)
            {
                return NotFound();
            }
            var role = await _context.Roles.FindAsync(id);

            if (role == null)
            {
                return NotFound();
            }

            return role;
        }

        // PUT: api/Roles/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [PermissionFilter(PermissionList.AddRole)]
        public async Task<IActionResult> PutRole(long id, EditRoleDTO role)
        {
            if (id != role.Id)
            {
                return BadRequest();
            }

            var roleExists = await _context.Roles.FirstOrDefaultAsync(r => r.Id == id);
            if (roleExists == null) return NotFound();

            roleExists.Description = role.Description;
            roleExists.Permissions = role.Permissions;

            _context.Entry(roleExists).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/Roles
        [HttpPost]
        [PermissionFilter(PermissionList.AddRole)]
        public async Task<ActionResult<Role>> PostRole(CreateRoleDTO role)
        {
            // check if any role with the same name exists first
            if (RoleExistsByName(role.Name))
                return BadRequest(new { message = "a role with this name exists already." });

            Role newRole = new()
            {
                Name = role.Name,
                Description = role.Description,
                Permissions = role.Permissions,
                CreatedAt = DateTime.UtcNow,
                CreatedById = User.GetUserId(),
            };

            _context.Roles.Add(newRole);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetRole), new { id = newRole.Id }, newRole);
        }

        private bool RoleExistsByName(string roleName)
        {
            return _context.Roles.Any(e => e.Name == roleName);
        }
    }
}
