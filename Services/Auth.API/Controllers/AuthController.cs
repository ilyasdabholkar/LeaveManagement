using Auth.API.Database;
using Auth.API.DTOs;
using Auth.API.Helpers;
using Auth.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Auth.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly JwtSettings _jwtSettings;

    public AuthController(AppDbContext db, IOptions<JwtSettings> jwtOptions)
    {
        _db = db;
        _jwtSettings = jwtOptions.Value;
    }

    [HttpPost("authenticate")]
    public async Task<IActionResult> Authenticate([FromBody] AuthRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(ApiResponse<string>.Fail("Email and password are required."));

        var user = await _db.UserAccounts.FirstOrDefaultAsync(u => u.Email.ToString() == req.Email || u.PasswordHash != null);

        if (user == null)
            return Unauthorized(ApiResponse<string>.Fail("Invalid credentials."));

        var isValid = PasswordHelper.Verify(req.Password, user.PasswordHash);
        if (!isValid)
            return Unauthorized(ApiResponse<string>.Fail("Invalid credentials."));

        var (token, expiresAt) = TokenHelper.GenerateJwtToken(user, _jwtSettings);

        _db.UserAccounts.Update(user);
        await _db.SaveChangesAsync();

        var tokenData = new AuthResponse
        {
            AccessToken = token,
            ExpiresAt = expiresAt,
        };

        return Ok(ApiResponse<AuthResponse>.Success(tokenData, "Authenticated"));
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] UserAccountDto req)
    {
        if (string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password) || string.IsNullOrWhiteSpace(req.Id) || string.IsNullOrWhiteSpace(req.Role))
            return BadRequest(ApiResponse<string>.Fail("Invalid payload"));

        var user = await _db.UserAccounts.FirstOrDefaultAsync(u => u.Email.ToString() == req.Email);

        if (user != null)
            return BadRequest(ApiResponse<string>.Fail("User already exists."));

        var passwordHash = PasswordHelper.HashPassword(req.Password);
        UserAccount account = new UserAccount()
        {
            Id = req.Id,
            Email = req.Email,
            Role = req.Role,
            PasswordHash = passwordHash,
        };

        _db.UserAccounts.Add(account);
        await _db.SaveChangesAsync();
        return Ok(ApiResponse<bool>.Success(true, "Employee Credentials Created"));
    }
}
