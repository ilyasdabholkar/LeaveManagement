using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Employee.API.Models;

namespace Employee.API.Database.Configurations;

public class EmployeeConfiguration : IEntityTypeConfiguration<Employees>
{
    public void Configure(EntityTypeBuilder<Employees> builder)
    {
        builder.ToTable("employees");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id)
               .HasColumnName("id")
               .IsRequired();

        builder.Property(e => e.FirstName)
               .HasColumnName("first_name")
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(e => e.LastName)
               .HasColumnName("last_name")
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(e => e.Email)
               .HasColumnName("email")
               .HasMaxLength(150)
               .IsRequired();

        builder.HasIndex(e => e.Email)
               .IsUnique()
               .HasDatabaseName("ux_employee_email");

        builder.Property(e => e.Phone)
               .HasColumnName("phone")
               .HasMaxLength(20)
               .IsRequired();

        builder.Property(e => e.Department)
               .HasColumnName("department")
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(e => e.Designation)
               .HasColumnName("designation")
               .HasMaxLength(100)
               .IsRequired();

        builder.Property(e => e.JoinDate)
               .HasColumnName("join_date")
               .IsRequired();

        builder.Property(e => e.Status)
               .HasColumnName("status")
               .HasConversion<string>()       
               .HasMaxLength(20)
               .IsRequired();

        builder.Property(e => e.CreatedAt)
               .HasColumnName("created_at")
               .IsRequired();

        builder.Property(e => e.UpdatedAt)
               .HasColumnName("updated_at")
               .IsRequired();
    }
}
