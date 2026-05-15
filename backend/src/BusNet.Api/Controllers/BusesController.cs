using BusNet.Core.DTOs.Bus;
using BusNet.Core.DTOs.Common;
using BusNet.Core.Entities;
using BusNet.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BusNet.Api.Controllers;

[ApiController]
[Route("api/buses")]
[Authorize]
public class BusesController : ControllerBase
{
    private readonly AppDbContext _db;

    public BusesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<PagedResult<BusDto>>> GetAll(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string sortBy = "name",
        [FromQuery] string sortDir = "asc",
        [FromQuery] string? status = null)
    {
        page = Math.Max(1, page);
        pageSize = Math.Clamp(pageSize, 1, 100);

        var query = _db.Buses.AsNoTracking();
        // Optional filter (e.g. Tracking sidebar shows active fleet only).
        if (!string.IsNullOrWhiteSpace(status)
            && Enum.TryParse<BusStatus>(status, ignoreCase: true, out var statusFilter))
        {
            query = query.Where(b => b.Status == statusFilter);
        }

        var totalCount = await query.CountAsync();

        query = (sortBy.ToLowerInvariant(), sortDir.ToLowerInvariant()) switch
        {
            ("route", "desc")        => query
                .OrderBy(b => b.RouteId == null ? 1 : 0)
                .ThenByDescending(b => b.Route != null ? b.Route.Name : string.Empty)
                .ThenByDescending(b => b.Name),
            ("route", _)             => query
                .OrderBy(b => b.RouteId == null ? 1 : 0)
                .ThenBy(b => b.Route != null ? b.Route.Name : string.Empty)
                .ThenBy(b => b.Name),
            ("licenseplate", "desc") => query.OrderByDescending(b => b.LicensePlate),
            ("licenseplate", _)      => query.OrderBy(b => b.LicensePlate),
            ("capacity", "desc")     => query.OrderByDescending(b => b.Capacity),
            ("capacity", _)          => query.OrderBy(b => b.Capacity),
            ("status", "desc")       => query.OrderByDescending(b => b.Status),
            ("status", _)            => query.OrderBy(b => b.Status),
            (_, "desc")              => query.OrderByDescending(b => b.Name),
            _                        => query.OrderBy(b => b.Name),
        };

        // Project route name via navigation so the client does not need a separate routes request for the grid.
        var items = await query
            .Select(b => new BusDto(
                b.Id,
                b.Name,
                b.LicensePlate,
                b.Capacity,
                b.Status == BusStatus.Active ? "Active" : "Inactive",
                b.RouteId,
                b.Route != null ? b.Route.Name : null))
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return Ok(new PagedResult<BusDto>(items, totalCount, page, pageSize));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<BusDto>> GetById(Guid id)
    {
        var dto = await _db.Buses.AsNoTracking()
            .Where(b => b.Id == id)
            .Select(b => new BusDto(
                b.Id,
                b.Name,
                b.LicensePlate,
                b.Capacity,
                b.Status == BusStatus.Active ? "Active" : "Inactive",
                b.RouteId,
                b.Route != null ? b.Route.Name : null))
            .FirstOrDefaultAsync();
        if (dto is null) return NotFound();
        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<BusDto>> Create([FromBody] CreateBusDto dto)
    {
        if (!Enum.TryParse<BusStatus>(dto.Status, true, out var status))
            return BadRequest(new { message = "Invalid status value." });

        var bus = new Bus
        {
            Name = dto.Name,
            LicensePlate = dto.LicensePlate,
            Capacity = dto.Capacity,
            Status = status
        };

        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = bus.Id }, await ToBusDtoAsync(bus));
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<BusDto>> Update(Guid id, [FromBody] UpdateBusDto dto)
    {
        var bus = await _db.Buses.FindAsync(id);
        if (bus is null) return NotFound();

        if (!Enum.TryParse<BusStatus>(dto.Status, true, out var status))
            return BadRequest(new { message = "Invalid status value." });

        bus.Name = dto.Name;
        bus.LicensePlate = dto.LicensePlate;
        bus.Capacity = dto.Capacity;
        bus.Status = status;

        await _db.SaveChangesAsync();
        return Ok(await ToBusDtoAsync(bus));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var bus = await _db.Buses.FindAsync(id);
        if (bus is null) return NotFound();

        _db.Buses.Remove(bus);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPut("{busId:guid}/assign-route")]
    public async Task<ActionResult<BusDto>> AssignRoute(Guid busId, [FromBody] AssignRouteDto dto)
    {
        var bus = await _db.Buses.FindAsync(busId);
        if (bus is null) return NotFound(new { message = "Bus not found." });

        var routeExists = await _db.Routes.AnyAsync(r => r.Id == dto.RouteId);
        if (!routeExists) return BadRequest(new { message = "Route not found." });

        bus.RouteId = dto.RouteId;
        await _db.SaveChangesAsync();
        return Ok(await ToBusDtoAsync(bus));
    }

    [HttpDelete("{busId:guid}/assign-route")]
    public async Task<ActionResult<BusDto>> UnassignRoute(Guid busId)
    {
        var bus = await _db.Buses.FindAsync(busId);
        if (bus is null) return NotFound(new { message = "Bus not found." });

        bus.RouteId = null;
        await _db.SaveChangesAsync();
        return Ok(await ToBusDtoAsync(bus));
    }

    private async Task<BusDto> ToBusDtoAsync(Bus bus, CancellationToken cancellationToken = default)
    {
        string? routeName = null;
        if (bus.RouteId is { } rid)
        {
            routeName = await _db.Routes.AsNoTracking()
                .Where(r => r.Id == rid)
                .Select(r => r.Name)
                .FirstOrDefaultAsync(cancellationToken);
        }

        return new BusDto(
            bus.Id,
            bus.Name,
            bus.LicensePlate,
            bus.Capacity,
            bus.Status.ToString(),
            bus.RouteId,
            routeName);
    }
}
