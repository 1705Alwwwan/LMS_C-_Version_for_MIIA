using System.Text.Json.Serialization;
using LMS.Api.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ==============================================================================
// 1. SERVICE CONFIGURATION (DEPENDENCY INJECTION)
// ==============================================================================

// Menambahkan controller dengan pengaturan JSON serialization untuk format Enum & camelCase
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Konfigurasi Entity Framework Core: SQLite untuk lokal & In-Memory untuk testing cepat
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") 
                       ?? "Data Source=lms_assuyutiyah.db";

builder.Services.AddDbContext<LmsDbContext>(options =>
{
    // Menggunakan SQLite (atau UseInMemoryDatabase jika tidak ingin menyimpan file lokal)
    options.UseSqlite(connectionString);
});

// Konfigurasi CORS agar frontend React / Vue / Mobile dapat mengakses API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Konfigurasi Swagger / OpenAPI Documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "LMS Madrasah Ibtidaiyah Assuyutiyah API",
        Version = "v1",
        Description = "Backend RESTful API ASP.NET Core 8 untuk Manajemen Akademik, Rapor Kemenag, dan Keuangan MI Assuyutiyah.",
        Contact = new OpenApiContact
        {
            Name = "Tim IT Madrasah Assuyutiyah",
            Email = "it@mi-assuyutiyah.sch.id"
        }
    });
});

var app = builder.Build();

// ==============================================================================
// 2. HTTP REQUEST PIPELINE (MIDDLEWARE)
// ==============================================================================

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "LMS Assuyutiyah API v1");
        c.RoutePrefix = "swagger"; // Akses via http://localhost:5000/swagger
    });
}

app.UseCors("AllowAllPolicy");

// Inisialisasi & Seeding Database Otomatis saat Startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<LmsDbContext>();
        await DbInitializer.InitializeAsync(context);
        Console.WriteLine("✅ Database SQLite & Seed Data Berhasil Diinisialisasi.");
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "❌ Terjadi kesalahan saat melakukan seeding database.");
    }
}

// Endpoint status kesehatan API
app.MapGet("/", () => Results.Ok(new
{
    App = "LMS MI Assuyutiyah Backend (ASP.NET Core 8 / C#)",
    Status = "Online",
    SwaggerUrl = "/swagger",
    Documentation = "Akses /swagger untuk dokumentasi interaktif OpenAPI"
}));

app.MapGet("/api/health", () => Results.Ok(new
{
    Status = "UP",
    Platform = "ASP.NET Core 8",
    Framework = ".NET 8.0 Web API",
    Timestamp = DateTime.UtcNow
}));

app.UseAuthorization();
app.MapControllers();

Console.WriteLine("===================================================================");
Console.WriteLine("🚀 LMS MI Assuyutiyah ASP.NET Core Backend Siap Dijalankan!");
Console.WriteLine("📖 Swagger UI Docs: http://localhost:5000/swagger");
Console.WriteLine("📡 Endpoint Utama : http://localhost:5000/api/students");
Console.WriteLine("===================================================================");

app.Run();
