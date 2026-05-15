namespace BusNet.Core.DTOs;

/// <summary>Issued after a successful refresh; rotates both tokens.</summary>
public record RefreshResponse(string Token, string RefreshToken);
