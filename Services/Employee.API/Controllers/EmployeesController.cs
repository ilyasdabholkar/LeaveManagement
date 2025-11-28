using Employee.API.Database;
using Employee.API.DTOs;
using Employee.API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Employee.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EmployeesController : ControllerBase
{
    private readonly AppDbContext _db;

    public EmployeesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] EmployeeCreateDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ApiResponse<string>.Fail("Invalid payload."));

        var emailLower = dto.Email.Trim().ToLower();
        var exists = await _db.Employees.AnyAsync(x => x.Email.ToLower() == emailLower);
        if (exists) return Conflict(ApiResponse<string>.Fail("Email already in use."));

        var employee = new Employees
        {
            Id = $"e_{Guid.CreateVersion7()}",
            FirstName = dto.FirstName.Trim(),
            LastName = dto.LastName.Trim(),
            Email = dto.Email.Trim(),
            Phone = dto.Phone.Trim(),
            Department = dto.Department.Trim(),
            Designation = dto.Designation.Trim(),
            JoinDate = dto.JoinDate,
            Status = string.IsNullOrWhiteSpace(dto.Status) ? EmployeeStatus.ACTIVE : dto.Status!,
            CreatedAt = DateTime.Now,   
            UpdatedAt = DateTime.Now
        };

        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();

        var resultDto = new EmployeeDto
        {
            Id = employee.Id,
            FirstName = employee.FirstName,
            LastName = employee.LastName,
            Email = employee.Email,
            Phone = employee.Phone,
            Department = employee.Department,
            Designation = employee.Designation,
            JoinDate = employee.JoinDate,
            Status = employee.Status,
            CreatedAt = employee.CreatedAt,
            UpdatedAt = employee.UpdatedAt
        };

        return Ok(ApiResponse<EmployeeDto>.Success(resultDto,"Employee Created"));
        //return CreatedAtAction(nameof(Get), new { id = employee.Id }, ApiResponse<EmployeeDto>.Success(resultDto, "Employee created."));
    }

}
