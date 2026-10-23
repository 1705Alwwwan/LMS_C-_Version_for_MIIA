# LMS Madrasah Ibtidaiyah Assuyutiyah — ASP.NET Core 8 Web API (C#)

Proyek ini adalah implementasi backend lengkap menggunakan **C# dan ASP.NET Core 8** untuk Sistem Informasi & LMS Madrasah Ibtidaiyah Assuyutiyah. Solusi ini dirancang khusus sebagai bahan pembelajaran arsitektur enterprise modern berbasis C# dan .NET.

---

## 🎯 Mengapa Proyek Ini Sangat Cocok untuk Pembelajaran C# & ASP.NET?

1. **Clean Architecture & Separation of Concerns**:
   - `Models/`: Domain Entities dengan Data Annotations & Relasi Relasional.
   - `Data/`: `LmsDbContext` berbasis **Entity Framework Core (EF Core)** dengan Fluent API.
   - `DTOs/`: Pemisahan model database internal dan payload transfer data JSON.
   - `Controllers/`: RESTful Controller berbasis `[ApiController]` dan `[Route]`.
2. **Entity Framework Core & SQLite**:
   - Otomatis membuat database lokal `lms_assuyutiyah.db` tanpa perlu setup SQL Server yang berat.
   - Dilengkapi `DbInitializer` otomatis untuk seeding data akun guru, santri, mapel keagamaan (Al-Qur'an Hadits, Fiqih, Bahasa Arab), dan tagihan SPP.
3. **Fitur Modern .NET 8 & C# 12**:
   - `record` types untuk DTOs immutable.
   - `Top-Level Statements` & `Minimal API` endpoints di `Program.cs`.
   - Dependency Injection (`builder.Services.AddDbContext`, `AddControllers`).
   - Swagger / OpenAPI UI interaktif untuk testing langsung di browser.

---

## 🚀 Panduan Menjalankan di Komputer Lokal

### 1. Prasyarat
- Download & Install **.NET 8.0 SDK** atau **.NET 9.0 SDK**:
  👉 [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download)
- Editor yang direkomendasikan:
  - **Visual Studio 2022** (pilih workload "ASP.NET and web development"), ATAU
  - **VS Code** dengan ekstensi **C# Dev Kit**.

### 2. Membuka Solusi
- Jika menggunakan Visual Studio: Cukup double-click file `LMSAssuyutiyah.sln`.
- Jika menggunakan VS Code atau Terminal: Buka folder `aspnet-solution`.

### 3. Menjalankan Server API via Terminal
Buka PowerShell atau Command Prompt pada direktori `aspnet-solution`:

```bash
# Pindah ke direktori proyek API
cd src/LMS.Api

# Restore package NuGet & jalankan server
dotnet restore
dotnet run
```

Setelah server aktif, Anda akan melihat output:
```text
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: http://localhost:5000
      Now listening on: https://localhost:5001
```

### 4. Membuka Dokumentasi Interaktif (Swagger UI)
Buka browser dan kunjungi:
👉 **`http://localhost:5000/swagger`**

Anda dapat langsung mencoba semua endpoint:
- `POST /api/auth/login` (Login admin / guru / siswa)
- `GET /api/students` (Daftar santri per kelas)
- `GET /api/grades/student/{studentId}` (Rapor Kemenag)
- `POST /api/attendance/record` (Presensi harian)
- `GET /api/finance/invoices` (Manajemen SPP)

---

## 📚 Peta Perbandingan: Express.js (Node.js) vs ASP.NET Core 8 (C#)

| Fitur | Express.js / TypeScript | ASP.NET Core 8 (C#) |
|---|---|---|
| **Entry Point** | `server.ts` | `Program.cs` |
| **Dependency Injection** | Manual / Awilix | Native `builder.Services.AddScoped<>()` |
| **Database ORM** | Prisma / Drizzle / Mongoose | **Entity Framework Core (EF Core)** |
| **Routing** | `router.get('/students', fn)` | `[HttpGet] public async Task<IActionResult> Get()` |
| **Type Safety** | TypeScript (compile-time) | C# Strict Static Typing (runtime & compile-time) |
| **Validasi Input** | Zod / Joi | `[Required]`, `[Range]`, `[EmailAddress]` DataAnnotations |
| **Dokumentasi API** | Swagger UI Express manual | Swashbuckle OpenAPI Otomatis |

---

## 📁 Struktur Direktori

```text
aspnet-solution/
├── LMSAssuyutiyah.sln         # Solution file Visual Studio
└── src/
    └── LMS.Api/
        ├── LMS.Api.csproj      # File konfigurasi NuGet & Framework .NET 8
        ├── Program.cs          # Pipeline HTTP, CORS, DI, & Middleware
        ├── appsettings.json    # Konfigurasi koneksi database & JWT
        ├── Models/
        │   └── Entities.cs     # Model User, ClassRoom, Subject, Grade, dll.
        ├── Data/
        │   ├── LmsDbContext.cs # EF Core DbContext & Relasi Fluent API
        │   └── DbInitializer.cs# Otomatisasi Seeding Data Awal
        ├── DTOs/
        │   └── ApiDtos.cs      # Data Transfer Objects & Request/Response records
        └── Controllers/
            ├── AuthController.cs
            ├── StudentsController.cs
            ├── GradesController.cs
            ├── AttendanceController.cs
            └── FinanceController.cs
```
