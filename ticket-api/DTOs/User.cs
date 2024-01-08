using System.ComponentModel.DataAnnotations;

namespace ticket_api.DTOs;

public class UserDTO
{
}

public class RegisterUserDTO
{
    [Required]
    public string UserName { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    public long RoleId { get; set; }
    public List<string>? AccessableTickets { get; set; }
    public List<long>? FlagRestrictions { get; set; }
}

public class ChangeRoleDTO
{
    public long UserId { get; set; }
    public long RoleId { get; set; }
    public bool IsActive { get; set; }
}

public class ChangePasswordDTO
{
    public long UserId { get; set; }
    public string OldPassword { get; set; }
    public string NewPassword { get; set; }
}

public class Credentials
{
    public string UserName { get; set; }
    public string Password { get; set; }
}

public class UserInfo
{
    public string UserName { get; set; }
    public long UserId { get; set; }
    public long RoleId { get; set; }
    public string RoleName { get; set; }
    public bool IsSUDO { get; set; }
    public List<long> UserProjects { get; set; }
    public List<string?> AccessableTickets { get; set; }
    public List<long>? FlagRestrictions { get; set; }
}