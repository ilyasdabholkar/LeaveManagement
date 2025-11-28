using System.Data;

namespace Auth.API.Models;

public class UserAccount
{
    public string Id { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = null!;
    public DateTime? LastLogin { get; set; }

    public void UpdateLastLogin(DateTime when) => LastLogin = when;
}
