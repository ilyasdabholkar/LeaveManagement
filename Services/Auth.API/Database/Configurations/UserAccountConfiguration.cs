using Auth.API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Auth.API.Database.Configurations;

public class UserAccountConfiguration : IEntityTypeConfiguration<UserAccount>
{
    public void Configure(EntityTypeBuilder<UserAccount> builder)
    {
        builder.ToTable("user_accounts");

        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id)
               .HasColumnName("id")
               .IsRequired();

        builder.Property(u => u.Email)
               .HasColumnName("email")
               .IsRequired();

        builder.HasIndex(u => u.Email)
               .IsUnique()
               .HasDatabaseName("ux_user_accounts_emails");

        builder.Property(u => u.Role)
               .HasColumnName("role")
               .HasConversion<string>()
               .HasMaxLength(20)
               .IsRequired();

        builder.Property(u => u.PasswordHash)
               .HasColumnName("password_hash")
               .IsRequired()
               .HasMaxLength(1024);

        builder.Property(u => u.LastLogin)
               .HasColumnName("last_login")
               .IsRequired(false);
    }
}