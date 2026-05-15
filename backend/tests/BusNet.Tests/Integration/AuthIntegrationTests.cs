using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using BusNet.Core.DTOs;
using BusNet.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace BusNet.Tests.Integration;

public class AuthIntegrationTests : IClassFixture<BusNetWebAppFactory>
{
    private readonly HttpClient _client;

    public AuthIntegrationTests(BusNetWebAppFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task Login_ValidCredentials_Returns200WithToken()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login",
            new LoginRequest("admin", "admin123"));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(body);
        Assert.False(string.IsNullOrWhiteSpace(body.Token));
        Assert.False(string.IsNullOrWhiteSpace(body.RefreshToken));
        Assert.Equal("admin", body.UserName);
    }

    [Fact]
    public async Task Login_InvalidPassword_Returns401()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login",
            new LoginRequest("admin", "wrongpassword"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_UnknownUser_Returns401()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/login",
            new LoginRequest("nobody", "pass"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ProtectedEndpoint_WithoutToken_Returns401()
    {
        var response = await _client.GetAsync("/api/user/me");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ProtectedEndpoint_WithValidToken_Returns200()
    {
        var loginResp = await _client.PostAsJsonAsync("/api/auth/login",
            new LoginRequest("admin", "admin123"));
        var body = await loginResp.Content.ReadFromJsonAsync<LoginResponse>();

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", body!.Token);

        var response = await _client.GetAsync("/api/user/me");

        _client.DefaultRequestHeaders.Authorization = null;

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Refresh_ValidRefresh_ReturnsNewTokenPair()
    {
        var loginResp = await _client.PostAsJsonAsync("/api/auth/login",
            new LoginRequest("admin", "admin123"));
        var loginBody = await loginResp.Content.ReadFromJsonAsync<LoginResponse>();
        Assert.NotNull(loginBody?.RefreshToken);

        var refreshResp = await _client.PostAsJsonAsync("/api/auth/refresh",
            new RefreshRequest(loginBody.RefreshToken));

        Assert.Equal(HttpStatusCode.OK, refreshResp.StatusCode);
        var refreshed = await refreshResp.Content.ReadFromJsonAsync<RefreshResponse>();
        Assert.NotNull(refreshed);
        Assert.False(string.IsNullOrWhiteSpace(refreshed.Token));
        Assert.False(string.IsNullOrWhiteSpace(refreshed.RefreshToken));
    }

    [Fact]
    public async Task Refresh_InvalidRefresh_Returns401()
    {
        var response = await _client.PostAsJsonAsync("/api/auth/refresh",
            new RefreshRequest("not-a-valid-jwt"));

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task ProtectedEndpoint_CannotUseRefreshTokenAsBearer()
    {
        var loginResp = await _client.PostAsJsonAsync("/api/auth/login",
            new LoginRequest("admin", "admin123"));
        var loginBody = await loginResp.Content.ReadFromJsonAsync<LoginResponse>();

        _client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", loginBody!.RefreshToken);

        var response = await _client.GetAsync("/api/user/me");

        _client.DefaultRequestHeaders.Authorization = null;

        // Refresh JWT is valid for JwtBearer but lacks token_kind=access on the default policy.
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
