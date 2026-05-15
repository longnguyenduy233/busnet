namespace BusNet.Core.DTOs.Route;

public record RouteDto(Guid Id, string Name, IReadOnlyList<RoutePointDto> Points);
