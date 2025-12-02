using System.ComponentModel.DataAnnotations;

namespace Employee.API.DTOs;

public class EmployeeUpdateDto
{
    [Required]
    public string FirstName { get; set; } = default!;

    public string? LastName { get; set; }
    [EmailAddress]
    public string? Email { get; set; }

    public string? Phone { get; set; }
    public string? Department { get; set; }
    public string? Designation { get; set; }
    public DateTime? JoinDate { get; set; }
    public string? Status { get; set; }
}


