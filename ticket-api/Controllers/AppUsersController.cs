using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ticket_api.Data;
using ticket_api.Entities;
using ticket_api.Hubs;

namespace ticket_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppUsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<AppUser> _passwordHasher;

        public AppUsersController(AppDbContext context, IPasswordHasher<AppUser> passwordHasher)
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        // GET: api/AppUsers
        [HttpGet]
        [PermissionFilter(PermissionList.ListAppUsers)]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetAppUsers(RequestParams requestParams)
        {
            var q = await _context.AppUsers
                .Include(u => u.Role)
                .AsNoTracking()
                .PaginateAsync(requestParams, HttpContext.RequestAborted);

            return Ok(q);
        }

        // GET: api/AppUsers/5
        [HttpGet("{id}")]
        [PermissionFilter(PermissionList.ListAppUsers)]
        public async Task<ActionResult<AppUser>> GetAppUser(long id)
        {
            var user = await _context.AppUsers.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }


        [HttpPost]
        [PermissionFilter(PermissionList.RegisterAppUser)]
        public async Task<ActionResult<AppUser>> RegisterAppUser(RegisterUserDTO user)
        {
            // Check if a user with the same name exists in the DB first
            var userExists = _context.AppUsers.Any(u => u.UserName.Equals(user.UserName));
            if (userExists is true)
            {
                return BadRequest(new
                {
                    message = "UserName already exists."
                });
            }

            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // Create the user object
                    AppUser newAppUser = new()
                    {
                        UserName = user.UserName,
                        Password = user.Password,
                        RoleId = user.RoleId,
                        AccessableTickets=user.AccessableTickets,
                        FlagRestrictions=user.FlagRestrictions
                    };

                    // Hash the Password
                    var hashedPassword = _passwordHasher.HashPassword(newAppUser, user.Password);
                    newAppUser.Password = hashedPassword;

                    // Save the AppUser
                    _context.AppUsers.Add(newAppUser);
                    await _context.SaveChangesAsync();

                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return new BadRequestObjectResult(new { message = ex.Message, error = ex.InnerException });
                }
            }

            return Created("Created", new { });
        }

        [HttpPut("changeRole/{userId}")]
        [PermissionFilter(PermissionList.ChangeRole)]
        public async Task<IActionResult> ChangeRole(long userId, ChangeRoleDTO edit)
        {
            if (userId != edit.UserId)
            {
                return BadRequest();
            }

            var user = await _context.AppUsers.FirstOrDefaultAsync(d => d.Id == userId);
            if (user == null)
            {
                return NotFound();
            }

            user.RoleId = edit.RoleId;
            user.IsActive = edit.IsActive;

            _context.Entry(user).State = EntityState.Modified;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPut("changePassword/{userId}")]
        public async Task<IActionResult> ChangePassword(long userId, ChangePasswordDTO edit)
        {
            if (userId != edit.UserId)
            {
                return BadRequest();
            }

            var user = await _context.AppUsers.FirstOrDefaultAsync(d => d.Id == userId);
            if (user == null)
            {
                return NotFound();
            }

            var x = new Credentials() { UserName = user.UserName, Password = edit.OldPassword };
            var isAuthenticated = Authenticate(x, user);
            if (!isAuthenticated) return new UnauthorizedObjectResult(new { message = "You entered wrong Password, please try again.." });


            // Hash the Password
            var hashedPassword = _passwordHasher.HashPassword(user, edit.NewPassword);

            user.Password = hashedPassword;

            _context.Entry(user).State = EntityState.Modified;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool Authenticate(Credentials credentials, AppUser user)
        {
            // hash the password first
            var hashedPassword = _passwordHasher.VerifyHashedPassword(user, user.Password, credentials.Password);

            if (hashedPassword != PasswordVerificationResult.Success)
                return false;

            if (!_context.AppUsers.IgnoreQueryFilters().Any(u => u.UserName == credentials.UserName && u.Password == user.Password))
                return false;

            return true;
        }

        [HttpGet("CheckSession")]
        public async Task<IActionResult> CheckSession([FromServices]IHubContext<MainHub> hubContext)
        {
            //_ = hubContext.Clients.All.SendAsync("sayHi", "Hi all users");
            _ = hubContext.Clients.User("4").SendAsync("sayHi", "Hi all users");
            return Ok();
        }
    }
}
