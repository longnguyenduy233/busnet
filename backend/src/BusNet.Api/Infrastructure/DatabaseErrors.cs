using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace BusNet.Api.Infrastructure;

/// <summary>
/// Detects EF / ADO.NET failures caused by SQL Server being down, unreachable, or refusing connections.
/// </summary>
public static class DatabaseErrors
{
    public static bool IsUnavailable(Exception exception)
    {
        for (var ex = exception; ex is not null; ex = ex.InnerException)
        {
            if (ex is DbException or DbUpdateException or TimeoutException)
                return true;
        }

        return false;
    }

    public static string PublicMessage(IHostEnvironment env, Exception exception)
    {
        if (env.IsDevelopment())
            return exception.GetBaseException().Message;

        return "Database is unavailable. Please check that SQL Server is running and try again later.";
    }
}
