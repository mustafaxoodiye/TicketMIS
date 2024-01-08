using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ticket_api.Data;

namespace ticket_api.Controllers;

[Route("api/[controller]")]
[ApiController]
[AllowAnonymous]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly IPasswordHasher<AppUser> _passwordHasher;

    public AuthController(AppDbContext context, IConfiguration configuration, IPasswordHasher<AppUser> passwordHasher)
    {
        _context = context;
        _configuration = configuration;
        _passwordHasher = passwordHasher;
    }

    [HttpPost]
    public async Task<IActionResult> Login(Credentials credentials)
    {
        // check if a user with this userName exists 
        var user = await _context.AppUsers
            .IgnoreQueryFilters()
            .Include(u => u.Role)
            .FirstOrDefaultAsync(u => u.UserName == credentials.UserName);
        if (user == null) return new UnauthorizedObjectResult(new { message = "You entered wrong credentials, please try again." });

        // check if the password is correct and get the token
        var isAuthenticated = Authenticate(credentials, user);
        if (!isAuthenticated) return new UnauthorizedObjectResult(new { message = "You entered wrong credentials, please try again." });

        // Get User Projects 
        var userProjects = await _context.UserProjectsVW.Where(u => u.UserId == user.Id).Select(s=>s.ProjectId).ToListAsync();

        var userInfo = new UserInfo
        {
            UserId = user.Id,
            UserName = user.UserName,
            IsSUDO = user.IsSUDO,
            RoleId = user.RoleId ?? 0,
            RoleName = user.Role != null ? user.Role.Name : "",
            UserProjects=userProjects,
            AccessableTickets=user.AccessableTickets,
            FlagRestrictions=user.FlagRestrictions
        };

        var token = GenerateToken(userInfo);
        return Ok(new { token = token });
    }

    [ApiExplorerSettings(IgnoreApi = true)]
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
    private string GenerateToken(UserInfo user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var tokenKey = Encoding.ASCII.GetBytes(_configuration["TokenKey"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                    new Claim("userId",user.UserId.ToString()),
                    new Claim("userName",user.UserName),
                    new Claim("isSUDO",user.IsSUDO.ToString()),
                    new Claim("roleId",user.RoleId.ToString()),
                    new Claim("roleName",user.RoleName),
                    new Claim("projects",JsonConvert.SerializeObject(user.UserProjects)),
                    new Claim("accessableTickets",JsonConvert.SerializeObject(user.AccessableTickets)),
                    new Claim("flagRestrictions",JsonConvert.SerializeObject(user.FlagRestrictions)),

                    new Claim(JwtRegisteredClaimNames.Sub,user.UserId.ToString()),
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = "https://localhost",
            Audience = "TicketMIS",
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(tokenKey),
                SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
