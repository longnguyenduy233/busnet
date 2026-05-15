namespace BusNet.Core.DTOs.Tracking;

public record BusLocationDto(
    Guid BusId,
    double Latitude,
    double Longitude,
    DateTime Timestamp
);
