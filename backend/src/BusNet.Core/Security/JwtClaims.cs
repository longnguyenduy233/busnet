namespace BusNet.Core.Security;

/// <summary>Custom JWT claim names shared by Issuer.Signing JWTs.</summary>
public static class JwtClaims
{
    public const string TokenKind = "token_kind";

    public const string Access = "access";

    public const string Refresh = "refresh";
}
