using LMS.Api.Data;
using LMS.Api.DTOs;
using LMS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly LmsDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthController(LmsDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    /// <summary>
    /// Otentikasi pengguna (Admin, Guru, Siswa)
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<LoginResponseDto>>> Login([FromBody] LoginRequestDto request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new ApiResponse<object>(false, "Data login tidak lengkap", ModelState));
        }

        var user = await _context.Users
            .Include(u => u.AssignedClass)
            .FirstOrDefaultAsync(u => u.Username.ToLower() == request.Username.Trim().ToLower());

        if (user == null)
        {
            return Unauthorized(new ApiResponse<object>(false, "Nama pengguna atau kata sandi salah."));
        }

        // Demo password check: untuk madrasah, password default sama dengan username atau "123456"
        if (request.Password != "123456" && request.Password != user.Username)
        {
            return Unauthorized(new ApiResponse<object>(false, "Kata sandi yang Anda masukkan tidak valid."));
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var userDto = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Name = user.Name,
            Role = user.Role.ToString(),
            Email = user.Email,
            Nisn = user.Nisn,
            Nip = user.Nip,
            ClassId = user.ClassId,
            ClassName = user.AssignedClass?.Name
        };

        var response = new LoginResponseDto
        {
            Token = $"demo-jwt-token-{Guid.NewGuid():N}",
            User = userDto
        };

        return Ok(new ApiResponse<LoginResponseDto>(true, $"Ahlan wa Sahlan, {user.Name}!", response));
    }

    /// <summary>
    /// Mendapatkan profil akun yang sedang login
    /// </summary>
    [HttpGet("me")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetCurrentUser([FromQuery] string userId)
    {
        var user = await _context.Users
            .Include(u => u.AssignedClass)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return NotFound(new ApiResponse<object>(false, "Pengguna tidak ditemukan."));
        }

        var dto = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Name = user.Name,
            Role = user.Role.ToString(),
            Email = user.Email,
            Nisn = user.Nisn,
            Nip = user.Nip,
            ClassId = user.ClassId,
            ClassName = user.AssignedClass?.Name
        };

        return Ok(new ApiResponse<UserDto>(true, "Data profil berhasil diambil", dto));
    }
}
