namespace Auth.API.DTOs;

public class AuthResponse
{
    public string AccessToken { get; set; } = null!;
    public DateTime ExpiresAt { get; set; }
}
