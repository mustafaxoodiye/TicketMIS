
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq.Expressions;

namespace ticket_api.Entities;

public class BaseEntity
{
    public long Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public bool IsDeleted { get; set; } = false;
    public long? CreatedById { get; set; }
}

public class BaseEntityWithUser: BaseEntity
{
    public virtual AppUser? CreatedBy { get; set; }
}