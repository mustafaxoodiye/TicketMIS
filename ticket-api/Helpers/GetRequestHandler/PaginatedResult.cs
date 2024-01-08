namespace ticket_api.Helpers.GetRequestHandler;

public class PaginatedResult<T>
{
    public int Page { get; set; }

    public int Size { get; set; }

    public List<T> Items { get; set; } = new();

    public int TotalItems { get; set; }

    public int TotalPages { get; set; }
}