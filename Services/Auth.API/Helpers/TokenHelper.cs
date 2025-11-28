using Auth.API.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Auth.API.Helpers;

public static class TokenHelper
{
    public static (string token, DateTime expiresAt) GenerateJwtToken(UserAccount user,JwtSettings jwtSettings)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiresAt = DateTime.Now.AddMinutes(jwtSettings.AccessTokenExpirationMinutes);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim("uid", user.Email.ToString()),
            new Claim("role", user.Role.ToString()),
            new Claim("dbId", user.Id.ToString()) 
        };

        var tokenDescriptor = new JwtSecurityToken(
            issuer: jwtSettings.Issuer,
            audience: jwtSettings.Audience,
            claims: claims,
            notBefore: DateTime.Now,
            expires: expiresAt,
            signingCredentials: creds
        );

        var token = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);
        return (token, expiresAt);
    }
}
