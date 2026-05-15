using BusNet.Api.Controllers;
using BusNet.Core.DTOs.Bus;
using BusNet.Core.DTOs.Common;
using BusNet.Core.Entities;
using BusNet.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BusNet.Tests.Unit;

public class BusesControllerTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly BusesController _sut;

    public BusesControllerTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("BusTests_" + Guid.NewGuid())
            .Options;
        _db = new AppDbContext(options);
        _sut = new BusesController(_db);
    }

    public void Dispose() => _db.Dispose();

    // ── GetAll ────────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAll_EmptyDb_ReturnsEmptyPagedResult()
    {
        var result = await _sut.GetAll();
        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var paged = Assert.IsType<PagedResult<BusDto>>(ok.Value);
        Assert.Empty(paged.Items);
        Assert.Equal(0, paged.TotalCount);
        Assert.Equal(1, paged.Page);
        Assert.Equal(10, paged.PageSize);
    }

    [Fact]
    public async Task GetAll_WithBuses_ReturnsPagedWithAllOnDefaultPage()
    {
        _db.Buses.AddRange(
            new Bus { Name = "Bus A", LicensePlate = "A1", Capacity = 30 },
            new Bus { Name = "Bus B", LicensePlate = "B2", Capacity = 40 });
        await _db.SaveChangesAsync();

        var result = await _sut.GetAll();
        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var paged = Assert.IsType<PagedResult<BusDto>>(ok.Value);
        Assert.Equal(2, paged.TotalCount);
        Assert.Equal(2, paged.Items.Count);
    }

    [Fact]
    public async Task GetAll_StatusActive_ReturnsOnlyActiveAndCorrectTotalCount()
    {
        _db.Buses.AddRange(
            new Bus { Name = "On road", LicensePlate = "A1", Capacity = 30, Status = BusStatus.Active },
            new Bus { Name = "Parked", LicensePlate = "B2", Capacity = 40, Status = BusStatus.Inactive });
        await _db.SaveChangesAsync();

        var result = await _sut.GetAll(status: "Active");
        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var paged = Assert.IsType<PagedResult<BusDto>>(ok.Value);
        Assert.Equal(1, paged.TotalCount);
        Assert.Single(paged.Items);
        Assert.Equal("On road", paged.Items[0].Name);
        Assert.Equal("Active", paged.Items[0].Status);
    }

    [Fact]
    public async Task GetAll_WithAssignedRoute_IncludesRouteName()
    {
        var route = new Route { Name = "Morning Loop" };
        _db.Routes.Add(route);
        await _db.SaveChangesAsync();
        var bus = new Bus
        {
            Name = "Bus R",
            LicensePlate = "R-1",
            Capacity = 30,
            RouteId = route.Id
        };
        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();

        var result = await _sut.GetAll();
        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var paged = Assert.IsType<PagedResult<BusDto>>(ok.Value);
        var dto = Assert.Single(paged.Items);
        Assert.Equal(route.Id, dto.RouteId);
        Assert.Equal("Morning Loop", dto.RouteName);
    }

    [Fact]
    public async Task GetAll_SortByRoute_Asc_PutsAssignedRoutesBeforeBlankAndAlphabeticalByName()
    {
        var zebra = new Route { Name = "Zebra Circuit" };
        var alpha = new Route { Name = "Alpha Loop" };
        _db.Routes.AddRange(zebra, alpha);
        await _db.SaveChangesAsync();
        _db.Buses.AddRange(
            new Bus { Name = "No route", LicensePlate = "NR-1", Capacity = 20, RouteId = null },
            new Bus { Name = "Third", LicensePlate = "Z-9", Capacity = 20, RouteId = zebra.Id },
            new Bus { Name = "First", LicensePlate = "A-1", Capacity = 20, RouteId = alpha.Id });
        await _db.SaveChangesAsync();

        var result = await _sut.GetAll(sortBy: "route", sortDir: "asc", pageSize: 10);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var paged = Assert.IsType<PagedResult<BusDto>>(ok.Value);
        Assert.Collection(
            paged.Items,
            b =>
            {
                Assert.Equal(alpha.Id, b.RouteId);
                Assert.Equal("Alpha Loop", b.RouteName);
                Assert.Equal("First", b.Name);
            },
            b =>
            {
                Assert.Equal(zebra.Id, b.RouteId);
                Assert.Equal("Zebra Circuit", b.RouteName);
                Assert.Equal("Third", b.Name);
            },
            b =>
            {
                Assert.Equal("No route", b.Name);
                Assert.Null(b.RouteName);
            });
    }

    // ── Create ────────────────────────────────────────────────────────────────

    [Fact]
    public async Task Create_ValidDto_ReturnsCreatedAtAction()
    {
        var dto = new CreateBusDto("Bus X", "XX-001", 50, "Active");
        var result = await _sut.Create(dto);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var bus = Assert.IsType<BusDto>(created.Value);
        Assert.Equal("Bus X", bus.Name);
        Assert.Equal("XX-001", bus.LicensePlate);
        Assert.Equal("Active", bus.Status);
    }

    [Fact]
    public async Task Create_InvalidStatus_ReturnsBadRequest()
    {
        var dto = new CreateBusDto("Bus Y", "YY-002", 30, "Unknown");
        var result = await _sut.Create(dto);
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    // ── Update ────────────────────────────────────────────────────────────────

    [Fact]
    public async Task Update_ExistingBus_ReturnsUpdatedDto()
    {
        var bus = new Bus { Name = "Old", LicensePlate = "O-1", Capacity = 20 };
        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();

        var dto = new UpdateBusDto("New", "N-1", 35, "Inactive");
        var result = await _sut.Update(bus.Id, dto);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var updated = Assert.IsType<BusDto>(ok.Value);
        Assert.Equal("New", updated.Name);
        Assert.Equal("Inactive", updated.Status);
    }

    [Fact]
    public async Task Update_NotFound_Returns404()
    {
        var dto = new UpdateBusDto("X", "X-1", 10, "Active");
        var result = await _sut.Update(Guid.NewGuid(), dto);
        Assert.IsType<NotFoundResult>(result.Result);
    }

    // ── Delete ────────────────────────────────────────────────────────────────

    [Fact]
    public async Task Delete_ExistingBus_ReturnsNoContent()
    {
        var bus = new Bus { Name = "Del", LicensePlate = "D-1", Capacity = 20 };
        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();

        var result = await _sut.Delete(bus.Id);
        Assert.IsType<NoContentResult>(result);
        Assert.Equal(0, await _db.Buses.CountAsync());
    }

    [Fact]
    public async Task Delete_NotFound_Returns404()
    {
        var result = await _sut.Delete(Guid.NewGuid());
        Assert.IsType<NotFoundResult>(result);
    }

    // ── AssignRoute ───────────────────────────────────────────────────────────

    [Fact]
    public async Task AssignRoute_ValidBusAndRoute_ReturnsOkWithRouteId()
    {
        var route = new Route { Name = "Route 1" };
        var bus = new Bus { Name = "Bus 1", LicensePlate = "B-1", Capacity = 30 };
        _db.Routes.Add(route);
        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();

        var result = await _sut.AssignRoute(bus.Id, new AssignRouteDto(route.Id));

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<BusDto>(ok.Value);
        Assert.Equal(route.Id, dto.RouteId);
        Assert.Equal("Route 1", dto.RouteName);
    }

    [Fact]
    public async Task AssignRoute_BusNotFound_Returns404()
    {
        var route = new Route { Name = "Route 1" };
        _db.Routes.Add(route);
        await _db.SaveChangesAsync();

        var result = await _sut.AssignRoute(Guid.NewGuid(), new AssignRouteDto(route.Id));
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task AssignRoute_RouteNotFound_ReturnsBadRequest()
    {
        var bus = new Bus { Name = "Bus 1", LicensePlate = "B-1", Capacity = 30 };
        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();

        var result = await _sut.AssignRoute(bus.Id, new AssignRouteDto(Guid.NewGuid()));
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task AssignRoute_PersistsToDatabase()
    {
        var route = new Route { Name = "Route 1" };
        var bus = new Bus { Name = "Bus 1", LicensePlate = "B-1", Capacity = 30 };
        _db.Routes.Add(route);
        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();

        await _sut.AssignRoute(bus.Id, new AssignRouteDto(route.Id));

        var persisted = await _db.Buses.FindAsync(bus.Id);
        Assert.Equal(route.Id, persisted!.RouteId);
    }

    // ── UnassignRoute ─────────────────────────────────────────────────────────

    [Fact]
    public async Task UnassignRoute_AssignedBus_ClearsRouteId()
    {
        var route = new Route { Name = "Route 1" };
        _db.Routes.Add(route);
        await _db.SaveChangesAsync();
        var bus = new Bus
        {
            Name = "Bus 1",
            LicensePlate = "B-1",
            Capacity = 30,
            RouteId = route.Id
        };
        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();

        var result = await _sut.UnassignRoute(bus.Id);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<BusDto>(ok.Value);
        Assert.Null(dto.RouteId);
        Assert.Null(dto.RouteName);
    }

    [Fact]
    public async Task UnassignRoute_BusNotFound_Returns404()
    {
        var result = await _sut.UnassignRoute(Guid.NewGuid());
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task UnassignRoute_PersistsNullToDatabase()
    {
        var route = new Route { Name = "Route 1" };
        var bus = new Bus { Name = "Bus 1", LicensePlate = "B-1", Capacity = 30 };
        _db.Routes.Add(route);
        bus.RouteId = route.Id;
        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();

        await _sut.UnassignRoute(bus.Id);

        var persisted = await _db.Buses.FindAsync(bus.Id);
        Assert.Null(persisted!.RouteId);
    }
}
