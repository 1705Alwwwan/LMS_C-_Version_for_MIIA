using System.ComponentModel.DataAnnotations;
using LMS.Api.Models;

namespace LMS.Api.DTOs;

public record ApiResponse<T>(
    bool Success,
    string Message,
    T? Data = default,
    object? Meta = null,
    string? Timestamp = null
)
{
    public string Timestamp { get; init; } = DateTime.UtcNow.ToString("o");
}

public class LoginRequestDto
{
    [Required]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Nisn { get; set; }
    public string? Nip { get; set; }
    public string? ClassId { get; set; }
    public string? ClassName { get; set; }
}

public class CreateStudentDto
{
    [Required, MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Nisn { get; set; } = string.Empty;

    public string? Email { get; set; }
    public string? ClassId { get; set; }
    public string? PhoneNumber { get; set; }
}

public class RecordAttendanceDto
{
    [Required]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    public string ClassId { get; set; } = string.Empty;

    public AttendanceStatus Status { get; set; } = AttendanceStatus.HADIR;
    public string? Notes { get; set; }
    public DateTime? Date { get; set; }
}

public class InputGradeDto
{
    [Required]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    public string SubjectId { get; set; } = string.Empty;

    public string Semester { get; set; } = "Ganjil";
    public string AcademicYear { get; set; } = "2024/2025";

    [Range(0, 100)]
    public decimal AssignmentScore { get; set; }

    [Range(0, 100)]
    public decimal MidtermScore { get; set; }

    [Range(0, 100)]
    public decimal FinalScore { get; set; }

    public string? TeacherFeedback { get; set; }
}

public class MutabaahSubmissionDto
{
    [Required]
    public string StudentId { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.Today;

    public bool Subuh { get; set; }
    public bool Dzuhur { get; set; }
    public bool Ashar { get; set; }
    public bool Maghrib { get; set; }
    public bool Isya { get; set; }

    public bool Dhuha { get; set; }
    public bool TadarusQuran { get; set; }
    public string? SuratDanAyat { get; set; }
    public bool BerbaktiOrangTua { get; set; }
}
