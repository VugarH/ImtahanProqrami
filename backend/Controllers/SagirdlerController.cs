using ImtahanApi.Data;
using ImtahanApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImtahanApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SagirdlerController : ControllerBase
{
    private readonly ImtahanDbContext _context;

    public SagirdlerController(ImtahanDbContext context)
    {
        _context = context;
    }

    // GET: api/sagirdler
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Sagird>>> GetAll()
    {
        return await _context.Sagirdler.AsNoTracking().ToListAsync();
    }

    // GET: api/sagirdler/10001
    [HttpGet("{nomre}")]
    public async Task<ActionResult<Sagird>> GetByNomre(int nomre)
    {
        var sagird = await _context.Sagirdler.FindAsync(nomre);
        if (sagird == null) return NotFound();
        return sagird;
    }

    [HttpPost]
    public async Task<ActionResult<Sagird>> Create(Sagird sagird)
    {
        if (sagird.Nomresi < 10000 || sagird.Nomresi > 99999)
            return BadRequest("Şagird nömrəsi 5 rəqəmli olmalıdır (10000 - 99999 arası).");

        if (await _context.Sagirdler.AnyAsync(s => s.Nomresi == sagird.Nomresi))
            return Conflict($"'{sagird.Nomresi}' nömrəli şagird artıq mövcuddur.");

        if (sagird.Sinifi < 1 || sagird.Sinifi > 11)
            return BadRequest("Sinif 1 ilə 11 arasında olmalıdır.");

        _context.Sagirdler.Add(sagird);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetByNomre), new { nomre = sagird.Nomresi }, sagird);
    }

    // PUT: api/sagirdler/10001
    [HttpPut("{nomre}")]
    public async Task<IActionResult> Update(int nomre, Sagird sagird)
    {
        if (nomre != sagird.Nomresi) return BadRequest("URL nömrəsi ilə body nömrəsi uyğun gəlmir.");

        var mevcud = await _context.Sagirdler.FindAsync(nomre);
        if (mevcud == null) return NotFound();

        mevcud.Adi    = sagird.Adi;
        mevcud.Soyadi = sagird.Soyadi;
        mevcud.Sinifi = sagird.Sinifi;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/sagirdler/10001
    [HttpDelete("{nomre}")]
    public async Task<IActionResult> Delete(int nomre)
    {
        var sagird = await _context.Sagirdler.FindAsync(nomre);
        if (sagird == null) return NotFound();

        var hasImtahan = await _context.Imtahanlar.AnyAsync(i => i.SagirdNomresi == nomre);
        if (hasImtahan)
            return BadRequest("Bu şagirdə bağlı imtahanlar mövcuddur. Əvvəlcə imtahanları silin.");

        _context.Sagirdler.Remove(sagird);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
