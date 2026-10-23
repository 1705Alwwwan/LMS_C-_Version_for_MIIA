import React, { useState } from 'react';
import {
  Code2,
  Database,
  Layers,
  Terminal,
  Copy,
  Check,
  FileCode,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  FolderTree,
  Cpu,
  Boxes,
  Zap,
} from 'lucide-react';

interface CodeSnippet {
  id: string;
  title: string;
  filename: string;
  category: string;
  description: string;
  code: string;
}

const CSHARP_CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'program',
    title: 'Program.cs — Entry Point & Pipeline',
    filename: 'src/LMS.Api/Program.cs',
    category: 'Pipeline & DI',
    description: 'Konfigurasi Dependency Injection, EF Core SQLite, CORS, dan Swagger UI pada .NET 8.',
    code: `using System.Text.Json.Serialization;
using LMS.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. DEPENDENCY INJECTION CONTAINER
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Serialisasi Enum C# menjadi String ramah JSON
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Daftarkan Entity Framework Core DbContext dengan SQLite
builder.Services.AddDbContext<LmsDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                           ?? "Data Source=lms_assuyutiyah.db";
    options.UseSqlite(connectionString);
});

// Daftarkan Swagger OpenAPI untuk dokumentasi interaktif
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "LMS Assuyutiyah API", Version = "v1" });
});

var app = builder.Build();

// 2. HTTP MIDDLEWARE PIPELINE
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
app.UseAuthorization();
app.MapControllers();

// 3. AUTO DATABASE SEEDING
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<LmsDbContext>();
    await DbInitializer.InitializeAsync(context);
}

app.Run();`,
  },
  {
    id: 'entities',
    title: 'Entities.cs — Domain Models & DataAnnotations',
    filename: 'src/LMS.Api/Models/Entities.cs',
    category: 'Data Models',
    description: 'Definisi class User, ClassRoom, Subject, dan AcademicGrade dengan validasi DataAnnotations.',
    code: `using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.Api.Models;

public enum UserRole { ADMIN, GURU, SISWA, ORANG_TUA }
public enum AttendanceStatus { HADIR, SAKIT, IZIN, ALFA }

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

    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? Nisn { get; set; }
    public string? Nip { get; set; }
    public string? ClassId { get; set; }

    // Navigation property (Relasi ke Kelas)
    [ForeignKey(nameof(ClassId))]
    public virtual ClassRoom? AssignedClass { get; set; }

    public virtual ICollection<AttendanceRecord> Attendances { get; set; } = new List<AttendanceRecord>();
    public virtual ICollection<AcademicGrade> Grades { get; set; } = new List<AcademicGrade>();
}

[Table("AcademicGrades")]
public class AcademicGrade
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Required]
    public string StudentId { get; set; } = string.Empty;

    [Required]
    public string SubjectId { get; set; } = string.Empty;

    public string Semester { get; set; } = "Ganjil";
    public decimal AssignmentScore { get; set; } // Nilai Tugas (40%)
    public decimal MidtermScore { get; set; }    // Nilai UTS (30%)
    public decimal FinalScore { get; set; }      // Nilai UAS (30%)
    public decimal FinalGrade { get; set; }      // Nilai Rapor Akhir

    public string Predicate { get; set; } = "B"; // Predikat Kemenag (A, B, C, D)

    [ForeignKey(nameof(StudentId))]
    public virtual User? Student { get; set; }
}`,
  },
  {
    id: 'dbcontext',
    title: 'LmsDbContext.cs — Entity Framework Core',
    filename: 'src/LMS.Api/Data/LmsDbContext.cs',
    category: 'Database & ORM',
    description: 'Konfigurasi Fluent API, indeks unik, relasi foreign key, dan enum string converter.',
    code: `using LMS.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LMS.Api.Data;

public class LmsDbContext : DbContext
{
    public LmsDbContext(DbContextOptions<LmsDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<ClassRoom> Classes => Set<ClassRoom>();
    public DbSet<Subject> Subjects => Set<Subject>();
    public DbSet<AttendanceRecord> AttendanceRecords => Set<AttendanceRecord>();
    public DbSet<AcademicGrade> AcademicGrades => Set<AcademicGrade>();
    public DbSet<FinanceInvoice> FinanceInvoices => Set<FinanceInvoice>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Simpan Enum sebagai String agar mudah dibaca di SQLite
        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasConversion<string>();

        // Indeks untuk pencarian cepat
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        // Relasi One-to-Many: 1 Kelas memiliki banyak Santri
        modelBuilder.Entity<User>()
            .HasOne(u => u.AssignedClass)
            .WithMany(c => c.Students)
            .HasForeignKey(u => u.ClassId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}`,
  },
  {
    id: 'students_controller',
    title: 'StudentsController.cs — REST API & LINQ',
    filename: 'src/LMS.Api/Controllers/StudentsController.cs',
    category: 'Controllers & LINQ',
    description: 'Implementasi async Task<IActionResult>, eager loading dengan .Include(), dan filtering LINQ.',
    code: `using LMS.Api.Data;
using LMS.Api.DTOs;
using LMS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly LmsDbContext _context;

    // Dependency Injection DbContext melalui constructor
    public StudentsController(LmsDbContext context)
    {
        _context = context;
    }

    // GET: api/students?classId=cls-1a&search=rayyan
    [HttpGet]
    public async Task<ActionResult<ApiResponse<IEnumerable<UserDto>>>> GetAll(
        [FromQuery] string? classId, 
        [FromQuery] string? search)
    {
        // 1. Bangun query LINQ (IQueryable belum dieksekusi ke database)
        var query = _context.Users
            .Include(u => u.AssignedClass)
            .Where(u => u.Role == UserRole.SISWA);

        // 2. Filter dinamis
        if (!string.IsNullOrWhiteSpace(classId))
        {
            query = query.Where(u => u.ClassId == classId);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(u => u.Name.ToLower().Contains(s) || u.Nisn!.Contains(s));
        }

        // 3. Proyeksikan ke DTO dan eksekusi query secara Asynchronous
        var result = await query
            .OrderBy(u => u.Name)
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Name = u.Name,
                Role = u.Role.ToString(),
                Email = u.Email,
                Nisn = u.Nisn,
                ClassName = u.AssignedClass != null ? u.AssignedClass.Name : null
            })
            .ToListAsync();

        return Ok(new ApiResponse<IEnumerable<UserDto>>(true, "Data siswa berhasil dimuat", result));
    }
}`,
  },
  {
    id: 'grades_controller',
    title: 'GradesController.cs — Kalkulasi Rapor Kemenag',
    filename: 'src/LMS.Api/Controllers/GradesController.cs',
    category: 'Business Logic',
    description: 'Kalkulasi bobot nilai (40% Tugas + 30% UTS + 30% UAS) dan penentuan predikat secara otomatis.',
    code: `[HttpPost("input")]
public async Task<ActionResult<ApiResponse<AcademicGrade>>> InputGrade([FromBody] InputGradeDto dto)
{
    // Rumus Pembobotan Madrasah
    var finalScore = (dto.AssignmentScore * 0.40m) + (dto.MidtermScore * 0.30m) + (dto.FinalScore * 0.30m);
    
    // Konversi Predikat Nilai Kemenag
    var predicate = finalScore >= 88 ? "A" :
                    finalScore >= 78 ? "B" :
                    finalScore >= 65 ? "C" : "D";

    var grade = await _context.AcademicGrades
        .FirstOrDefaultAsync(g => g.StudentId == dto.StudentId 
                               && g.SubjectId == dto.SubjectId 
                               && g.Semester == dto.Semester);

    if (grade != null)
    {
        grade.AssignmentScore = dto.AssignmentScore;
        grade.MidtermScore = dto.MidtermScore;
        grade.FinalScore = dto.FinalScore;
        grade.FinalGrade = finalScore;
        grade.Predicate = predicate;
    }
    else
    {
        grade = new AcademicGrade
        {
            StudentId = dto.StudentId,
            SubjectId = dto.SubjectId,
            Semester = dto.Semester,
            AssignmentScore = dto.AssignmentScore,
            MidtermScore = dto.MidtermScore,
            FinalScore = dto.FinalScore,
            FinalGrade = finalScore,
            Predicate = predicate
        };
        await _context.AcademicGrades.AddAsync(grade);
    }

    await _context.SaveChangesAsync();
    return Ok(new ApiResponse<AcademicGrade>(true, "Nilai rapor berhasil disimpan", grade));
}`,
  },
];

const COMPARISON_TABLE = [
  {
    concept: 'Bahasa & Paradigma',
    nodejs: 'JavaScript / TypeScript (Multi-paradigm, dynamic/gradual typing)',
    aspnet: 'C# 12 (Strongly-typed, OOP murni, modern pattern matching, records)',
  },
  {
    concept: 'Entry Point & Konfigurasi',
    nodejs: 'server.ts / app.js dengan Express middleware',
    aspnet: 'Program.cs dengan WebApplicationBuilder & Minimal APIs / Controllers',
  },
  {
    concept: 'Dependency Injection (DI)',
    nodejs: 'Tidak bawaan; memerlukan library tambahan (Inversify, Awilix)',
    aspnet: 'Native & Built-in (builder.Services.AddScoped, AddSingleton, AddTransient)',
  },
  {
    concept: 'Database ORM',
    nodejs: 'Prisma, Drizzle, atau TypeORM',
    aspnet: 'Entity Framework Core (EF Core) dengan LINQ queries & Migrations',
  },
  {
    concept: 'Routing & Controller',
    nodejs: "router.get('/students', async (req, res) => ...)",
    aspnet: '[ApiController] [Route("api/[controller]")] + public async Task<IActionResult>',
  },
  {
    concept: 'Validasi Input',
    nodejs: 'Library manual seperti Zod, Yup, atau Joi',
    aspnet: 'DataAnnotations otomatis ([Required], [EmailAddress], [Range(0, 100)])',
  },
  {
    concept: 'Package Manager',
    nodejs: 'npm / pnpm / yarn (package.json)',
    aspnet: 'NuGet (.csproj / dotnet add package)',
  },
  {
    concept: 'Dokumentasi API',
    nodejs: 'Swagger manual via swagger-ui-express',
    aspnet: 'Swashbuckle / Microsoft.AspNetCore.OpenApi otomatis terintegrasi',
  },
];

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Di ASP.NET Core 8, file manakah yang berfungsi sebagai titik masuk (entry point) aplikasi tempat kita mendaftarkan layanan Dependency Injection?',
    options: ['appsettings.json', 'Program.cs', 'LmsDbContext.cs', 'Startup.cs (hanya di .NET Core lama)'],
    correct: 1,
    explanation: 'Mulai dari .NET 6, 7, dan 8, ASP.NET Core menggunakan top-level statements di file Program.cs untuk mengonfigurasi Dependency Injection dan HTTP Middleware pipeline.',
  },
  {
    id: 2,
    question: 'ORM resmi dan paling populer untuk mengelola database relasional di ekosistem .NET adalah?',
    options: ['Mongoose', 'Dapper', 'Entity Framework Core (EF Core)', 'Sequelize'],
    correct: 2,
    explanation: 'Entity Framework Core (EF Core) adalah ORM resmi dari Microsoft yang mendukung LINQ, migrasi skema database, change tracking, dan multi-provider (SQLite, PostgreSQL, SQL Server).',
  },
  {
    id: 3,
    question: 'Metode ekstensi LINQ apakah yang digunakan untuk memuat data relasi (foreign key / eager loading) di EF Core?',
    options: ['.Join()', '.Include()', '.Populate()', '.EagerLoad()'],
    correct: 1,
    explanation: 'Metode .Include(u => u.AssignedClass) digunakan oleh EF Core untuk melakukan Eager Loading (LEFT JOIN) sehingga entitas berelasi langsung terisi.',
  },
  {
    id: 4,
    question: 'Lifecycle Dependency Injection manakah yang membuat instance baru untuk SETIAP HTTP request yang masuk?',
    options: ['AddSingleton', 'AddTransient', 'AddScoped', 'AddStatic'],
    correct: 2,
    explanation: 'AddScoped membuat 1 instance per HTTP request (sangat ideal untuk DbContext agar koneksi database ditutup begitu request selesai).',
  },
];

export const AspNetStudyCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'code' | 'comparison' | 'quiz' | 'localrun'>('overview');
  const [selectedSnippetId, setSelectedSnippetId] = useState<string>('program');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showQuizResults, setShowQuizResults] = useState(false);

  const selectedSnippet = CSHARP_CODE_SNIPPETS.find((s) => s.id === selectedSnippetId) || CSHARP_CODE_SNIPPETS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectAnswer = (questionId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) score += 1;
    });
    return score;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-semibold mb-3">
            <Code2 className="w-4 h-4 text-purple-300" />
            <span>Laboratorium Pembelajaran C# & ASP.NET Core 8</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Arsitektur Backend ASP.NET Core 8 (C#)
          </h1>
          <p className="mt-2 text-sm sm:text-base text-purple-200 max-w-3xl leading-relaxed">
            Selamat datang di modul panduan belajar C# dan ASP.NET Core untuk LMS MI Assuyutiyah.
            Seluruh berkas proyek .NET 8 lengkap telah digenerate pada direktori <code className="bg-purple-950/80 px-2 py-0.5 rounded text-amber-300 font-mono text-xs">/aspnet-solution</code> dan siap dijalankan dengan <code className="bg-purple-950/80 px-2 py-0.5 rounded text-emerald-300 font-mono text-xs">dotnet run</code>.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-lg text-xs font-medium text-slate-200">
              <Boxes className="w-3.5 h-3.5 text-purple-300" /> Target: .NET 8.0 Web API
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-lg text-xs font-medium text-slate-200">
              <Database className="w-3.5 h-3.5 text-emerald-300" /> ORM: Entity Framework Core
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-lg text-xs font-medium text-slate-200">
              <Cpu className="w-3.5 h-3.5 text-amber-300" /> SQLite In-Memory / File-based
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-lg text-xs font-medium text-slate-200">
              <Zap className="w-3.5 h-3.5 text-sky-300" /> OpenAPI / Swagger 3.0
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-1 sm:gap-2 bg-white p-1.5 rounded-xl shadow-xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Arsitektur & Konsep C#</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'code'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Penjelajah Kode Sumber C#</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'comparison'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Tabel Komparasi (Node vs C#)</span>
        </button>

        <button
          onClick={() => setActiveTab('localrun')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'localrun'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Panduan Menjalankan Lokal</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Kuis Pemahaman C#</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ARCHITECTURE */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Card: Mengapa Lingkungan Web AI Studio Tetap Menjalankan Node.js */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs sm:text-sm text-amber-900 flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-800 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-950 mb-1">Catatan Penting Lingkungan AI Studio Preview</h3>
              <p className="text-amber-800 leading-relaxed">
                Di lingkungan cloud Google AI Studio saat ini, container runtime didesain untuk <strong>Node.js 22</strong> (agar frontend SPA Vite React dapat melakukan live preview interaktif di peramban). SDK .NET CLI (<code>dotnet</code>) belum terpasang di container ini.
                Oleh karena itu, kami telah <strong>menuliskan seluruh berkas solusi ASP.NET Core 8 asli</strong> di dalam folder <code className="bg-amber-100 font-mono px-1 rounded">/aspnet-solution</code>, dan Anda dapat menelaah kodenya secara interaktif di halaman ini atau mendownload/menjalankannya di komputer lokal Anda dengan Visual Studio atau VS Code!
              </p>
            </div>
          </div>

          {/* Diagram Alur Arsitektur ASP.NET Core */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-purple-600" />
              <span>Siklus Hidup Permintaan (Request Lifecycle) ASP.NET Core 8</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">Langkah 1</span>
                <div className="w-10 h-10 mx-auto my-2 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  HTTP
                </div>
                <h4 className="font-bold text-xs text-slate-800">Klien / Browser</h4>
                <p className="text-[11px] text-slate-500 mt-1">Mengirimkan GET / POST request ke port 5000</p>
              </div>

              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">Langkah 2</span>
                <div className="w-10 h-10 mx-auto my-2 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  Pipe
                </div>
                <h4 className="font-bold text-xs text-slate-800">Middleware</h4>
                <p className="text-[11px] text-slate-500 mt-1">CORS, Swagger, Routing, dan Auth di Program.cs</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Langkah 3</span>
                <div className="w-10 h-10 mx-auto my-2 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  Ctrl
                </div>
                <h4 className="font-bold text-xs text-slate-800">ApiController</h4>
                <p className="text-[11px] text-slate-500 mt-1">Model Binding, Validasi DataAnnotations & DTO</p>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Langkah 4</span>
                <div className="w-10 h-10 mx-auto my-2 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  EF
                </div>
                <h4 className="font-bold text-xs text-slate-800">LmsDbContext</h4>
                <p className="text-[11px] text-slate-500 mt-1">Query LINQ (.Where, .Include, .ToListAsync)</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 block">Langkah 5</span>
                <div className="w-10 h-10 mx-auto my-2 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  DB
                </div>
                <h4 className="font-bold text-xs text-slate-800">SQLite Database</h4>
                <p className="text-[11px] text-slate-500 mt-1">Tabel Users, Classes, Grades, Invoices</p>
              </div>
            </div>
          </div>

          {/* 4 Pilar Konsep Utama C# */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <div className="p-1.5 bg-purple-100 text-purple-700 rounded-lg">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3>1. Dependency Injection (DI) Bawaan</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Di ASP.NET Core, controller tidak membuat instance database sendiri (<code>new LmsDbContext()</code>). Melainkan di-inject lewat constructor:
              </p>
              <pre className="mt-2 p-2.5 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto">
{`public class StudentsController : ControllerBase {
    private readonly LmsDbContext _context;
    public StudentsController(LmsDbContext context) {
        _context = context; // Otomatis disuntikkan oleh runtime .NET
    }
}`}
              </pre>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Database className="w-4 h-4" />
                </div>
                <h3>2. LINQ (Language Integrated Query)</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                C# memiliki fitur LINQ yang memungkinkan penulisan query database yang type-safe langsung di dalam sintaks bahasa C#:
              </p>
              <pre className="mt-2 p-2.5 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto">
{`var siswa = await _context.Users
    .Include(u => u.AssignedClass)
    .Where(u => u.Role == UserRole.SISWA && u.ClassId == "cls-1a")
    .OrderBy(u => u.Name)
    .ToListAsync();`}
              </pre>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3>3. Validasi Otomatis dengan DataAnnotations</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tanpa perlu library validasi tambahan, model C# didekorasi dengan attribute yang divalidasi otomatis oleh ASP.NET Core:
              </p>
              <pre className="mt-2 p-2.5 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto">
{`public class InputGradeDto {
    [Required] public string StudentId { get; set; }
    [Range(0, 100)] public decimal AssignmentScore { get; set; }
}`}
              </pre>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                <div className="p-1.5 bg-sky-100 text-sky-700 rounded-lg">
                  <Zap className="w-4 h-4" />
                </div>
                <h3>4. Asynchronous Task Programming</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Metode controller mengembalikan <code>Task&lt;ActionResult&lt;T&gt;&gt;</code> dengan keyword <code>async</code> dan <code>await</code> untuk penanganan request throughput tinggi tanpa memblokir thread threadpool:
              </p>
              <pre className="mt-2 p-2.5 bg-slate-900 text-slate-200 rounded-lg text-xs font-mono overflow-x-auto">
{`[HttpGet("{id}")]
public async Task<ActionResult<ApiResponse<UserDto>>> GetById(string id) {
    var student = await _context.Users.FindAsync(id);
    return Ok(new ApiResponse<UserDto>(true, "OK", student));
}`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CODE EXPLORER */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* File Selector Sidebar */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2">
              Berkas Solusi C# (.NET 8)
            </h3>
            <div className="space-y-1">
              {CSHARP_CODE_SNIPPETS.map((snippet) => (
                <button
                  key={snippet.id}
                  onClick={() => setSelectedSnippetId(snippet.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col ${
                    selectedSnippetId === snippet.id
                      ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs truncate">{snippet.title}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        selectedSnippetId === snippet.id ? 'bg-purple-700 text-purple-100' : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {snippet.category}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] mt-1 font-mono truncate ${
                      selectedSnippetId === snippet.id ? 'text-purple-200' : 'text-slate-400'
                    }`}
                  >
                    {snippet.filename}
                  </span>
                </button>
              ))}
            </div>

            {/* Folder Structure Overview */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mt-4">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2">
                <FolderTree className="w-3.5 h-3.5 text-purple-600" />
                <span>Struktur Lengkap Proyek</span>
              </h4>
              <pre className="text-[11px] font-mono text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
{`aspnet-solution/
├── LMSAssuyutiyah.sln
└── src/LMS.Api/
    ├── LMS.Api.csproj
    ├── Program.cs
    ├── appsettings.json
    ├── Models/Entities.cs
    ├── Data/LmsDbContext.cs
    ├── Data/DbInitializer.cs
    ├── DTOs/ApiDtos.cs
    └── Controllers/
        ├── AuthController.cs
        ├── StudentsController.cs
        ├── GradesController.cs
        ├── AttendanceController.cs
        └── FinanceController.cs`}
              </pre>
            </div>
          </div>

          {/* Code Viewer */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-purple-400 font-mono block">
                  {selectedSnippet.filename}
                </span>
                <span className="text-[11px] text-slate-400">
                  {selectedSnippet.description}
                </span>
              </div>
              <button
                onClick={() => handleCopy(selectedSnippet.code, selectedSnippet.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
                title="Salin Kode Sumber C#"
              >
                {copiedId === selectedSnippet.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Tersalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Kode</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 overflow-x-auto flex-1 max-h-[600px] overflow-y-auto">
              <pre className="text-xs font-mono text-purple-200 leading-relaxed">
                <code>{selectedSnippet.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPARISON TABLE */}
      {activeTab === 'comparison' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Boxes className="w-5 h-5 text-purple-600" />
              <span>Kamus Konversi (Rosetta Stone): TypeScript/Express vs C#/ASP.NET Core</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Panduan pemetaan sintaksis dan konsep bagi Anda yang sedang beralih dari Node.js ke C#.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-700 font-bold">
                <tr>
                  <th className="p-3.5 w-1/4">Konsep Pemrograman</th>
                  <th className="p-3.5 w-3/8 text-emerald-800 bg-emerald-50/40">Express.js / Node.js (TypeScript)</th>
                  <th className="p-3.5 w-3/8 text-purple-900 bg-purple-50/40">ASP.NET Core 8 (C#)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPARISON_TABLE.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-slate-800">{item.concept}</td>
                    <td className="p-3.5 text-slate-600 font-mono text-[11px] bg-emerald-50/10">
                      {item.nodejs}
                    </td>
                    <td className="p-3.5 text-purple-950 font-mono text-[11px] font-semibold bg-purple-50/15">
                      {item.aspnet}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LOCAL RUN GUIDE */}
      {activeTab === 'localrun' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Terminal className="w-5 h-5 text-purple-600" />
              <span>Cara Menjalankan Solusi C# di Komputer / Laptop Anda</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Ikuti 4 langkah mudah berikut untuk membuka dan menjalankan API di Visual Studio atau VS Code.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex gap-3.5">
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-900">Install .NET 8.0 SDK</h4>
                <p className="text-xs text-slate-600">
                  Unduh installer resmi .NET 8 SDK dari Microsoft di{' '}
                  <a
                    href="https://dotnet.microsoft.com/download"
                    target="_blank"
                    rel="noreferrer"
                    className="text-purple-600 underline font-semibold"
                  >
                    https://dotnet.microsoft.com/download
                  </a>
                  . Setelah terinstal, periksa di terminal dengan mengetikkan:
                </p>
                <pre className="bg-slate-900 text-purple-300 p-2 rounded text-xs font-mono">
                  dotnet --version
                </pre>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex gap-3.5">
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-900">Buka Folder Solusi</h4>
                <p className="text-xs text-slate-600">
                  Arahkan terminal ke folder <code className="bg-slate-200 px-1 rounded font-mono">aspnet-solution</code> hasil generate di repositori ini:
                </p>
                <pre className="bg-slate-900 text-purple-300 p-2 rounded text-xs font-mono">
                  cd aspnet-solution/src/LMS.Api
                </pre>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex gap-3.5">
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-900">Jalankan Web API</h4>
                <p className="text-xs text-slate-600">
                  Eksekusi perintah berikut untuk merestore package NuGet dan menjalankan server ASP.NET Core:
                </p>
                <pre className="bg-slate-900 text-emerald-300 p-2.5 rounded text-xs font-mono">
                  dotnet run
                </pre>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex gap-3.5">
              <div className="w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                4
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-xs text-slate-900">Uji Coba dengan Swagger UI di Browser</h4>
                <p className="text-xs text-slate-600">
                  Buka browser Anda dan navigasikan ke alamat:
                </p>
                <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 font-mono text-xs font-bold">
                  http://localhost:5000/swagger
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Database SQLite <code className="bg-slate-200 px-1 rounded">lms_assuyutiyah.db</code> akan dibuat otomatis beserta data akun guru, santri, dan tagihan SPP.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: QUIZ PEMAHAMAN */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-purple-600" />
                <span>Kuis Latihan Konsep C# & ASP.NET Core</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Uji pemahaman Anda mengenai sintaksis C#, Entity Framework Core, dan Dependency Injection.
              </p>
            </div>
            {showQuizResults && (
              <div className="px-4 py-2 bg-purple-100 border border-purple-300 rounded-xl text-purple-900 font-bold text-sm">
                Skor Anda: {calculateScore()} / {QUIZ_QUESTIONS.length}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {QUIZ_QUESTIONS.map((q, qIndex) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;

              return (
                <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {qIndex + 1}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                      {q.question}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                    {q.options.map((opt, optIndex) => {
                      const isSelected = selectedOpt === optIndex;
                      const isCorrect = q.correct === optIndex;

                      let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-purple-50';
                      if (showQuizResults) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'bg-rose-100 border-rose-300 text-rose-900';
                        }
                      } else if (isSelected) {
                        btnStyle = 'bg-purple-600 border-purple-600 text-white font-bold';
                      }

                      return (
                        <button
                          key={optIndex}
                          onClick={() => handleSelectAnswer(q.id, optIndex)}
                          className={`text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span className="font-mono font-bold mr-1.5">
                            {String.fromCharCode(65 + optIndex)}.
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showQuizResults && (
                    <div className="pl-8 pt-2">
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 leading-relaxed">
                        <span className="font-bold block mb-0.5">Penjelasan Solusi:</span>
                        {q.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              onClick={() => {
                setShowQuizResults(false);
                setSelectedAnswers({});
              }}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
            >
              Reset Jawaban
            </button>
            <button
              onClick={() => setShowQuizResults(true)}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-600/20 cursor-pointer"
            >
              Periksa Jawaban & Penjelasan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
