using Employee.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Employee.API.Database.Seed;

public static class AppDbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        if (await context.Employees.AnyAsync())
            return;

        var employees = new List<Employees>
        {
            new()
            {
                Id="e_019acb99-127f-7102-8c24-76a88c10c8d4",
                FirstName="Ilyas",
                LastName="Dabholkar",
                Email="ilyas@example.com",
                Phone="9876543210",
                Department="Engineering",
                Designation="Software Developer",
                JoinDate=DateTime.Now,
                Status="ACTIVE",
                CreatedAt=DateTime.Now,
                UpdatedAt=DateTime.Now
            }
        };

        context.Employees.AddRange(employees);
        await context.SaveChangesAsync();
    }
}
