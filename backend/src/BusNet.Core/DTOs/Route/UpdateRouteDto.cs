using System.ComponentModel.DataAnnotations;

namespace BusNet.Core.DTOs.Route;

public record UpdateRouteDto(
    [Required, MaxLength(100)] string Name,
    IList<RoutePointDto> Points
);
