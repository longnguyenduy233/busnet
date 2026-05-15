using BusNet.Api.Controllers;
using BusNet.Api.Hubs;
using BusNet.Core.DTOs.Tracking;
using BusNet.Core.Entities;
using BusNet.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;
using Xunit;

namespace BusNet.Tests.Unit;

public class TrackingControllerTests : IDisposable
{
    private readonly AppDbContext _db;
    private readonly Mock<IHubContext<TrackingHub>> _hubMock;
    private readonly Mock<IHubClients> _clientsMock;
    private readonly Mock<IClientProxy> _allClientsMock;
    private readonly TrackingController _sut;

    public TrackingControllerTests()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("TrackingTests_" + Guid.NewGuid())
            .Options;
        _db = new AppDbContext(options);

        _allClientsMock = new Mock<IClientProxy>();
        _allClientsMock
            .Setup(p => p.SendCoreAsync(
                It.IsAny<string>(),
                It.IsAny<object[]>(),
                It.IsAny<CancellationToken>()))
            .Returns(Task.CompletedTask);

        _clientsMock = new Mock<IHubClients>();
        _clientsMock.Setup(c => c.All).Returns(_allClientsMock.Object);

        _hubMock = new Mock<IHubContext<TrackingHub>>();
        _hubMock.Setup(h => h.Clients).Returns(_clientsMock.Object);

        _sut = new TrackingController(_db, _hubMock.Object);
    }

    public void Dispose() => _db.Dispose();

    // ── UpdateLocation — validation ───────────────────────────────────────────

    [Fact]
    public async Task UpdateLocation_UnknownBusId_ReturnsNotFound()
    {
        var dto = new UpdateLocationDto(Guid.NewGuid(), 10.77, 106.70);

        var result = await _sut.UpdateLocation(dto);

        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task UpdateLocation_UnknownBusId_DoesNotBroadcast()
    {
        var dto = new UpdateLocationDto(Guid.NewGuid(), 10.77, 106.70);

        await _sut.UpdateLocation(dto);

        _allClientsMock.Verify(
            p => p.SendCoreAsync(It.IsAny<string>(), It.IsAny<object[]>(), It.IsAny<CancellationToken>()),
            Times.Never);
    }

    // ── UpdateLocation — success ──────────────────────────────────────────────

    [Fact]
    public async Task UpdateLocation_ValidBusId_ReturnsOkWithLocation()
    {
        var bus = new Bus { Name = "Bus A", LicensePlate = "A-1", Capacity = 30 };
        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();

        var dto = new UpdateLocationDto(bus.Id, 10.7769, 106.7009);

        var result = await _sut.UpdateLocation(dto);

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var location = Assert.IsType<BusLocationDto>(ok.Value);
        Assert.Equal(bus.Id, location.BusId);
        Assert.Equal(10.7769, location.Latitude);
        Assert.Equal(106.7009, location.Longitude);
    }

    [Fact]
    public async Task UpdateLocation_ValidBusId_TimestampIsRecentUtc()
    {
        var bus = new Bus { Name = "Bus B", LicensePlate = "B-2", Capacity = 40 };
        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();

        var before = DateTime.UtcNow;
        var result = await _sut.UpdateLocation(new UpdateLocationDto(bus.Id, 10.0, 106.0));
        var after = DateTime.UtcNow;

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var location = Assert.IsType<BusLocationDto>(ok.Value);
        Assert.InRange(location.Timestamp, before, after);
    }

    [Fact]
    public async Task UpdateLocation_ValidBusId_BroadcastsReceiveBusLocation()
    {
        var bus = new Bus { Name = "Bus C", LicensePlate = "C-3", Capacity = 50 };
        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();

        await _sut.UpdateLocation(new UpdateLocationDto(bus.Id, 10.78, 106.71));

        _allClientsMock.Verify(
            p => p.SendCoreAsync(
                "ReceiveBusLocation",
                It.IsAny<object[]>(),
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task UpdateLocation_ValidBusId_BroadcastsCorrectPayload()
    {
        var bus = new Bus { Name = "Bus D", LicensePlate = "D-4", Capacity = 35 };
        _db.Buses.Add(bus);
        await _db.SaveChangesAsync();

        object[]? capturedArgs = null;
        _allClientsMock
            .Setup(p => p.SendCoreAsync(
                "ReceiveBusLocation",
                It.IsAny<object[]>(),
                It.IsAny<CancellationToken>()))
            .Callback<string, object[], CancellationToken>((_, args, _) => capturedArgs = args)
            .Returns(Task.CompletedTask);

        await _sut.UpdateLocation(new UpdateLocationDto(bus.Id, 10.7850, 106.6967));

        Assert.NotNull(capturedArgs);
        var location = Assert.IsType<BusLocationDto>(capturedArgs![0]);
        Assert.Equal(bus.Id, location.BusId);
        Assert.Equal(10.7850, location.Latitude);
        Assert.Equal(106.6967, location.Longitude);
    }

    // ── Multiple buses ────────────────────────────────────────────────────────

    [Fact]
    public async Task UpdateLocation_CalledForMultipleBuses_BroadcastsEachSeparately()
    {
        var bus1 = new Bus { Name = "Bus 1", LicensePlate = "E-1", Capacity = 30 };
        var bus2 = new Bus { Name = "Bus 2", LicensePlate = "E-2", Capacity = 30 };
        _db.Buses.AddRange(bus1, bus2);
        await _db.SaveChangesAsync();

        await _sut.UpdateLocation(new UpdateLocationDto(bus1.Id, 10.77, 106.70));
        await _sut.UpdateLocation(new UpdateLocationDto(bus2.Id, 10.78, 106.71));

        _allClientsMock.Verify(
            p => p.SendCoreAsync(
                "ReceiveBusLocation",
                It.IsAny<object[]>(),
                It.IsAny<CancellationToken>()),
            Times.Exactly(2));
    }
}
