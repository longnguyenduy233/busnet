namespace BusNet.Core.DTOs.Route;

/// <summary>Batch-load route geometries for tracking / assignments — not subject to admin list paging.</summary>
public record RoutesByIdsRequest(IReadOnlyList<Guid> RouteIds);
