using LMS.Api.Data;
using LMS.Api.DTOs;
using LMS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class GradesController : ControllerBase
{
    private readonly LmsDbContext _context;

    public GradesController(LmsDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Mengambil rekap nilai siswa (Rapor Kemenag)
    /// </summary>
    [HttpGet("student/{studentId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AcademicGrade>>>> GetGradesByStudent(string studentId, [FromQuery] string semester = "Ganjil")
    {
        var grades = await _context.AcademicGrades
            .Include(g => g.Subject)
            .Where(g => g.StudentId == studentId && g.Semester == semester)
            .OrderBy(g => g.Subject != null ? g.Subject.Name : "")
            .ToListAsync();

        return Ok(new ApiResponse<IEnumerable<AcademicGrade>>(true, "Data nilai rapor siswa berhasil dimuat", grades));
    }

    /// <summary>
    /// Input / update nilai harian, UTS, dan UAS oleh Ustadz/Ustadzah
    /// </summary>
    [HttpPost("input")]
    public async Task<ActionResult<ApiResponse<AcademicGrade>>> InputGrade([FromBody] InputGradeDto dto)
    {
        // Hitung nilai akhir: 40% Tugas + 30% UTS + 30% UAS
        var finalGrade = (dto.AssignmentScore * 0.40m) + (dto.MidtermScore * 0.30m) + (dto.FinalScore * 0.30m);
        var predicate = finalGrade >= 88 ? "A" : finalGrade >= 78 ? "B" : finalGrade >= 65 ? "C" : "D";

        var existingGrade = await _context.AcademicGrades
            .FirstOrDefaultAsync(g => g.StudentId == dto.StudentId && g.SubjectId == dto.SubjectId && g.Semester == dto.Semester);

        if (existingGrade != null)
        {
            existingGrade.AssignmentScore = dto.AssignmentScore;
            existingGrade.MidtermScore = dto.MidtermScore;
            existingGrade.FinalScore = dto.FinalScore;
            existingGrade.FinalGrade = finalGrade;
            existingGrade.Predicate = predicate;
            existingGrade.TeacherFeedback = dto.TeacherFeedback;
        }
        else
        {
            existingGrade = new AcademicGrade
            {
                Id = $"grd-{Guid.NewGuid():N}"[..16],
                StudentId = dto.StudentId,
                SubjectId = dto.SubjectId,
                Semester = dto.Semester,
                AcademicYear = dto.AcademicYear,
                AssignmentScore = dto.AssignmentScore,
                MidtermScore = dto.MidtermScore,
                FinalScore = dto.FinalScore,
                FinalGrade = finalGrade,
                Predicate = predicate,
                TeacherFeedback = dto.TeacherFeedback
            };
            await _context.AcademicGrades.AddAsync(existingGrade);
        }

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<AcademicGrade>(true, "Nilai santri berhasil disimpan ke sistem rapor", existingGrade));
    }
}
