using BusNet.Core.DTOs;
using BusNet.Core.Entities;
using BusNet.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BusNet.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly ITokenService _tokenService;

    public AuthController(
        UserManager<AppUser> userManager,
        SignInManager<AppUser> signInManager,
        ITokenService tokenService)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var user = await _userManager.FindByNameAsync(request.UserName);
        if (user == null)
            return Unauthorized(new { message = "Invalid credentials" });

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (!result.Succeeded)
            return Unauthorized(new { message = "Invalid credentials" });

        var access = _tokenService.CreateAccessToken(user);
        var refresh = _tokenService.CreateRefreshToken(user);
        return Ok(new LoginResponse(access, refresh, user.UserName!, user.DisplayName));
    }

    /// <summary>Issues a new access + refresh pair; invalid/expired refresh returns 401.</summary>
    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<ActionResult<RefreshResponse>> Refresh([FromBody] RefreshRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
            return Unauthorized();

        if (!_tokenService.TryValidateRefreshToken(request.RefreshToken, out var userId) ||
            string.IsNullOrEmpty(userId))
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Unauthorized();

        var access = _tokenService.CreateAccessToken(user);
        var refresh = _tokenService.CreateRefreshToken(user);
        return Ok(new RefreshResponse(access, refresh));
    }
}
