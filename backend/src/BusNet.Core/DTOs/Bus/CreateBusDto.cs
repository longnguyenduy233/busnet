using System.ComponentModel.DataAnnotations;

namespace BusNet.Core.DTOs.Bus;

public record CreateBusDto(
    [Required, MaxLength(100)] string Name,
    [Required, MaxLength(20)] string LicensePlate,
    [Range(1, 200)] int Capacity,
    string Status = "Active"
);
