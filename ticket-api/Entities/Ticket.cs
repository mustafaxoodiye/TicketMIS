using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ticket_api.Entities;

public class Ticket : BaseEntityWithUser
{
    public string Title { get; set; }
    public string Description { get; set; }
    public TicketPriorityLevel Priority { get; set; }
    public long ProjectId { get; set; }
    public Project Project { get; set; }
    public TicketStatus Status { get; set; }
    public long? AssignedToId { get; set; }
    public WorkGroup? AssignedTo { get; set; }
    [Column(TypeName = "Date")]
    public DateTime? StartDate { get; set; }
    [Column(TypeName = "Date")]
    public DateTime? EndDate { get; set; }
    [Column(TypeName = "Date")]
    public DateTime? ActualFinishingDate { get; set; }
    public long? ResponsibleId { get; set; }
    public AppUser? Responsible { get; set; }
    public List<long>? Flags { get; set; } = new List<long>();
}
