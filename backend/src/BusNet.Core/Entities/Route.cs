namespace BusNet.Core.Entities;

public class Route
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = string.Empty;
    public ICollection<RoutePoint> Points { get; set; } = new List<RoutePoint>();
    public ICollection<Bus> Buses { get; set; } = new List<Bus>();
}
