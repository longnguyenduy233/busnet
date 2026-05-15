using Microsoft.AspNetCore.Identity;

namespace BusNet.Core.Entities;

public class AppUser : IdentityUser
{
    public string DisplayName { get; set; } = string.Empty;
}
