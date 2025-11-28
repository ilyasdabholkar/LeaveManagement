using Auth.API.Database.Configurations;
using Auth.API.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Auth.API.Database;

public class AppDbContext : DbContext
{
    public DbSet<UserAccount> UserAccounts { get; set; } = null!;

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new UserAccountConfiguration());
    }
}
