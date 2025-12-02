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


    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var employees = await _db.Employees
            .OrderBy(e => e.CreatedAt)
            .ToListAsync();

        var result = employees.Select(e => new EmployeeDto
        {
            Id = e.Id,
            FirstName = e.FirstName,
            LastName = e.LastName,
            Email = e.Email,
            Phone = e.Phone,
            Department = e.Department,
            Designation = e.Designation,
            JoinDate = e.JoinDate,
            Status = e.Status,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        }).ToList();

        return Ok(ApiResponse<List<EmployeeDto>>.Success(result, "Employees fetched successfully."));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            return BadRequest(ApiResponse<string>.Fail("Id is required."));

        var employee = await _db.Employees.FirstOrDefaultAsync(e => e.Id == id);
        if (employee == null)
            return NotFound(ApiResponse<string>.Fail("Employee not found."));

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

        return Ok(ApiResponse<EmployeeDto>.Success(resultDto, "Employee fetched successfully."));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] EmployeeUpdateDto dto)
    {
        if (string.IsNullOrWhiteSpace(id))
            return BadRequest(ApiResponse<string>.Fail("Employee ID is required."));

        if (!ModelState.IsValid)
            return BadRequest(ApiResponse<string>.Fail("Invalid payload."));

        var employee = await _db.Employees.FirstOrDefaultAsync(e => e.Id == id);
        if (employee == null)
            return NotFound(ApiResponse<string>.Fail("Employee not found."));

        var emailLower = dto.Email?.Trim().ToLower();
        if (!string.IsNullOrWhiteSpace(emailLower))
        {
            var exists = await _db.Employees
                .AnyAsync(x => x.Email.ToLower() == emailLower && x.Id != id);
            if (exists)
                return Conflict(ApiResponse<string>.Fail("Email already in use."));
        }

        employee.FirstName = string.IsNullOrWhiteSpace(dto.FirstName) ? employee.FirstName : dto.FirstName.Trim();
        employee.LastName = string.IsNullOrWhiteSpace(dto.LastName) ? employee.LastName : dto.LastName.Trim();
        employee.Email = string.IsNullOrWhiteSpace(dto.Email) ? employee.Email : dto.Email.Trim();
        employee.Phone = string.IsNullOrWhiteSpace(dto.Phone) ? employee.Phone : dto.Phone.Trim();
        employee.Department = string.IsNullOrWhiteSpace(dto.Department) ? employee.Department : dto.Department.Trim();
        employee.Designation = string.IsNullOrWhiteSpace(dto.Designation) ? employee.Designation : dto.Designation.Trim();
        employee.JoinDate = dto.JoinDate ?? employee.JoinDate;
        employee.Status = string.IsNullOrWhiteSpace(dto.Status) ? employee.Status : dto.Status!;
        employee.UpdatedAt = DateTime.Now;

        _db.Employees.Update(employee);
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

        return Ok(ApiResponse<EmployeeDto>.Success(resultDto, "Employee updated successfully."));
    }


    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            return BadRequest(ApiResponse<bool>.Fail("Employee ID is required."));

        var employee = await _db.Employees.FirstOrDefaultAsync(e => e.Id == id);

        if (employee == null)
            return NotFound(ApiResponse<bool>.Fail("Employee not found."));

        _db.Employees.Remove(employee);
        await _db.SaveChangesAsync();

        return Ok(ApiResponse<bool>.Success(true, "Employee deleted successfully."));
    }

}
