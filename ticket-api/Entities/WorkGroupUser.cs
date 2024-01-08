namespace ticket_api.Entities;

public class WorkGroupUser:BaseEntity
{
    public long WorkGroupId { get; set; }
    public WorkGroup WorkGroup { get; set; }
    public long UserId { get; set; }
    public AppUser User { get; set; }
}
