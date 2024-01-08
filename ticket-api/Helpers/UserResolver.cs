using Newtonsoft.Json;
using System.Security.Claims;

namespace ticket_api.Helpers;

public class UserResolver
{
    private readonly IHttpContextAccessor _contextAccessor;

    public UserResolver(IHttpContextAccessor contextAccessor)
    {
        _contextAccessor = contextAccessor;
    }

    public int GetUserId()
    {
        return _contextAccessor.HttpContext?.User.GetUserId() ?? 0;
    }

    public long GetProjectId()
    {
        if (_contextAccessor.HttpContext?.Request.Headers.ContainsKey("project-id") == false)
        {
            return 0;
        }

        var projectId = _contextAccessor.HttpContext?.Request.Headers["project-id"].ToString();
        _ = long.TryParse(projectId, out var pId);
        return pId;
    }
}

public static class UserExtensions
{
    public static int GetUserId(this ClaimsPrincipal principal)
    {
        if (!int.TryParse(principal?.FindFirstValue("userId"), out var userId))
        {
            return 0;
        }

        return userId;
    }
    public static List<long> GetUserFlagRestrictions(this ClaimsPrincipal principal)
    {
        var flags = JsonConvert.DeserializeObject<List<long>>(principal?.FindFirstValue("flagRestrictions") ?? "[]");
        if (flags == null) return new List<long>();

        return flags;
    }
}
