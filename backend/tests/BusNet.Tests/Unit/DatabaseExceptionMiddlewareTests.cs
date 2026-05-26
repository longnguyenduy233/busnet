using System.Data.Common;
using System.Text.Json;
using BusNet.Api.Middleware;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;

namespace BusNet.Tests.Unit;

public class DatabaseExceptionMiddlewareTests
{
    [Fact]
    public async Task InvokeAsync_DbException_Returns503WithJsonBody()
    {
        var context = new DefaultHttpContext();
        context.Response.Body = new MemoryStream();

        var middleware = new DatabaseExceptionMiddleware(
            _ => throw new FakeDbException("network error"),
            NullLogger<DatabaseExceptionMiddleware>.Instance,
            new FakeHostEnvironment(Environments.Production));

        await middleware.InvokeAsync(context);

        Assert.Equal(StatusCodes.Status503ServiceUnavailable, context.Response.StatusCode);
        Assert.StartsWith("application/json", context.Response.ContentType);

        context.Response.Body.Position = 0;
        using var doc = await JsonDocument.ParseAsync(context.Response.Body);
        var error = doc.RootElement.GetProperty("error").GetString();
        Assert.NotNull(error);
        Assert.Contains("unavailable", error, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task InvokeAsync_NonDatabaseException_IsNotCaught()
    {
        var middleware = new DatabaseExceptionMiddleware(
            _ => throw new InvalidOperationException("validation"),
            NullLogger<DatabaseExceptionMiddleware>.Instance,
            new FakeHostEnvironment(Environments.Production));

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            middleware.InvokeAsync(new DefaultHttpContext()));
    }

    private sealed class FakeDbException(string message) : DbException(message);

    private sealed class FakeHostEnvironment(string environmentName) : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = environmentName;
        public string ApplicationName { get; set; } = "BusNet.Tests";
        public string ContentRootPath { get; set; } = AppContext.BaseDirectory;
        public IFileProvider ContentRootFileProvider { get; set; } = null!;
    }
}
