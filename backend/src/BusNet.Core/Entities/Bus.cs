namespace BusNet.Core.Entities;

public class Bus
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public string LicensePlate { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public BusStatus Status { get; set; } = BusStatus.Active;
    public Guid? RouteId { get; set; }
    public Route? Route { get; set; }
}

public enum BusStatus
{
    Active,
    Inactive
}
