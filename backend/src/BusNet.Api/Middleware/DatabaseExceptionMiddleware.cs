using BusNet.Api.Infrastructure;

namespace BusNet.Api.Middleware;

/// <summary>
/// Maps database connectivity failures to HTTP 503 so clients get a clear message instead of HTTP 500.
/// </summary>
public sealed class DatabaseExceptionMiddleware(
    RequestDelegate next,
    ILogger<DatabaseExceptionMiddleware> logger,
    IHostEnvironment environment)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex) when (DatabaseErrors.IsUnavailable(ex))
        {
            if (context.Response.HasStarted)
                throw;

            logger.LogError(ex, "Database unavailable while handling {Method} {Path}",
                context.Request.Method, context.Request.Path);

            context.Response.StatusCode = StatusCodes.Status503ServiceUnavailable;
            context.Response.ContentType = "application/json";
            await context.Response.WriteAsJsonAsync(new
            {
                error = DatabaseErrors.PublicMessage(environment, ex)
            });
        }
    }
}
