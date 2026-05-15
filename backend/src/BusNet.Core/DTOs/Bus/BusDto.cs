namespace BusNet.Core.DTOs.Bus;

/// <param name="RouteName">Display name from the assigned route row at query time (null when unassigned).</param>
public record BusDto(
    Guid Id,
    string Name,
    string LicensePlate,
    int Capacity,
    string Status,
    Guid? RouteId,
    string? RouteName
);
