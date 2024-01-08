namespace ticket_api;

public enum TicketPriorityLevel
{
    High,
    Medium,
    Low
}

public enum TicketStatus
{
   New,
   Pending_Approval,
   On_Hold,
   To_Discuss,
   Rejected,
   Approved,
   In_Progress,
   Resolved
}