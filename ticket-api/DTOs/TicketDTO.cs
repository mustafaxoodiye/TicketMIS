namespace ticket_api.DTOs;

public class TicketDTO
{
}

public class PostTicketDTO
{
    public string Title { get; set; }
    public string Description { get; set; }
    public TicketPriorityLevel Priority { get; set; }
}

public class EditTicketDTO
{
    public long Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
}


public class ChangeTicketStatusDTO
{
    public long Id { get; set; }
    public string Remarks { get; set; }
    public long? AssignedTo { get; set; }
    public TicketStatus Status { get; set; }
    public TicketPriorityLevel? Priority { get; set; }
    public DateTime? EndDate { get; set; }
    public List<long>? Flags { get; set; } 
}