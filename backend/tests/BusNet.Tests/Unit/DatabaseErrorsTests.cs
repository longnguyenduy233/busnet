using System.Data.Common;
using BusNet.Api.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;

namespace BusNet.Tests.Unit;

public class DatabaseErrorsTests
{
    [Fact]
    public void IsUnavailable_TrueForDbException()
    {
        var ex = new FakeDbException("connection failed");
        Assert.True(DatabaseErrors.IsUnavailable(ex));
    }

    [Fact]
    public void IsUnavailable_TrueForDbUpdateExceptionWrappingDbException()
    {
        var inner = new FakeDbException("timeout");
        var ex = new DbUpdateException("save failed", inner);
        Assert.True(DatabaseErrors.IsUnavailable(ex));
    }

    [Fact]
    public void IsUnavailable_TrueForTimeoutException()
    {
        Assert.True(DatabaseErrors.IsUnavailable(new TimeoutException("timed out")));
    }

    [Fact]
    public void IsUnavailable_FalseForGenericException()
    {
        Assert.False(DatabaseErrors.IsUnavailable(new InvalidOperationException("bad input")));
    }

    [Fact]
    public void PublicMessage_ProductionUsesGenericText()
    {
        var env = new FakeHostEnvironment { EnvironmentName = Environments.Production };
        var message = DatabaseErrors.PublicMessage(env, new FakeDbException("secret server name"));
        Assert.DoesNotContain("secret server name", message);
        Assert.Contains("unavailable", message, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public void PublicMessage_DevelopmentIncludesBaseMessage()
    {
        var env = new FakeHostEnvironment { EnvironmentName = Environments.Development };
        var message = DatabaseErrors.PublicMessage(env, new FakeDbException("cannot open database"));
        Assert.Contains("cannot open database", message);
    }

    private sealed class FakeDbException(string message) : DbException(message);

    private sealed class FakeHostEnvironment : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = Environments.Production;
        public string ApplicationName { get; set; } = "BusNet.Tests";
        public string ContentRootPath { get; set; } = AppContext.BaseDirectory;
        public IFileProvider ContentRootFileProvider { get; set; } = null!;
    }
}
