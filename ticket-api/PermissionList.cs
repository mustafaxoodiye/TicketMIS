namespace ticket_api;

public class PermissionList
{
    //AppUser Related Permissions
    public const string RegisterAppUser = "user.register_user";
    public const string ListAppUsers = "user.list_users";
    public const string ChangeRole = "user.change_role";

    //Role Related Permissions
    public const string ListRoles = "role.list_roles";
    public const string AddRole = "role.create_role";
}
