namespace Auth.API.Models;

public class JwtSettings
{
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public string Secret { get; set; } = null!; 
    public int AccessTokenExpirationMinutes { get; set; } = 60;
}