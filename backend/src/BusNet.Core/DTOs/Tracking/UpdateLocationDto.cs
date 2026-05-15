using System.ComponentModel.DataAnnotations;

namespace BusNet.Core.DTOs.Tracking;

public record UpdateLocationDto(
    [Required] Guid BusId,
    [Required] double Latitude,
    [Required] double Longitude
);
