using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Api.Models;

/// <summary>
/// Role pengguna dalam sistem madrasah
/// </summary>
public enum UserRole
{
    ADMIN,
    GURU,
    SISWA,
    ORANG_TUA
}

public enum AttendanceStatus
{
    HADIR,
    SAKIT,
    IZIN,
    ALFA
}

public enum PaymentStatus
{
    LUNAS,
    BELUM_LUNAS,
    SEBAGIAN
}

/// <summary>
/// Entitas Pengguna (Admin, Ustadz/Ustadzah Guru, Santri/Siswa)
/// </summary>
[Table("Users")]
public class User
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required, MaxLength(100)]
    public string Username { get; set; } = string.Empty;

    [Required, MaxLength(150)]
    public string Name { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.SISWA;

    [EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    public string? Nisn { get; set; }
    public string? Nip { get; set; }
    public string? ClassId { get; set; }
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? AvatarUrl { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLoginAt { get; set; }

    // Navigation properties
    [ForeignKey(nameof(ClassId))]
    public virtual ClassRoom? AssignedClass { get; set; }

    public virtual ICollection<AttendanceRecord> Attendances { get; set; } = new List<AttendanceRecord>();
    public virtual ICollection<AcademicGrade> Grades { get; set; } = new List<AcademicGrade>();
    public virtual ICollection<FinanceInvoice> Invoices { get; set; } = new List<FinanceInvoice>();
    public virtual ICollection<MutabaahRecord> MutabaahRecords { get; set; } = new List<MutabaahRecord>();
}

/// <summary>
/// Entitas Kelas Madrasah (Contoh: Kelas 1A, 2B, 6A)
/// </summary>
[Table("Classes")]
public class ClassRoom
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required, MaxLength(50)]
    public string Name { get; set; } = string.Empty; // e.g. "Kelas 1A"

    public int GradeLevel { get; set; } // 1 - 6
    public string? AcademicYear { get; set; } = "2024/2025";
    public string? HomeroomTeacherId { get; set; } // Wali Kelas

    public int Capacity { get; set; } = 30;

    // Navigation properties
    [ForeignKey(nameof(HomeroomTeacherId))]
    public virtual User? HomeroomTeacher { get; set; }
    public virtual ICollection<User> Students { get; set; } = new List<User>();
}

/// <summary>
/// Mata Pelajaran (Kemenag & Umum)
/// </summary>
[Table("Subjects")]
public class Subject
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty; // e.g. "Al-Qur'an Hadits", "Akidah Akhlak", "Bahasa Arab"

    [Required, MaxLength(20)]
    public string Code { get; set; } = string.Empty; // e.g. "QH-01", "AA-01"

    public string Category { get; set; } = "PAI"; // PAI, UMUM, MULOK
    public int Kkm { get; set; } = 75; // Kriteria Ketuntasan Minimal
}

/// <summary>
/// Presensi / Absensi Siswa Harian
/// </summary>
[Table("AttendanceRecords")]
public class AttendanceRecord
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    public string ClassId { get; set; } = string.Empty;

    public DateTime Date { get; set; } = DateTime.Today;
    public AttendanceStatus Status { get; set; } = AttendanceStatus.HADIR;
    public string? Notes { get; set; }

    [ForeignKey(nameof(StudentId))]
    public virtual User? Student { get; set; }

    [ForeignKey(nameof(ClassId))]
    public virtual ClassRoom? Class { get; set; }
}

/// <summary>
/// Nilai Akademik Siswa (Tugas, UTS, UAS, Nilai Akhir)
/// </summary>
[Table("AcademicGrades")]
public class AcademicGrade
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    public string SubjectId { get; set; } = string.Empty;

    public string Semester { get; set; } = "Ganjil"; // Ganjil / Genap
    public string AcademicYear { get; set; } = "2024/2025";

    public decimal AssignmentScore { get; set; } // Nilai Tugas / Harian
    public decimal MidtermScore { get; set; }    // UTS
    public decimal FinalScore { get; set; }      // UAS
    public decimal FinalGrade { get; set; }      // Nilai Rapor Akhir (Kalkulasi)

    public string Predicate { get; set; } = "B"; // A, B, C, D
    public string? TeacherFeedback { get; set; }

    [ForeignKey(nameof(StudentId))]
    public virtual User? Student { get; set; }

    [ForeignKey(nameof(SubjectId))]
    public virtual Subject? Subject { get; set; }
}

/// <summary>
/// Keuangan / Tagihan SPP & Seragam
/// </summary>
[Table("FinanceInvoices")]
public class FinanceInvoice
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string Title { get; set; } = string.Empty; // e.g. "SPP Oktober 2024"

    public decimal Amount { get; set; }
    public decimal AmountPaid { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.BELUM_LUNAS;

    public DateTime DueDate { get; set; }
    public DateTime? PaidAt { get; set; }
    public string? PaymentMethod { get; set; } // Transfer BSI, Tunai, Virtual Account

    [ForeignKey(nameof(StudentId))]
    public virtual User? Student { get; set; }
}

/// <summary>
/// Mutabaah Yaumiyah (Catatan Ibadah & Karakter Santri Harian)
/// </summary>
[Table("MutabaahRecords")]
public class MutabaahRecord
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    public DateTime Date { get; set; } = DateTime.Today;

    // Sholat Wajib Berjamaah
    public bool Subuh { get; set; }
    public bool Dzuhur { get; set; }
    public bool Ashar { get; set; }
    public bool Maghrib { get; set; }
    public bool Isya { get; set; }

    // Sholat Sunnah & Ibadah
    public bool Dhuha { get; set; }
    public bool Tahajud { get; set; }
    public bool TadarusQuran { get; set; }
    public string? SuratDanAyat { get; set; }
    public bool PuasaSunnah { get; set; }
    public bool Sedekah { get; set; }

    // Adab & Karakter
    public bool BerbaktiOrangTua { get; set; }
    public string? CatatanUstadz { get; set; }

    [ForeignKey(nameof(StudentId))]
    public virtual User? Student { get; set; }
}

/// <summary>
/// Pengumuman & Agenda Madrasah
/// </summary>
[Table("Announcements")]
public class Announcement
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    public string Category { get; set; } = "UMUM"; // AKADEMIK, KEGIATAN, LIBUR, ISLAMI
    public DateTime PublishedDate { get; set; } = DateTime.UtcNow;
    public string? Author { get; set; }
    public bool IsPinned { get; set; }
}
