using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using BusNet.Core.Entities;
using BusNet.Core.Interfaces;
using BusNet.Core.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace BusNet.Infrastructure.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _config;

    public TokenService(IConfiguration config)
    {
        _config = config;
    }

    /// <inheritdoc />
    public string CreateAccessToken(AppUser user)
    {
        var now = DateTime.UtcNow;
        var minutes = int.TryParse(_config["Jwt:AccessTokenExpiryMinutes"], out var m) ? m : 15;
        if (minutes < 1) minutes = 1;

        var claims = new List<Claim>
        {
            new(JwtClaims.TokenKind, JwtClaims.Access),
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.UniqueName, user.UserName!),
            new("displayName", user.DisplayName),
        };

        return CreateJwt(claims, now.AddMinutes(minutes));
    }

    /// <inheritdoc />
    public string CreateRefreshToken(AppUser user)
    {
        var now = DateTime.UtcNow;
        var days = int.TryParse(_config["Jwt:RefreshTokenExpiryDays"], out var d) ? d : 14;
        if (days < 1) days = 1;

        var claims = new List<Claim>
        {
            new(JwtClaims.TokenKind, JwtClaims.Refresh),
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };

        return CreateJwt(claims, now.AddDays(days));
    }

    /// <inheritdoc />
    public bool TryValidateRefreshToken(string jwt, out string? userId)
    {
        userId = null;
        var handler = new JwtSecurityTokenHandler();
        if (!handler.CanReadToken(jwt)) return false;

        try
        {
            var principal =
                handler.ValidateToken(jwt, BuildValidationParameters(validateLifetime: true), out var validated);
            if (validated is not JwtSecurityToken typed) return false;

            var kindClaim = typed.Claims.FirstOrDefault(c => c.Type == JwtClaims.TokenKind)?.Value;
            if (!string.Equals(kindClaim, JwtClaims.Refresh, StringComparison.Ordinal)) return false;

            userId =
                typed.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub)?.Value ??
                principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            return !string.IsNullOrEmpty(userId);
        }
        catch
        {
            return false;
        }
    }

    private TokenValidationParameters BuildValidationParameters(bool validateLifetime) =>
        new()
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
            ),
            ValidateIssuer = true,
            ValidIssuer = _config["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = _config["Jwt:Audience"],
            ValidateLifetime = validateLifetime,
            ClockSkew = TimeSpan.Zero
        };

    private string CreateJwt(IEnumerable<Claim> claims, DateTime expiresUtc)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: expiresUtc,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
