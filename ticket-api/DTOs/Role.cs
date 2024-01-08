namespace ticket_api.DTOs;

public class RoleDTO
{
}

public class EditRoleDTO
{
    public int Id { get; set; }
    public string Description { get; set; }
    public List<string> Permissions { get; set; }
}

public class CreateRoleDTO
{
    public string Name { get; set; }
    public string Description { get; set; }
    public List<string> Permissions { get; set; }
}