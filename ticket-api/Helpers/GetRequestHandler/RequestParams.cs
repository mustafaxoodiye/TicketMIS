namespace ticket_api.Helpers.GetRequestHandler;

public class RequestParams
{
    public int Page { get; set; }

    public int Size { get; set; } = 10;

    public List<Filter> Filters { get; set; } = new();

    public List<Sort> Sorts { get; set; } = new();
}

public class Filter
{
    public string Field { get; set; }

    public Operation Operation { get; set; }

    public object Value { get; set; }
}

public class Sort
{
    public string Field { get; set; }
    public bool IsAscending { get; set; } = true;
}

public enum Operation
{
    Eq,
    Like,
    Gt,
    Lt,
    Gte,
    Lte,
    In,
}

