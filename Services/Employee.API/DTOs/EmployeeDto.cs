namespace Employee.API.DTOs;

public class EmployeeDto
{
    public string Id { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string Department { get; set; } = null!;
    public string Designation { get; set; } = null!;
    public DateTime JoinDate { get; set; }
    public string Status { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; }
}