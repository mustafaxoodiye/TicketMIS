namespace ticket_api.Entities;

public class Role:BaseEntity
{
    public string Name { get; set; }
    public string Description { get; set; }
    public List<string> Permissions { get; set; }
}
