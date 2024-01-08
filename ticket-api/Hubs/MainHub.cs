using Microsoft.AspNetCore.SignalR;

namespace ticket_api.Hubs;

public class MainHub:Hub
{
    public override Task OnConnectedAsync()
    {
        Console.WriteLine($"A user is connected {Context.UserIdentifier} - {Context.User?.GetUserId()} - {Context.ConnectionId}");
        return base.OnConnectedAsync();
    }
}
