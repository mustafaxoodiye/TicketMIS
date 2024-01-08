namespace ticket_api.Entities;

public class Project : BaseEntity
{
    public string Name { get; set; }
    public bool HasApprovalWorkflow { get; set; } = false;
    public int NumberOfApprovals { get; set; } = 0;

    public virtual List<ProjectAssignee> projectAssignees { get; set; }
}
