using LMS.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.Api.Data;

/// <summary>
/// Seeder otomatis untuk inisialisasi data awal (Admin, Guru, Siswa, Kelas, Mapel)
/// </summary>
public static class DbInitializer
{
    public static async Task InitializeAsync(LmsDbContext context)
    {
        // Pastikan database telah dibuat
        await context.Database.EnsureCreatedAsync();

        if (await context.Users.AnyAsync())
        {
            return; // Data sudah ada, tidak perlu di-seed ulang
        }

        // 1. Seed Kelas
        var kelas1A = new ClassRoom { Id = "cls-1a", Name = "Kelas 1A", GradeLevel = 1, AcademicYear = "2024/2025", Capacity = 30 };
        var kelas1B = new ClassRoom { Id = "cls-1b", Name = "Kelas 1B", GradeLevel = 1, AcademicYear = "2024/2025", Capacity = 30 };
        var kelas2A = new ClassRoom { Id = "cls-2a", Name = "Kelas 2A", GradeLevel = 2, AcademicYear = "2024/2025", Capacity = 30 };
        var kelas6A = new ClassRoom { Id = "cls-6a", Name = "Kelas 6A", GradeLevel = 6, AcademicYear = "2024/2025", Capacity = 28 };

        await context.Classes.AddRangeAsync(kelas1A, kelas1B, kelas2A, kelas6A);

        // 2. Seed Pengguna Utama
        var admin = new User
        {
            Id = "user-adm-1",
            Username = "admin",
            Name = "Ustadz H. Ahmad Fauzi, S.Pd.I",
            Role = UserRole.ADMIN,
            Email = "admin@mi-assuyutiyah.sch.id",
            Nip = "198005122008011002"
        };

        var guru1 = new User
        {
            Id = "user-tchr-1",
            Username = "guru",
            Name = "Ustadzah Siti Aminah, S.Pd.I",
            Role = UserRole.GURU,
            Email = "siti.aminah@mi-assuyutiyah.sch.id",
            Nip = "198503202012022005"
        };

        var siswa1 = new User
        {
            Id = "user-std-1",
            Username = "siswa",
            Name = "Muhammad Rayyan Al-Ghifari",
            Role = UserRole.SISWA,
            Email = "siswa_kelas1a_1@student.mi-assuyutiyah.sch.id",
            Nisn = "0158921101",
            ClassId = kelas1A.Id
        };

        var siswa2 = new User
        {
            Id = "user-std-2",
            Username = "siswa2",
            Name = "Aisyah Humaira Putri",
            Role = UserRole.SISWA,
            Email = "siswa_kelas1a_2@student.mi-assuyutiyah.sch.id",
            Nisn = "0158921102",
            ClassId = kelas1A.Id
        };

        await context.Users.AddRangeAsync(admin, guru1, siswa1, siswa2);

        // Tetapkan wali kelas
        kelas1A.HomeroomTeacherId = guru1.Id;

        // 3. Seed Mata Pelajaran Khas Madrasah
        var mapelList = new List<Subject>
        {
            new() { Id = "sub-1", Code = "QH-01", Name = "Al-Qur'an Hadits", Category = "PAI", Kkm = 75 },
            new() { Id = "sub-2", Code = "AA-01", Name = "Akidah Akhlak", Category = "PAI", Kkm = 75 },
            new() { Id = "sub-3", Code = "FK-01", Name = "Fikih Ibadah", Category = "PAI", Kkm = 75 },
            new() { Id = "sub-4", Code = "SKI-01", Name = "Sejarah Kebudayaan Islam", Category = "PAI", Kkm = 72 },
            new() { Id = "sub-5", Code = "ARB-01", Name = "Bahasa Arab", Category = "PAI", Kkm = 70 },
            new() { Id = "sub-6", Code = "MAT-01", Name = "Matematika", Category = "UMUM", Kkm = 70 },
            new() { Id = "sub-7", Code = "IND-01", Name = "Bahasa Indonesia", Category = "UMUM", Kkm = 75 }
        };

        await context.Subjects.AddRangeAsync(mapelList);

        // 4. Seed Tagihan SPP Awal
        var invoice1 = new FinanceInvoice
        {
            Id = "inv-001",
            StudentId = siswa1.Id,
            Title = "SPP Madrasah Bulan Oktober 2024",
            Amount = 150000m,
            AmountPaid = 150000m,
            Status = PaymentStatus.LUNAS,
            DueDate = DateTime.Today.AddDays(10),
            PaidAt = DateTime.Today,
            PaymentMethod = "BSI Virtual Account"
        };

        var invoice2 = new FinanceInvoice
        {
            Id = "inv-002",
            StudentId = siswa1.Id,
            Title = "SPP Madrasah Bulan November 2024",
            Amount = 150000m,
            AmountPaid = 0m,
            Status = PaymentStatus.BELUM_LUNAS,
            DueDate = DateTime.Today.AddDays(30)
        };

        await context.FinanceInvoices.AddRangeAsync(invoice1, invoice2);

        // 5. Seed Pengumuman
        var pengumuman = new Announcement
        {
            Id = "ann-1",
            Title = "Pelaksanaan Penilaian Tengah Semester (PTS) Ganjil 1446 H",
            Content = "Diberitahukan kepada seluruh wali santri dan asatidz bahwa PTS Ganjil akan dimulai pekan depan.",
            Category = "AKADEMIK",
            Author = "Humas MI Assuyutiyah",
            IsPinned = true
        };

        await context.Announcements.AddAsync(pengumuman);

        await context.SaveChangesAsync();
    }
}
