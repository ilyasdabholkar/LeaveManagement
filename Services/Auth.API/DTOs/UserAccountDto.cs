using System.ComponentModel.DataAnnotations;

namespace Auth.API.DTOs;

public class UserAccountDto
{
    [Required]
    public string Id { get; set; }
    [Required]
    public string Email { get; set; }
    [Required]
    public string Role { get; set; } 
    [Required]
    public string Password { get; set; }
}
