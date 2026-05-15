using BusNet.Api.Hubs;
using BusNet.Core.DTOs.Tracking;
using BusNet.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace BusNet.Api.Controllers;

[ApiController]
[Route("api/tracking")]
[Authorize]
public class TrackingController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IHubContext<TrackingHub> _hub;

    public TrackingController(AppDbContext db, IHubContext<TrackingHub> hub)
    {
        _db = db;
        _hub = hub;
    }

    /// <summary>
    /// Called by the GPS simulator. Validates the bus, then broadcasts to all
    /// connected clients via SignalR.
    /// </summary>
    [HttpPost("update-location")]
    public async Task<ActionResult<BusLocationDto>> UpdateLocation([FromBody] UpdateLocationDto dto)
    {
        var busExists = await _db.Buses.AnyAsync(b => b.Id == dto.BusId);
        if (!busExists)
            return NotFound(new { message = "Bus not found." });

        var location = new BusLocationDto(
            dto.BusId,
            dto.Latitude,
            dto.Longitude,
            DateTime.UtcNow
        );

        await _hub.Clients.All.SendAsync("ReceiveBusLocation", location);
        return Ok(location);
    }
}
