namespace ticket_api.Helpers;

public record Permission(string Title, string Value);

public record PermissionGroup(string Title, List<Permission> Permissions);

// add this to Helpers
public static class PermissionExtenssions
{
    private static readonly List<PermissionGroup> _permissionGroups = new();

    public static List<PermissionGroup> GetPermissions()
    {
        if (_permissionGroups.Any())
        {
            return _permissionGroups;
        }

        var type = typeof(PermissionList);

        var members = type.GetFields();
        foreach (var member in members)
        {
            var value = member.GetValue(null)?.ToString();
            if (string.IsNullOrEmpty(value))
            {
                continue;
            }

            var permissionParts = value.Split('.', StringSplitOptions.RemoveEmptyEntries);
            if (permissionParts.Length < 2)
            {
                continue;
            }


            var permisssion = new Permission(permissionParts[1].Capitalize().Replace('_', ' '), value);

            var groupTitle = permissionParts[0].Capitalize();
            if (_permissionGroups.Any(k => k.Title == groupTitle))
            {
                _permissionGroups.FirstOrDefault(g => g.Title == groupTitle)?.Permissions.Add(permisssion);
            }
            else
            {
                var permissions = new List<Permission>();
                permissions.Add(permisssion);
                var group = new PermissionGroup(groupTitle, permissions);
                _permissionGroups.Add(group);
            }

        }

        return _permissionGroups;
    }

    public static List<string> GetFrontEndPermissions(List<string> permissions)
    {
        var frontEndPermissions = new List<string>();

        foreach (var member in permissions)
        {
            var permissionParts = member.Split('.', StringSplitOptions.RemoveEmptyEntries);
            if (permissionParts.Length < 2)
            {
                continue;
            }

            frontEndPermissions.Add(permissionParts[1]);
        }

        return frontEndPermissions;
    }
}


