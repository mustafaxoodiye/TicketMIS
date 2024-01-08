namespace ticket_api.Entities;

public class WorkGroup:BaseEntity
{
    public string Name { get; set; }
    public long ProjectId { get; set; }
    public Project Project { get; set; }

    public virtual List<WorkGroupUser> workGroupUsers { get; set; }
}
