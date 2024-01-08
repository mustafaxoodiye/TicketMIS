using Microsoft.AspNetCore.Diagnostics;
using System.Net;

namespace ticket_api.Helpers;

public static class ExceptionMiddlewareExtensions
{
    public static void ConfigureExceptionHandler(this IApplicationBuilder app, bool isDevelopment)
    {
        app.UseExceptionHandler(appError =>
        {
            appError.Run(async context =>
            {
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                context.Response.ContentType = "application/json";
                var contextFeature = context.Features.Get<IExceptionHandlerFeature>();
                if (contextFeature != null)
                {
                    if (isDevelopment)
                    {
                        await context.Response.WriteAsync(new ErrorDetails()
                        {
                            StatusCode = context.Response.StatusCode,
                            Message = "Internal Server Error.",
                            Description = contextFeature.Error.ToString()
                        }.ToString());
                        return;
                    }
                    //Logger.LogError(contextFeature.Error); // To be implemented
                    await context.Response.WriteAsync(new ErrorDetails()
                    {
                        StatusCode = context.Response.StatusCode,
                        Message = "Internal Server Error.",
                        Description = contextFeature.Error.ToString()
                    }.ToString());
                }
            });
        });
    }
}
