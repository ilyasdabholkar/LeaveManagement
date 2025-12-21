
using Auth.API.Models;
using Microsoft.EntityFrameworkCore;



namespace Auth.API.Database.Seed;

public static class AppDbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.UserAccounts.AnyAsync())
            return;

        var accounts = new List<UserAccount>
        {
            new()
            {
                Id="e_019acb99-127f-7102-8c24-76a88c10c8d4",
                Email="ilyas@example.com",
                Role="ADMIN",
                PasswordHash="$2a$11$YIetrfY17X/wVFqJTBAvQekk9jKgf9eo9DxF/tCDaewt4i.F1hvWa",
            }
        };

        context.UserAccounts.AddRange(accounts);
        await context.SaveChangesAsync();
    }

}
