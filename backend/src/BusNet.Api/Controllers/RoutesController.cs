using BusNet.Core.DTOs.Common;
using BusNet.Core.DTOs.Route;
using BusNet.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BusNet.Api.Controllers;

[ApiController]
[Route("api/routes")]
[Authorize]
public class RoutesController : ControllerBase
{
    private readonly AppDbContext _db;

    public RoutesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<PagedResult<RouteDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string sortBy = "name",
        [FromQuery] string sortDir = "asc")
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var baseQuery = _db.Routes.AsNoTracking();
        var totalCount = await baseQuery.CountAsync();

        var ordered = sortDir.ToLowerInvariant() == "desc"
            ? baseQuery.OrderByDescending(r => r.Name)
            : baseQuery.OrderBy(r => r.Name);

        var routes = await ordered
            .Include(r => r.Points)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new PagedResult<RouteDto>(routes.Select(MapToDto).ToList(), totalCount, page, pageSize));
    }

    /// <summary>Returns full route geometries for the given IDs (e.g. buses assigned routeId). Duplicate / missing IDs are ignored.</summary>
    [HttpPost("by-ids")]
    public async Task<ActionResult<IReadOnlyList<RouteDto>>> GetByIds([FromBody] RoutesByIdsRequest? body)
    {
        if (body?.RouteIds is null || body.RouteIds.Count == 0)
            return Ok(Array.Empty<RouteDto>());

        var ids = body.RouteIds.Where(id => id != Guid.Empty).Distinct().ToList();
        if (ids.Count == 0)
            return Ok(Array.Empty<RouteDto>());

        var routes = await _db.Routes
            .AsNoTracking()
            .Include(r => r.Points)
            .Where(r => ids.Contains(r.Id))
            .ToListAsync();

        var dtos = routes.Select(MapToDto).OrderBy(d => d.Name).ToList();
        return Ok(dtos);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<RouteDto>> GetById(Guid id)
    {
        var route = await _db.Routes
            .AsNoTracking()
            .Include(r => r.Points)
            .FirstOrDefaultAsync(r => r.Id == id);

        if (route is null) return NotFound();
        return Ok(MapToDto(route));
    }

    [HttpPost]
    public async Task<ActionResult<RouteDto>> Create([FromBody] CreateRouteDto dto)
    {
        var route = new Core.Entities.Route
        {
            Name = dto.Name,
            Points = dto.Points.Select((p, i) => new Core.Entities.RoutePoint
            {
                Latitude = p.Latitude,
                Longitude = p.Longitude,
                Order = p.Order > 0 ? p.Order : i
            }).ToList()
        };

        _db.Routes.Add(route);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = route.Id }, MapToDto(route));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<RouteDto>> Update(Guid id, [FromBody] UpdateRouteDto dto)
    {
        var route = await _db.Routes.FirstOrDefaultAsync(r => r.Id == id);

        if (route is null) return NotFound();

        // Replace points via DbSet queries so the parent's navigation is not mutated while children are deleted.
        // Include-then-remove caused duplicate/aborted deletes → DbUpdateConcurrencyException (esp. replacing many CSV points).
        var oldPoints = await _db.RoutePoints.Where(rp => rp.RouteId == id).ToListAsync();
        _db.RoutePoints.RemoveRange(oldPoints);
        await _db.SaveChangesAsync();

        route.Name = dto.Name;

        foreach (var (p, idx) in dto.Points.Select((p, idx) => (p, idx)))
        {
            _db.RoutePoints.Add(new Core.Entities.RoutePoint
            {
                RouteId = route.Id,
                Latitude = p.Latitude,
                Longitude = p.Longitude,
                Order = p.Order > 0 ? p.Order : idx
            });
        }

        await _db.SaveChangesAsync();

        var refreshed = await _db.Routes
            .AsNoTracking()
            .Include(r => r.Points)
            .FirstAsync(r => r.Id == id);

        return Ok(MapToDto(refreshed));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var route = await _db.Routes.FindAsync(id);
        if (route is null) return NotFound();

        _db.Routes.Remove(route);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static RouteDto MapToDto(Core.Entities.Route route) =>
        new(route.Id, route.Name,
            route.Points.OrderBy(p => p.Order)
                .Select(p => new RoutePointDto(p.Latitude, p.Longitude, p.Order))
                .ToList());
}
