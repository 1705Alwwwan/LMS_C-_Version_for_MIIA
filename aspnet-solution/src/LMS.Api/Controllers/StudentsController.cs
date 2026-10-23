using LMS.Api.Data;
using LMS.Api.DTOs;
using LMS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class StudentsController : ControllerBase
{
    private readonly LmsDbContext _context;

    public StudentsController(LmsDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Mengambil semua data siswa / santri madrasah
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserDto>>>> GetAllStudents([FromQuery] string? classId, [FromQuery] string? search)
    {
        var query = _context.Users
            .Include(u => u.AssignedClass)
            .Where(u => u.Role == UserRole.SISWA);

        if (!string.IsNullOrWhiteSpace(classId))
        {
            query = query.Where(u => u.ClassId == classId);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(u => u.Name.ToLower().Contains(s) || (u.Nisn != null && u.Nisn.Contains(s)));
        }

        var students = await query
            .OrderBy(u => u.Name)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Name = u.Name,
                Role = u.Role.ToString(),
                Email = u.Email,
                Nisn = u.Nisn,
                ClassId = u.ClassId,
                ClassName = u.AssignedClass != null ? u.AssignedClass.Name : null
            })
            .ToListAsync();

        return Ok(new ApiResponse<IEnumerable<UserDto>>(true, "Daftar siswa berhasil diambil", students));
    }

    /// <summary>
    /// Mengambil data detail santri berdasarkan ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetStudentById(string id)
    {
        var student = await _context.Users
            .Include(u => u.AssignedClass)
            .FirstOrDefaultAsync(u => u.Id == id && u.Role == UserRole.SISWA);

        if (student == null)
        {
            return NotFound(new ApiResponse<object>(false, "Data siswa tidak ditemukan"));
        }

        var dto = new UserDto
        {
            Id = student.Id,
            Username = student.Username,
            Name = student.Name,
            Role = student.Role.ToString(),
            Email = student.Email,
            Nisn = student.Nisn,
            ClassId = student.ClassId,
            ClassName = student.AssignedClass?.Name
        };

        return Ok(new ApiResponse<UserDto>(true, "Detail data siswa ditemukan", dto));
    }

    /// <summary>
    /// Mendaftarkan santri / siswa baru
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ApiResponse<UserDto>>> CreateStudent([FromBody] CreateStudentDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Username.ToLower() == dto.Username.ToLower()))
        {
            return Conflict(new ApiResponse<object>(false, "Username telah digunakan oleh akun lain."));
        }

        var student = new User
        {
            Id = $"user-std-{Guid.NewGuid():N}"[..16],
            Username = dto.Username.Trim().ToLower(),
            Name = dto.Name.Trim(),
            Role = UserRole.SISWA,
            Email = dto.Email ?? $"{dto.Username}@student.mi-assuyutiyah.sch.id",
            Nisn = dto.Nisn,
            ClassId = dto.ClassId,
            PhoneNumber = dto.PhoneNumber,
            CreatedAt = DateTime.UtcNow
        };

        await _context.Users.AddAsync(student);
        await _context.SaveChangesAsync();

        var resultDto = new UserDto
        {
            Id = student.Id,
            Username = student.Username,
            Name = student.Name,
            Role = student.Role.ToString(),
            Email = student.Email,
            Nisn = student.Nisn,
            ClassId = student.ClassId
        };

        return CreatedAtAction(nameof(GetStudentById), new { id = student.Id }, new ApiResponse<UserDto>(true, "Siswa berhasil didaftarkan", resultDto));
    }
}
