using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using BusNet.Core.DTOs;
using BusNet.Core.DTOs.Tracking;
using BusNet.Core.Entities;
using BusNet.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace BusNet.Tests.Integration;

public class TrackingIntegrationTests : IClassFixture<BusNetWebAppFactory>
{
    private readonly HttpClient _client;
    private readonly BusNetWebAppFactory _factory;

    public TrackingIntegrationTests(BusNetWebAppFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    private async Task AuthorizeAsync()
    {
        var login = await _client.PostAsJsonAsync("/api/auth/login",
            new LoginRequest("admin", "admin123"));
        var body = await login.Content.ReadFromJsonAsync<LoginResponse>();
        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", body!.Token);
    }

    private Bus SeedBus(string name = "Test Bus", string plate = "TB-001")
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var bus = new Bus { Name = name, LicensePlate = plate, Capacity = 30 };
        db.Buses.Add(bus);
        db.SaveChanges();
        return bus;
    }

    // ── Auth guard ─────────────────────────────────────────────────────────────

    [Fact]
    public async Task UpdateLocation_WithoutToken_Returns401()
    {
        _client.DefaultRequestHeaders.Authorization = null;
        var dto = new UpdateLocationDto(Guid.NewGuid(), 10.77, 106.70);

        var response = await _client.PostAsJsonAsync("/api/tracking/update-location", dto);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ── Invalid bus ────────────────────────────────────────────────────────────

    [Fact]
    public async Task UpdateLocation_UnknownBusId_Returns404()
    {
        await AuthorizeAsync();
        var dto = new UpdateLocationDto(Guid.NewGuid(), 10.77, 106.70);

        var response = await _client.PostAsJsonAsync("/api/tracking/update-location", dto);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateLocation_UnknownBusId_ResponseContainsMessage()
    {
        await AuthorizeAsync();
        var dto = new UpdateLocationDto(Guid.NewGuid(), 10.77, 106.70);

        var response = await _client.PostAsJsonAsync("/api/tracking/update-location", dto);
        var body = await response.Content.ReadAsStringAsync();

        Assert.Contains("not found", body, StringComparison.OrdinalIgnoreCase);
    }

    // ── Valid update ───────────────────────────────────────────────────────────

    [Fact]
    public async Task UpdateLocation_ValidBusId_Returns200()
    {
        await AuthorizeAsync();
        var bus = SeedBus("Integration Bus", "INT-T01");
        var dto = new UpdateLocationDto(bus.Id, 10.7769, 106.7009);

        var response = await _client.PostAsJsonAsync("/api/tracking/update-location", dto);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task UpdateLocation_ValidBusId_ReturnsBusLocationDto()
    {
        await AuthorizeAsync();
        var bus = SeedBus("Integration Bus 2", "INT-T02");
        var dto = new UpdateLocationDto(bus.Id, 10.7850, 106.6967);

        var response = await _client.PostAsJsonAsync("/api/tracking/update-location", dto);
        var location = await response.Content.ReadFromJsonAsync<BusLocationDto>();

        Assert.NotNull(location);
        Assert.Equal(bus.Id, location!.BusId);
        Assert.Equal(10.7850, location.Latitude);
        Assert.Equal(106.6967, location.Longitude);
        // Timestamp should be very recent
        Assert.True((DateTime.UtcNow - location.Timestamp).TotalSeconds < 10);
    }
}
