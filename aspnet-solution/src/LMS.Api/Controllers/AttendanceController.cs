using LMS.Api.Data;
using LMS.Api.DTOs;
using LMS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class AttendanceController : ControllerBase
{
    private readonly LmsDbContext _context;

    public AttendanceController(LmsDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Mengambil absensi harian per kelas
    /// </summary>
    [HttpGet("class/{classId}")]
    public async Task<ActionResult<ApiResponse<IEnumerable<AttendanceRecord>>>> GetAttendanceByClass(
        string classId,
        [FromQuery] DateTime? date)
    {
        var targetDate = (date ?? DateTime.Today).Date;

        var records = await _context.AttendanceRecords
            .Include(a => a.Student)
            .Where(a => a.ClassId == classId && a.Date.Date == targetDate)
            .ToListAsync();

        return Ok(new ApiResponse<IEnumerable<AttendanceRecord>>(true, $"Data absensi tanggal {targetDate:yyyy-MM-dd}", records));
    }

    /// <summary>
    /// Mencatat atau mengupdate presensi santri
    /// </summary>
    [HttpPost("record")]
    public async Task<ActionResult<ApiResponse<AttendanceRecord>>> RecordAttendance([FromBody] RecordAttendanceDto dto)
    {
        var date = (dto.Date ?? DateTime.Today).Date;

        var record = await _context.AttendanceRecords
            .FirstOrDefaultAsync(a => a.StudentId == dto.StudentId && a.Date.Date == date);

        if (record != null)
        {
            record.Status = dto.Status;
            record.Notes = dto.Notes;
        }
        else
        {
            record = new AttendanceRecord
            {
                Id = $"att-{Guid.NewGuid():N}"[..16],
                StudentId = dto.StudentId,
                ClassId = dto.ClassId,
                Date = date,
                Status = dto.Status,
                Notes = dto.Notes
            };
            await _context.AttendanceRecords.AddAsync(record);
        }

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<AttendanceRecord>(true, "Presensi santri berhasil dicatat", record));
    }
}
