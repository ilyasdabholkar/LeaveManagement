using System.ComponentModel.DataAnnotations;

namespace Employee.API.DTOs;

public class EmployeeCreateDto
{
    [Required, MaxLength(100)]
    public string FirstName { get; set; } = null!;

    [Required, MaxLength(100)]
    public string LastName { get; set; } = null!;

    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = null!;

    [Required, MaxLength(20)]
    public string Phone { get; set; } = null!;

    [Required, MaxLength(100)]
    public string Department { get; set; } = null!;

    [Required, MaxLength(100)]
    public string Designation { get; set; } = null!;

    [Required]
    public DateTime JoinDate { get; set; }

    [MaxLength(20)]
    public string? Status { get; set; }

}
