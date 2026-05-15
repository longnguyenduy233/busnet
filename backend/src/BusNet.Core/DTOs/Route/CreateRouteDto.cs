using System.ComponentModel.DataAnnotations;

namespace BusNet.Core.DTOs.Route;

public record CreateRouteDto(
    [Required, MaxLength(100)] string Name,
    IList<RoutePointDto> Points
);
