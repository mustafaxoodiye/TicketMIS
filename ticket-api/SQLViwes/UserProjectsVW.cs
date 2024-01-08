namespace ticket_api.SQLViwes;

public class UserProjectsVW
{
    public long ProjectId { get; set; }
    public string ProjectName { get; set; }
    public bool HasApprovalWorkflow { get; set; } = false;
    public int NumberOfApprovals { get; set; } = 0;
    public long UserId { get; set; }
}
