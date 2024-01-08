using System.Data;
using System.Text.Json.Serialization;

namespace ticket_api.Entities;

public class AppUser:BaseEntity
{
    public string UserName { get; set; }
    [JsonIgnore]
    public string Password { get; set; }
    public bool IsActive { get; set; } = true;
    public long? RoleId { get; set; }
    public Role Role { get; set; }
    public bool IsSUDO { get; set; } = false;

    public List<string>? AccessableTickets { get; set; }
    public List<long>? FlagRestrictions { get; set; }
}
