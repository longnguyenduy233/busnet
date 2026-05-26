using System.Text;
using BusNet.Api.Hubs;
using BusNet.Api.Infrastructure;
using BusNet.Api.Middleware;
using BusNet.Core.Entities;
using BusNet.Core.Interfaces;
using BusNet.Core.Security;
using BusNet.Infrastructure.Data;
using BusNet.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentityCore<AppUser>(options =>
{
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
})
.AddEntityFrameworkStores<AppDbContext>()
.AddSignInManager<SignInManager<AppUser>>();

var jwtKey = builder.Configuration["Jwt:Key"]!;
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            // No grace period after exp — matches TokenService refresh validation and short access TTL in appsettings.
            ClockSkew = TimeSpan.Zero
        };
        // SignalR sends the JWT via query string on WebSocket upgrade requests
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = ctx =>
            {
                var token = ctx.Request.Query["access_token"];
                if (!string.IsNullOrEmpty(token) &&
                    ctx.HttpContext.Request.Path.StartsWithSegments("/hubs"))
                    ctx.Token = token;
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    // Access JWTs carry token_kind=access; refresh JWTs authenticate but must not satisfy this policy.
    options.DefaultPolicy = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .RequireClaim(JwtClaims.TokenKind, JwtClaims.Access)
        .Build();
});
builder.Services.AddScoped<ITokenService, TokenService>();

// AllowCredentials forbids wildcard origins — must echo the browser Origin exactly.
// In Development, allow any loopback origin (localhost / 127.0.0.1 / [::1]) on any port
// so ng serve on a random port or --host still works.
var corsOrigins = builder.Configuration.GetSection("Cors:Origins").Get<string[]>();
if (corsOrigins is null || corsOrigins.Length == 0)
{
    corsOrigins =
    [
        "http://localhost:4200",
        "http://127.0.0.1:4200",
        "http://[::1]:4200",
        "https://localhost:4200",
        "https://[::1]:4200"
    ];
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("Angular", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.SetIsOriginAllowed(Program.IsLoopbackBrowserOrigin)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            policy.WithOrigins(corsOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
    });
});

builder.Services.AddSignalR();

var app = builder.Build();
app.UseMiddleware<DatabaseExceptionMiddleware>();

app.UseCors("Angular");
app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();
app.MapControllers();
app.MapHub<TrackingHub>("/hubs/tracking");
app.MapFallbackToController("Index", "Fallback");

app.MapGet("/health/db", async (AppDbContext db, CancellationToken ct) =>
{
    try
    {
        var connected = await db.Database.CanConnectAsync(ct);
        return connected
            ? Results.Ok(new { status = "Healthy", database = "connected" })
            : Results.Json(
                new { status = "Unhealthy", error = "Cannot connect to the database." },
                statusCode: StatusCodes.Status503ServiceUnavailable);
    }
    catch (Exception ex) when (DatabaseErrors.IsUnavailable(ex))
    {
        return Results.Json(
            new { status = "Unhealthy", error = DatabaseErrors.PublicMessage(app.Environment, ex) },
            statusCode: StatusCodes.Status503ServiceUnavailable);
    }
});

try
{
    await SeedAsync(app);
}
catch (Exception ex) when (DatabaseErrors.IsUnavailable(ex))
{
    var startupLogger = app.Services.GetRequiredService<ILoggerFactory>().CreateLogger("Startup");
    startupLogger.LogCritical(
        ex,
        "Cannot access the database. Verify ConnectionStrings:DefaultConnection and that SQL Server is running.");
    Console.Error.WriteLine(
        "BusNet API failed to start: database is unavailable. Check appsettings.json and SQL Server.");
    Environment.Exit(1);
}

app.Run();

static async Task SeedAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

    if (db.Database.IsRelational())
        await db.Database.MigrateAsync();
    else
        await db.Database.EnsureCreatedAsync();

    if (!userManager.Users.Any())
    {
        var admin = new AppUser
        {
            UserName = "admin",
            Email = "admin@busnet.local",
            DisplayName = "Administrator"
        };
        await userManager.CreateAsync(admin, "admin123");
    }
}
public partial class Program
{
    /// <summary>True for http(s)://localhost, 127.0.0.1, or [::1] on any port (browser Origin header).</summary>
    internal static bool IsLoopbackBrowserOrigin(string? origin)
    {
        if (string.IsNullOrEmpty(origin)) return false;
        if (!Uri.TryCreate(origin, UriKind.Absolute, out var uri)) return false;
        return uri.IsLoopback;
    }
}
