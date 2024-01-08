using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using ticket_api.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Linq;

namespace ticket_api.Filters;

public class PermissionFilterAttribute : Attribute, IAsyncAuthorizationFilter
{
    private readonly string _permission;

    public PermissionFilterAttribute(string permission)
    {
        _permission = permission;
    }
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var dbContext = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
        try
        {
            // Check the user is permitted to acess the projectID given in the request's header.
            var userProjects = JsonConvert.DeserializeObject<List<long>>(context.HttpContext.User.FindFirstValue("projects"));
            if(userProjects == null || !userProjects.Any(u=>u == GetProjectId(context)))
            {
                context.Result = new UnauthorizedObjectResult(new {message="You requested a project to which you are not assigned."});
                return;
            }

            if (!bool.Parse(context.HttpContext.User.FindFirstValue("isSUDO")))
            {
                if (!int.TryParse(context.HttpContext.User.FindFirstValue("roleId"), out var roleId))
                {
                    roleId = 0; // Set this to system-level default role id.
                }

                // I think it is better to cache all the roles with time interval (each x number of minutes)??
                var role = await dbContext.Roles.FirstOrDefaultAsync(r => r.Id == roleId, context.HttpContext.RequestAborted);
                if (role is null)
                {
                    context.Result = new ForbidResult();
                    return;
                }

                if (!role.Permissions.Contains(_permission))
                {
                    context.Result = new ForbidResult();
                    return;
                }
            }

        }
        catch (Exception ex)
        {
            context.Result = new BadRequestObjectResult(new
            {
                message = "Something went wrong...",
                error = ex.Message,
            });
            return;
        }

        // If we run this far, everything is okay! :)
    }

    public long GetProjectId(AuthorizationFilterContext context)
    {
        if (context.HttpContext?.Request.Headers.ContainsKey("project-id") == false)
        {
            return 0;
        }

        var projectId = context.HttpContext?.Request.Headers["project-id"].ToString();
        _ = long.TryParse(projectId, out var pId);
        return pId;
    }

}
