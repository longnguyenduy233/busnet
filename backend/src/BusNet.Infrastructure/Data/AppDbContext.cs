using BusNet.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BusNet.Infrastructure.Data;

public class AppDbContext : IdentityDbContext<AppUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Bus> Buses => Set<Bus>();
    public DbSet<Route> Routes => Set<Route>();
    public DbSet<RoutePoint> RoutePoints => Set<RoutePoint>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.Entity<Bus>(b =>
        {
            b.HasKey(x => x.Id);
            b.Property(x => x.Name).IsRequired().HasMaxLength(100);
            b.Property(x => x.LicensePlate).IsRequired().HasMaxLength(20);
            b.HasOne(x => x.Route)
                .WithMany(r => r.Buses)
                .HasForeignKey(x => x.RouteId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        builder.Entity<Route>(r =>
        {
            r.HasKey(x => x.Id);
            r.Property(x => x.Name).IsRequired().HasMaxLength(100);
        });

        builder.Entity<RoutePoint>(rp =>
        {
            rp.HasKey(x => x.Id);
            rp.HasOne(x => x.Route)
                .WithMany(r => r.Points)
                .HasForeignKey(x => x.RouteId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
