namespace ticket_api.Entities;

public class TicketRevision: BaseEntityWithUser
{
    public long TicketId { get; set; }
    public Ticket Ticket { get; set; }
    //public long UserId { get; set; }
    //public AppUser User { get; set; }
    public string Remarks { get; set; }
    public TicketStatus Status { get; set; }
}
