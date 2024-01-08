using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.Extensions.Options;
using System.Linq.Expressions;
using System.Text.Json;
using ticket_api.SQLViwes;

namespace ticket_api.Data;

public class AppDbContext : DbContext
{
    private readonly UserResolver _userResolver;

    public AppDbContext(DbContextOptions<AppDbContext> options, UserResolver userResolver)
       : base(options)
    {
        _userResolver = userResolver;
    }

    public DbSet<AppUser> AppUsers { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectAssignee> ProjectAssignees { get; set; }
    public DbSet<ApprovalWorkflow> ApprovalWorkflows { get; set; }
    public DbSet<Ticket> Tickets { get; set; }
    public DbSet<TicketRevision> TicketRevisions { get; set; }
    public DbSet<WorkGroup> WorkGroups { get; set; }
    public DbSet<WorkGroupUser> WorkGroupUsers { get; set; }
    public DbSet<Flag> Flags { get; set; }


    // Views Goes here...
    public DbSet<UserProjectsVW> UserProjectsVW { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        GlobalQueryFilters(modelBuilder);
        var options = new JsonSerializerOptions(JsonSerializerDefaults.Web);

        modelBuilder.Entity<Ticket>().Property(t => t.Description).HasMaxLength(10_000);

        // Handle array columns here
        modelBuilder.Entity<Role>().Property(r => r.Permissions)
          .HasConversion(v => string.Join(',', v), v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());
        modelBuilder.Entity<AppUser>().Property(r => r.AccessableTickets)
          .HasConversion(v => string.Join(',', v), v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList());

        modelBuilder.Entity<AppUser>().Property(a => a.FlagRestrictions)
        .HasConversion(value => JsonSerializer.Serialize(value, options), value => JsonSerializer.Deserialize<List<long>?>(value, options));
        modelBuilder.Entity<Ticket>().Property(a => a.Flags)
        .HasConversion(value => JsonSerializer.Serialize(value, options), value => JsonSerializer.Deserialize<List<long>?>(value, options));

        // Handle Enums here
        modelBuilder.Entity<TicketRevision>().Property(a => a.Status).HasConversion(v => v.ToString(), v => Enum.Parse<TicketStatus>(v, true));
        modelBuilder.Entity<Ticket>().Property(a => a.Status).HasConversion(v => v.ToString(), v => Enum.Parse<TicketStatus>(v, true));
        modelBuilder.Entity<Ticket>().Property(a => a.Priority).HasConversion(v => v.ToString(), v => Enum.Parse<TicketPriorityLevel>(v, true));


        // Mapping views here
        modelBuilder.Entity<UserProjectsVW>(c =>
        {
            c.HasNoKey();
            c.ToView("UserProjectsVW");
        });
    }

    protected override void ConfigureConventions(ModelConfigurationBuilder configurationBuilder)
    {
        base.ConfigureConventions(configurationBuilder);

        configurationBuilder.Properties<string>()
            .HaveMaxLength(1000);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        AddCredentials(); // adds createdBy and createdAt at each insert operation.
        HandleSoftDeletes();

        return base.SaveChangesAsync(cancellationToken);
    }

    private IEnumerable<EntityEntry<BaseEntity>> AddCredentials()
    {
        var entries = ChangeTracker.Entries<BaseEntity>().Where(e => e.State == EntityState.Added);

        foreach (var entry in entries)
        {
            entry.Entity.CreatedById = _userResolver.GetUserId();
            entry.Entity.CreatedAt = DateTime.UtcNow;
            entry.Entity.IsDeleted = false;
        }

        return entries;
    }

    private IEnumerable<EntityEntry<BaseEntity>> HandleSoftDeletes()
    {
        var entries = ChangeTracker.Entries<BaseEntity>().Where(e => e.State == EntityState.Deleted);

        foreach (var entry in entries)
        {
            entry.Entity.IsDeleted = true;
            entry.State = EntityState.Modified;
        }

        return entries;
    }

    private void GlobalQueryFilters(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Ticket>().HasQueryFilter(t => t.ProjectId == _userResolver.GetProjectId());
        modelBuilder.Entity<WorkGroup>().HasQueryFilter(t => t.ProjectId == _userResolver.GetProjectId());
        modelBuilder.Entity<Flag>().HasQueryFilter(t => t.ProjectId == _userResolver.GetProjectId());

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            var queryFilter = entityType.GetQueryFilter();
            Expression? filter = queryFilter?.Body;

            var param = queryFilter?.Parameters.First() ?? Expression.Parameter(entityType.ClrType, "e");
            if (entityType.ClrType.IsAssignableTo(typeof(BaseEntity)))
            {
                var propertyAccess = Expression.Property(param, nameof(BaseEntity.IsDeleted));

                if (filter is null)
                {
                    filter = Expression.Not(propertyAccess);
                }
                else
                {
                    filter = Expression.And(filter, Expression.Not(propertyAccess));
                }
            }

            if (filter is not null)
            {
                var lambda = Expression.Lambda(filter, param);
                entityType.SetQueryFilter(lambda);
            }
        }
    }
}
