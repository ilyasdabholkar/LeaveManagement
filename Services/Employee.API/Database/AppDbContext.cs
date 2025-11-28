using Employee.API.Database.Configurations;
using Employee.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Employee.API.Database;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
       : base(options) { }

    public DbSet<Employees> Employees { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new EmployeeConfiguration());
    }
}
