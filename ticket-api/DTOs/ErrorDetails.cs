using Newtonsoft.Json;

namespace ticket_api.DTOs;

public class ErrorDetails
{
    public string Message { get; set; }
    public string Description { get; set; }
    public int StatusCode { get; internal set; }

    public override string ToString()
    {
        return JsonConvert.SerializeObject(this);
    }
}
