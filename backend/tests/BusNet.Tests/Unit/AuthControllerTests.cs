using BusNet.Api.Controllers;
using BusNet.Core.DTOs;
using BusNet.Core.Entities;
using BusNet.Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using IdentitySignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace BusNet.Tests.Unit;

public class AuthControllerTests
{
    private readonly Mock<UserManager<AppUser>> _userManagerMock;
    private readonly Mock<SignInManager<AppUser>> _signInManagerMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly AuthController _sut;

    public AuthControllerTests()
    {
        _userManagerMock = new Mock<UserManager<AppUser>>(
            Mock.Of<IUserStore<AppUser>>(), null!, null!, null!, null!, null!, null!, null!, null!);

        _signInManagerMock = new Mock<SignInManager<AppUser>>(
            _userManagerMock.Object,
            Mock.Of<IHttpContextAccessor>(),
            Mock.Of<IUserClaimsPrincipalFactory<AppUser>>(),
            null!, null!, null!, null!);

        _tokenServiceMock = new Mock<ITokenService>();

        _sut = new AuthController(
            _userManagerMock.Object,
            _signInManagerMock.Object,
            _tokenServiceMock.Object);
    }

    [Fact]
    public async Task Login_ValidCredentials_ReturnsOkWithToken()
    {
        var user = new AppUser { UserName = "admin", DisplayName = "Administrator" };
        _userManagerMock.Setup(m => m.FindByNameAsync("admin")).ReturnsAsync(user);
        _signInManagerMock
            .Setup(m => m.CheckPasswordSignInAsync(user, "admin123", false))
            .ReturnsAsync(IdentitySignInResult.Success);
        _tokenServiceMock.Setup(m => m.CreateAccessToken(user)).Returns("access-jwt");
        _tokenServiceMock.Setup(m => m.CreateRefreshToken(user)).Returns("refresh-jwt");

        var result = await _sut.Login(new LoginRequest("admin", "admin123"));

        var ok = Assert.IsType<OkObjectResult>(result.Result);
        var response = Assert.IsType<LoginResponse>(ok.Value);
        Assert.Equal("access-jwt", response.Token);
        Assert.Equal("refresh-jwt", response.RefreshToken);
        Assert.Equal("admin", response.UserName);
        Assert.Equal("Administrator", response.DisplayName);
    }

    [Fact]
    public async Task Login_UnknownUser_ReturnsUnauthorized()
    {
        _userManagerMock.Setup(m => m.FindByNameAsync("unknown")).ReturnsAsync((AppUser?)null);

        var result = await _sut.Login(new LoginRequest("unknown", "pass"));

        Assert.IsType<UnauthorizedObjectResult>(result.Result);
    }

    [Fact]
    public async Task Login_WrongPassword_ReturnsUnauthorized()
    {
        var user = new AppUser { UserName = "admin" };
        _userManagerMock.Setup(m => m.FindByNameAsync("admin")).ReturnsAsync(user);
        _signInManagerMock
            .Setup(m => m.CheckPasswordSignInAsync(user, "wrong", false))
            .ReturnsAsync(IdentitySignInResult.Failed);

        var result = await _sut.Login(new LoginRequest("admin", "wrong"));

        Assert.IsType<UnauthorizedObjectResult>(result.Result);
    }

    [Fact]
    public async Task Login_ValidCredentials_CallsCreateToken()
    {
        var user = new AppUser { UserName = "admin", DisplayName = "Administrator" };
        _userManagerMock.Setup(m => m.FindByNameAsync("admin")).ReturnsAsync(user);
        _signInManagerMock
            .Setup(m => m.CheckPasswordSignInAsync(user, "admin123", false))
            .ReturnsAsync(IdentitySignInResult.Success);
        _tokenServiceMock.Setup(m => m.CreateAccessToken(user)).Returns("token");
        _tokenServiceMock.Setup(m => m.CreateRefreshToken(user)).Returns("refresh");

        await _sut.Login(new LoginRequest("admin", "admin123"));

        _tokenServiceMock.Verify(m => m.CreateAccessToken(user), Times.Once);
        _tokenServiceMock.Verify(m => m.CreateRefreshToken(user), Times.Once);
    }

    [Fact]
    public async Task Login_WrongPassword_NeverCallsCreateToken()
    {
        var user = new AppUser { UserName = "admin" };
        _userManagerMock.Setup(m => m.FindByNameAsync("admin")).ReturnsAsync(user);
        _signInManagerMock
            .Setup(m => m.CheckPasswordSignInAsync(user, "wrong", false))
            .ReturnsAsync(IdentitySignInResult.Failed);

        await _sut.Login(new LoginRequest("admin", "wrong"));

        _tokenServiceMock.Verify(m => m.CreateAccessToken(It.IsAny<AppUser>()), Times.Never);
        _tokenServiceMock.Verify(m => m.CreateRefreshToken(It.IsAny<AppUser>()), Times.Never);
    }
}
