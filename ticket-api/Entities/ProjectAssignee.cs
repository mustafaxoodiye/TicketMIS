namespace ticket_api.Entities;

public class ProjectAssignee:BaseEntity
{
    public long ProjectId { get; set; }
    public Project Project { get; set; }
    public long UserId { get; set; }
    public AppUser User { get; set; }
}
