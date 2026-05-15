namespace BusNet.Core.DTOs;

public record LoginResponse(string Token, string RefreshToken, string UserName, string DisplayName);
