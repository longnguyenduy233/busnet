using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using BusNet.Core.DTOs;
using BusNet.Core.DTOs.Bus;
using BusNet.Core.DTOs.Common;
using BusNet.Core.Entities;
using BusNet.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace BusNet.Tests.Integration;

public class BusIntegrationTests : IClassFixture<BusNetWebAppFactory>
{
    private readonly HttpClient _client;
    private readonly BusNetWebAppFactory _factory;

    public BusIntegrationTests(BusNetWebAppFactory factory)
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

    // ── Auth guard ────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetBuses_WithoutToken_Returns401()
    {
        _client.DefaultRequestHeaders.Authorization = null;
        var response = await _client.GetAsync("/api/buses");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    // ── CRUD ─────────────────────────────────────────────────────────────────

    [Fact]
    public async Task CreateBus_ValidDto_Returns201WithDto()
    {
        await AuthorizeAsync();
        var dto = new CreateBusDto("Integration Bus", "INT-001", 45, "Active");

        var response = await _client.PostAsJsonAsync("/api/buses", dto);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var created = await response.Content.ReadFromJsonAsync<BusDto>();
        Assert.NotNull(created);
        Assert.Equal("Integration Bus", created.Name);
        Assert.Equal("INT-001", created.LicensePlate);
        Assert.Equal("Active", created.Status);
    }

    [Fact]
    public async Task GetAllBuses_AfterCreate_ContainsCreatedBus()
    {
        await AuthorizeAsync();
        await _client.PostAsJsonAsync("/api/buses",
            new CreateBusDto("Listed Bus", "LST-001", 30, "Active"));

        var response = await _client.GetAsync("/api/buses");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var paged = await response.Content.ReadFromJsonAsync<PagedResult<BusDto>>();
        Assert.NotNull(paged?.Items);
        Assert.Contains(paged!.Items, b => b.LicensePlate == "LST-001");
    }

    /// <summary>
    /// Tracking (and similar UIs) rely on <c>?status=Active</c> so inactive fleet rows stay out of paged totals.
    /// </summary>
    [Fact]
    public async Task GetBuses_StatusActive_ReturnsOnlyActiveBusesAndInactiveNotInItems()
    {
        await AuthorizeAsync();
        await _client.PostAsJsonAsync("/api/buses",
            new CreateBusDto("On Road", "FILTER-ACT-01", 30, "Active"));
        await _client.PostAsJsonAsync("/api/buses",
            new CreateBusDto("Parked", "FILTER-INA-01", 30, "Inactive"));

        var response = await _client.GetAsync("/api/buses?status=Active&pageSize=50");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var paged = await response.Content.ReadFromJsonAsync<PagedResult<BusDto>>();
        Assert.NotNull(paged?.Items);
        Assert.Contains(paged!.Items, b => b.LicensePlate == "FILTER-ACT-01");
        Assert.DoesNotContain(paged.Items, b => b.LicensePlate == "FILTER-INA-01");
        Assert.All(paged.Items, b => Assert.Equal("Active", b.Status));

        var totalActive = paged.TotalCount;
        var page1 = await _client.GetAsync("/api/buses?status=Active&pageSize=1&page=1");
        var page1Body = await page1.Content.ReadFromJsonAsync<PagedResult<BusDto>>();
        Assert.Equal(totalActive, page1Body!.TotalCount);
    }

    [Fact]
    public async Task GetBuses_StatusInactive_ReturnsOnlyInactiveBuses()
    {
        await AuthorizeAsync();
        await _client.PostAsJsonAsync("/api/buses",
            new CreateBusDto("Warehouse A", "FILTER-ACT-02", 25, "Active"));
        await _client.PostAsJsonAsync("/api/buses",
            new CreateBusDto("Warehouse B", "FILTER-INA-02", 25, "Inactive"));

        var response = await _client.GetAsync("/api/buses?status=Inactive&pageSize=50");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var paged = await response.Content.ReadFromJsonAsync<PagedResult<BusDto>>();
        Assert.NotNull(paged?.Items);
        Assert.Contains(paged!.Items, b => b.LicensePlate == "FILTER-INA-02");
        Assert.DoesNotContain(paged.Items, b => b.LicensePlate == "FILTER-ACT-02");
        Assert.All(paged.Items, b => Assert.Equal("Inactive", b.Status));
    }

    [Fact]
    public async Task UpdateBus_ExistingBus_ReturnsUpdated()
    {
        await AuthorizeAsync();
        var create = await _client.PostAsJsonAsync("/api/buses",
            new CreateBusDto("Before", "BEF-001", 20, "Active"));
        var original = await create.Content.ReadFromJsonAsync<BusDto>();

        var response = await _client.PutAsJsonAsync(
            $"/api/buses/{original!.Id}",
            new UpdateBusDto("After", "AFT-001", 25, "Inactive"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var updated = await response.Content.ReadFromJsonAsync<BusDto>();
        Assert.Equal("After", updated!.Name);
        Assert.Equal("Inactive", updated.Status);
    }

    [Fact]
    public async Task DeleteBus_ExistingBus_Returns204AndRemoved()
    {
        await AuthorizeAsync();
        var create = await _client.PostAsJsonAsync("/api/buses",
            new CreateBusDto("ToDelete", "DEL-001", 20, "Active"));
        var bus = await create.Content.ReadFromJsonAsync<BusDto>();

        var deleteResp = await _client.DeleteAsync($"/api/buses/{bus!.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResp.StatusCode);

        var getResp = await _client.GetAsync($"/api/buses/{bus.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getResp.StatusCode);
    }

    // ── Assign / Unassign Route ───────────────────────────────────────────────

    [Fact]
    public async Task AssignRoute_ValidBusAndRoute_ReturnsOkWithRouteId()
    {
        await AuthorizeAsync();

        // seed a route directly in the database
        var routeId = await SeedRouteAsync("Test Route");

        var create = await _client.PostAsJsonAsync("/api/buses",
            new CreateBusDto("Assign Bus", "ASN-001", 30, "Active"));
        var bus = await create.Content.ReadFromJsonAsync<BusDto>();

        var response = await _client.PutAsJsonAsync(
            $"/api/buses/{bus!.Id}/assign-route",
            new { routeId });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var updated = await response.Content.ReadFromJsonAsync<BusDto>();
        Assert.Equal(routeId, updated!.RouteId);
        Assert.Equal("Test Route", updated.RouteName);
    }

    [Fact]
    public async Task AssignRoute_RouteNotFound_Returns400()
    {
        await AuthorizeAsync();
        var create = await _client.PostAsJsonAsync("/api/buses",
            new CreateBusDto("No Route Bus", "NR-001", 30, "Active"));
        var bus = await create.Content.ReadFromJsonAsync<BusDto>();

        var response = await _client.PutAsJsonAsync(
            $"/api/buses/{bus!.Id}/assign-route",
            new { routeId = Guid.NewGuid() });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UnassignRoute_AssignedBus_ClearsRouteId()
    {
        await AuthorizeAsync();
        var routeId = await SeedRouteAsync("Unassign Route");

        var create = await _client.PostAsJsonAsync("/api/buses",
            new CreateBusDto("Unassign Bus", "UNA-001", 30, "Active"));
        var bus = await create.Content.ReadFromJsonAsync<BusDto>();

        await _client.PutAsJsonAsync(
            $"/api/buses/{bus!.Id}/assign-route",
            new { routeId });

        var response = await _client.DeleteAsync($"/api/buses/{bus.Id}/assign-route");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var updated = await response.Content.ReadFromJsonAsync<BusDto>();
        Assert.Null(updated!.RouteId);
        Assert.Null(updated.RouteName);
    }

    private async Task<Guid> SeedRouteAsync(string name)
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var route = new Route { Name = name };
        db.Routes.Add(route);
        await db.SaveChangesAsync();
        return route.Id;
    }
}
