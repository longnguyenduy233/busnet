using System.IdentityModel.Tokens.Jwt;
using BusNet.Core.Entities;
using BusNet.Core.Security;
using BusNet.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace BusNet.Tests.Unit;

public class TokenServiceTests
{
    private readonly TokenService _sut;

    public TokenServiceTests()
    {
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "TestSuperSecretKeyForUnitTestingOnly!",
                ["Jwt:Issuer"] = "BusNetApi",
                ["Jwt:Audience"] = "BusNetClient",
                ["Jwt:AccessTokenExpiryMinutes"] = "25",
                ["Jwt:RefreshTokenExpiryDays"] = "5"
            })
            .Build();

        _sut = new TokenService(config);
    }

    [Fact]
    public void CreateAccessToken_ReturnsNonEmptyString()
    {
        var user = MakeUser();
        var token = _sut.CreateAccessToken(user);
        Assert.False(string.IsNullOrWhiteSpace(token));
    }

    [Fact]
    public void CreateAccessToken_HasAccessKindClaim()
    {
        var user = MakeUser();
        var jwt = Read(_sut.CreateAccessToken(user));

        Assert.Equal(JwtClaims.Access, jwt!.Claims.Single(c => c.Type == JwtClaims.TokenKind).Value);
    }

    [Fact]
    public void CreateAccessToken_HasCorrectExpiryFromConfigMinutes()
    {
        var user = MakeUser();
        var before = DateTime.UtcNow;
        var jwt = Read(_sut.CreateAccessToken(user));
        var after = DateTime.UtcNow;

        Assert.True(jwt!.ValidTo >= before.AddMinutes(25).AddSeconds(-5));
        Assert.True(jwt.ValidTo <= after.AddMinutes(25).AddSeconds(5));
    }

    [Fact]
    public void CreateRefreshToken_HasRefreshKindAndSubClaim()
    {
        var user = MakeUser();
        var jwt = Read(_sut.CreateRefreshToken(user));

        Assert.Equal(JwtClaims.Refresh, jwt!.Claims.Single(c => c.Type == JwtClaims.TokenKind).Value);
        var sub = jwt.Claims.Single(c => c.Type == JwtRegisteredClaimNames.Sub);
        Assert.Equal(user.Id, sub.Value);
    }

    [Fact]
    public void TryValidateRefreshToken_AcceptsValidRefreshToken_ReturnsTrueWithUserId()
    {
        var user = MakeUser();
        var refresh = _sut.CreateRefreshToken(user);

        var ok = _sut.TryValidateRefreshToken(refresh, out var id);

        Assert.True(ok);
        Assert.Equal(user.Id, id);
    }

    [Fact]
    public void TryValidateRefreshToken_AccessTokenRejected()
    {
        var user = MakeUser();
        var access = _sut.CreateAccessToken(user);

        var ok = _sut.TryValidateRefreshToken(access, out var id);

        Assert.False(ok);
        Assert.Null(id);
    }

    private static JwtSecurityToken? Read(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        Assert.True(handler.CanReadToken(token));
        return handler.ReadJwtToken(token);
    }

    private static AppUser MakeUser() => new()
    {
        Id = Guid.NewGuid().ToString(),
        UserName = "testuser",
        Email = "test@busnet.local",
        DisplayName = "Test User"
    };
}
