using BusNet.Api.Controllers;
using BusNet.Core.DTOs.Common;
using BusNet.Core.DTOs.Route;
using BusNet.Core.Entities;
using BusNet.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RouteEntity = BusNet.Core.Entities.Route;

namespace BusNet.Tests.Unit;

public class RoutesControllerTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly RoutesController _sut;

    public RoutesControllerTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("RouteTests_" + Guid.NewGuid())
            .Options;
        _db = new AppDbContext(options);
        _sut = new RoutesController(_db);
    }

    public void Dispose() => _db.Dispose();

    // ── GetAll (paged) ─────────────────────────────────────────────────────────

    [Fact]
    public async Task GetAll_EmptyDb_ReturnsEmptyPagedResult()
    {
        var result = await _sut.GetAll();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var paged = Assert.IsType<PagedResult<RouteDto>>(ok.Value);
        Assert.Empty(paged.Items);
        Assert.Equal(0, paged.TotalCount);
        Assert.Equal(1, paged.Page);
        Assert.Equal(10, paged.PageSize);
    }

    [Fact]
    public async Task GetAll_WithRoutes_ReturnsPagedItemsAndTotalCount()
    {
        _db.Routes.AddRange(
            new RouteEntity { Name = "Alpha" },
            new RouteEntity { Name = "Beta" });
        await _db.SaveChangesAsync();

        var result = await _sut.GetAll();

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var paged = Assert.IsType<PagedResult<RouteDto>>(ok.Value);
        Assert.Equal(2, paged.TotalCount);
        Assert.Equal(2, paged.Items.Count);
    }

    [Fact]
    public async Task GetAll_Page2_ReturnsSecondSlice()
    {
        for (var i = 1; i <= 5; i++)
            _db.Routes.Add(new RouteEntity { Name = $"R{i:D2}" }); // R01..R05 sorts lexicographically

        await _db.SaveChangesAsync();

        var result = await _sut.GetAll(page: 2, pageSize: 2);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var paged = Assert.IsType<PagedResult<RouteDto>>(ok.Value);
        Assert.Equal(5, paged.TotalCount);
        Assert.Equal(2, paged.Page);
        Assert.Equal(2, paged.PageSize);
        Assert.Equal(2, paged.Items.Count);
        // Sorted asc by Name: page 2 is third and fourth alphabetically → R03, R04
        Assert.Equal("R03", paged.Items[0].Name);
        Assert.Equal("R04", paged.Items[1].Name);
    }

    [Fact]
    public async Task GetAll_PageBelowOne_ClampsToPageOne()
    {
        _db.Routes.Add(new RouteEntity { Name = "Only" });
        await _db.SaveChangesAsync();

        var result = await _sut.GetAll(page: 0, pageSize: 10);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var paged = Assert.IsType<PagedResult<RouteDto>>(ok.Value);
        Assert.Equal(1, paged.Page);
        Assert.Single(paged.Items);
    }

    [Fact]
    public async Task GetAll_SortDesc_ReturnsNamesDescending()
    {
        _db.Routes.AddRange(
            new RouteEntity { Name = "A" },
            new RouteEntity { Name = "Z" },
            new RouteEntity { Name = "M" });
        await _db.SaveChangesAsync();

        var result = await _sut.GetAll(sortDir: "desc");

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var paged = Assert.IsType<PagedResult<RouteDto>>(ok.Value);
        Assert.Equal(new[] { "Z", "M", "A" }, paged.Items.Select(r => r.Name).ToArray());
    }

    [Fact]
    public async Task GetAll_PageSizeOver100_ClampedTo100StillReturnsAllRecords()
    {
        for (var i = 0; i < 3; i++)
            _db.Routes.Add(new RouteEntity { Name = $"Loop{i}" });

        await _db.SaveChangesAsync();

        var result = await _sut.GetAll(pageSize: 500); // clamps to max 100

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var paged = Assert.IsType<PagedResult<RouteDto>>(ok.Value);
        Assert.Equal(100, paged.PageSize);
        Assert.Equal(3, paged.Items.Count);
        Assert.Equal(3, paged.TotalCount);
    }

    // ── Create ────────────────────────────────────────────────────────────────

    [Fact]
    public async Task Create_ValidDto_ReturnsCreatedAtAction()
    {
        var dto = new CreateRouteDto("North Line", new List<RoutePointDto>
        {
            new(10.0, 106.0, 0),
            new(10.1, 106.1, 1),
        });

        var result = await _sut.Create(dto);

        var created = Assert.IsType<CreatedAtActionResult>(result.Result);
        var routeDto = Assert.IsType<RouteDto>(created.Value);
        Assert.Equal("North Line", routeDto.Name);
        Assert.Equal(2, routeDto.Points.Count);
    }

    // ── GetById ───────────────────────────────────────────────────────────────

    [Fact]
    public async Task GetById_ExistingRoute_ReturnsOk()
    {
        var route = new RouteEntity { Name = "East" };
        _db.Routes.Add(route);
        await _db.SaveChangesAsync();

        var result = await _sut.GetById(route.Id);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var dto = Assert.IsType<RouteDto>(ok.Value);
        Assert.Equal("East", dto.Name);
    }

    [Fact]
    public async Task GetById_NotFound_Returns404()
    {
        var result = await _sut.GetById(Guid.NewGuid());
        Assert.IsType<NotFoundResult>(result.Result);
    }

    // ── Post by-ids (batch for tracking assignments) ─────────────────────────

    [Fact]
    public async Task GetByIds_NullOrEmpty_ReturnsOkEmptyArray()
    {
        var r1 = await _sut.GetByIds(null!);
        var ok1 = Assert.IsType<OkObjectResult>(r1.Result);
        Assert.Empty(Assert.IsType<RouteDto[]>(ok1.Value));

        var r2 = await _sut.GetByIds(new RoutesByIdsRequest(Array.Empty<Guid>()));
        var ok2 = Assert.IsType<OkObjectResult>(r2.Result);
        Assert.Empty(Assert.IsType<RouteDto[]>(ok2.Value));
    }

    [Fact]
    public async Task GetByIds_ReturnsRoutesWithPoints_SortedByName_OmitsMissingIds()
    {
        var a = new RouteEntity
        {
            Name = "Alpha",
            Points =
            [
                new RoutePoint { Latitude = 1, Longitude = 2, Order = 0 },
                new RoutePoint { Latitude = 1.1, Longitude = 2.1, Order = 1 },
            ]
        };
        var b = new RouteEntity
        {
            Name = "Bravo",
            Points = [new RoutePoint { Latitude = 3, Longitude = 4, Order = 0 }]
        };
        _db.Routes.AddRange(a, b);
        await _db.SaveChangesAsync();

        var unknown = Guid.NewGuid();
        var result = await _sut.GetByIds(new RoutesByIdsRequest([b.Id, unknown, a.Id]));
        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var list = Assert.IsAssignableFrom<IReadOnlyList<RouteDto>>(ok.Value);
        Assert.Equal(2, list.Count);
        Assert.Equal(new[] { "Alpha", "Bravo" }, list.Select(x => x.Name).ToArray());
        Assert.Equal(2, list[0].Points.Count);
        Assert.Single(list[1].Points);
    }

    // ── Update ─────────────────────────────────────────────────────────────────

    /// <summary>
    /// Regression for CSV bulk replace: loading Route.Include(Points) then Remove/Replace correlated
    /// deletes poorly with SQL Server and InMemory → DbUpdateConcurrencyException. Delete by query, reload DTO graph.
    /// </summary>
    [Fact]
    public async Task Update_ExistingRoute_ReplacesAllPointsAndName()
    {
        var route = new RouteEntity
        {
            Name = "North",
            Points =
            [
                new RoutePoint { Latitude = 1, Longitude = 2, Order = 0 },
                new RoutePoint { Latitude = 3, Longitude = 4, Order = 1 },
            ]
        };
        _db.Routes.Add(route);
        await _db.SaveChangesAsync();

        var dto = new UpdateRouteDto("North v2",
            new List<RoutePointDto>
            {
                new(10.77, 106.70, 0),
                new(10.78, 106.71, 1),
                new(10.79, 106.72, 2),
            });

        var result = await _sut.Update(route.Id, dto);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var updatedDto = Assert.IsType<RouteDto>(ok.Value);
        Assert.Equal("North v2", updatedDto.Name);
        Assert.Equal(3, updatedDto.Points.Count);
        Assert.Equal(106.71, updatedDto.Points[1].Longitude);

        Assert.Equal(3, await _db.RoutePoints.CountAsync(p => p.RouteId == route.Id));
        Assert.Equal(0, await _db.RoutePoints.CountAsync(p => p.RouteId == route.Id && Math.Abs(p.Latitude - 1) < 0.001));
    }
}
