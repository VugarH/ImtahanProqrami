using ImtahanApi.Data;
using ImtahanApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImtahanApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DerslerController : ControllerBase
{
    private readonly ImtahanDbContext _context;

    public DerslerController(ImtahanDbContext context)
    {
        _context = context;
    }

    // GET: api/dersler
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Ders>>> GetAll()
    {
        return await _context.Dersler.AsNoTracking().ToListAsync();
    }

    // GET: api/dersler/RIY
    [HttpGet("{kod}")]
    public async Task<ActionResult<Ders>> GetByKod(string kod)
    {
        var ders = await _context.Dersler.FindAsync(kod);
        if (ders == null) return NotFound();
        return ders;
    }

    // POST: api/dersler
    [HttpPost]
    public async Task<ActionResult<Ders>> Create(Ders ders)
    {
        if (await _context.Dersler.AnyAsync(d => d.DersKodu == ders.DersKodu))
        {
            return Conflict($"'{ders.DersKodu}' kodlu dərs artıq mövcuddur.");
        }

        _context.Dersler.Add(ders);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetByKod), new { kod = ders.DersKodu }, ders);
    }

    // PUT: api/dersler/RIY
    [HttpPut("{kod}")]
    public async Task<IActionResult> Update(string kod, Ders ders)
    {
        if (kod != ders.DersKodu) return BadRequest("URL-dəki kod ilə body-dəki kod uyğun gəlmir.");

        var mevcud = await _context.Dersler.FindAsync(kod);
        if (mevcud == null) return NotFound();

        mevcud.DersAdi       = ders.DersAdi;
        mevcud.Sinifi        = ders.Sinifi;
        mevcud.MuellimAdi    = ders.MuellimAdi;
        mevcud.MuellimSoyadi = ders.MuellimSoyadi;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/dersler/RIY
    [HttpDelete("{kod}")]
    public async Task<IActionResult> Delete(string kod)
    {
        var ders = await _context.Dersler.FindAsync(kod);
        if (ders == null) return NotFound();

        var hasImtahan = await _context.Imtahanlar.AnyAsync(i => i.DersKodu == kod);
        if (hasImtahan)
            return BadRequest("Bu dərsə bağlı imtahanlar mövcuddur. Əvvəlcə imtahanları silin.");

        _context.Dersler.Remove(ders);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
