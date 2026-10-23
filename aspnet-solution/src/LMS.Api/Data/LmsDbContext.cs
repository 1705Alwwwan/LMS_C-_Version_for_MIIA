using LMS.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.Api.Data;

/// <summary>
/// Entity Framework Core DbContext untuk LMS MI Assuyutiyah
/// </summary>
public class LmsDbContext : DbContext
{
    public LmsDbContext(DbContextOptions<LmsDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<ClassRoom> Classes => Set<ClassRoom>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<AttendanceRecord> AttendanceRecords => Set<AttendanceRecord>();
    public DbSet<AcademicGrade> AcademicGrades => Set<AcademicGrade>();
    public DbSet<FinanceInvoice> FinanceInvoices => Set<FinanceInvoice>();
    public DbSet<MutabaahRecord> MutabaahRecords => Set<MutabaahRecord>();
    public DbSet<Announcement> Announcements => Set<Announcement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Enum conversions to String for human-readable database storage
        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<string>();

        modelBuilder.Entity<AttendanceRecord>()
            .Property(a => a.Status)
            .HasConversion<string>();

        modelBuilder.Entity<FinanceInvoice>()
            .Property(f => f.Status)
            .HasConversion<string>();

        // Indexes for high performance querying
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Role);

        modelBuilder.Entity<AttendanceRecord>()
            .HasIndex(a => new { a.StudentId, a.Date });

        modelBuilder.Entity<AcademicGrade>()
            .HasIndex(g => new { g.StudentId, g.SubjectId, g.Semester, g.AcademicYear });

        // Configure One-to-Many and Many-to-One Relationships
        modelBuilder.Entity<ClassRoom>()
            .HasOne(c => c.HomeroomTeacher)
            .WithMany()
            .HasForeignKey(c => c.HomeroomTeacherId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<User>()
            .HasOne(u => u.AssignedClass)
            .WithMany(c => c.Students)
            .HasForeignKey(u => u.ClassId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<AttendanceRecord>()
            .HasOne(a => a.Student)
            .WithMany(u => u.Attendances)
            .HasForeignKey(a => a.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AcademicGrade>()
            .HasOne(g => g.Student)
            .WithMany(u => u.Grades)
            .HasForeignKey(g => g.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<AcademicGrade>()
            .HasOne(g => g.Subject)
            .WithMany()
            .HasForeignKey(g => g.SubjectId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<FinanceInvoice>()
            .HasOne(f => f.Student)
            .WithMany(u => u.Invoices)
            .HasForeignKey(f => f.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MutabaahRecord>()
            .HasOne(m => m.Student)
            .WithMany(u => u.MutabaahRecords)
            .HasForeignKey(m => m.StudentId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
