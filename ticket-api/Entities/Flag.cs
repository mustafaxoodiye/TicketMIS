namespace ticket_api.Entities;

public class Flag : BaseEntity
{
    public string Name { get; set; }
    public long ProjectId { get; set; }
    public Project Project { get; set; }
}
