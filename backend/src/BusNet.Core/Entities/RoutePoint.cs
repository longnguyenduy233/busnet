namespace BusNet.Core.Entities;

public class RoutePoint
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid RouteId { get; set; }
    public Route? Route { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int Order { get; set; }
}
