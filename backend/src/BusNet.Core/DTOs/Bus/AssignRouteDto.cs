using System.ComponentModel.DataAnnotations;

namespace BusNet.Core.DTOs.Bus;

public record AssignRouteDto([Required] Guid RouteId);
