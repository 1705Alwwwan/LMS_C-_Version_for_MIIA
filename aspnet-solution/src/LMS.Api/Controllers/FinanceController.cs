using LMS.Api.Data;
using LMS.Api.DTOs;
using LMS.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LMS.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class FinanceController : ControllerBase
{
    private readonly LmsDbContext _context;

    public FinanceController(LmsDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Mengambil seluruh tagihan SPP dan riwayat pembayaran
    /// </summary>
    [HttpGet("invoices")]
    public async Task<ActionResult<ApiResponse<IEnumerable<FinanceInvoice>>>> GetInvoices(
        [FromQuery] string? studentId,
        [FromQuery] PaymentStatus? status)
    {
        var query = _context.FinanceInvoices
            .Include(f => f.Student)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(studentId))
        {
            query = query.Where(f => f.StudentId == studentId);
        }

        if (status.HasValue)
        {
            query = query.Where(f => f.Status == status.Value);
        }

        var list = await query
            .OrderByDescending(f => f.DueDate)
            .ToListAsync();

        return Ok(new ApiResponse<IEnumerable<FinanceInvoice>>(true, "Daftar invoice SPP berhasil dimuat", list));
    }

    /// <summary>
    /// Melakukan konfirmasi pembayaran SPP santri
    /// </summary>
    [HttpPost("invoices/{invoiceId}/pay")]
    public async Task<ActionResult<ApiResponse<FinanceInvoice>>> PayInvoice(
        string invoiceId,
        [FromQuery] decimal amount,
        [FromQuery] string method = "Transfer BSI")
    {
        var invoice = await _context.FinanceInvoices.FindAsync(invoiceId);
        if (invoice == null)
        {
            return NotFound(new ApiResponse<object>(false, "Invoice tidak ditemukan"));
        }

        invoice.AmountPaid += amount;
        if (invoice.AmountPaid >= invoice.Amount)
        {
            invoice.Status = PaymentStatus.LUNAS;
        }
        else
        {
            invoice.Status = PaymentStatus.SEBAGIAN;
        }

        invoice.PaidAt = DateTime.UtcNow;
        invoice.PaymentMethod = method;

        await _context.SaveChangesAsync();

        return Ok(new ApiResponse<FinanceInvoice>(true, "Pembayaran SPP berhasil diproses. Jazakumullah khairan.", invoice));
    }
}
