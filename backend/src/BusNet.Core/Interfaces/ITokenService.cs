using BusNet.Core.Entities;

namespace BusNet.Core.Interfaces;

public interface ITokenService
{
    string CreateAccessToken(AppUser user);

    string CreateRefreshToken(AppUser user);

    /// <summary>Returns true when <paramref name="jwt"/> is a valid, non-expired refresh token.</summary>
    bool TryValidateRefreshToken(string jwt, out string? userId);
}
