using ImtahanApi.Data;
using ImtahanApi.DTOs;
using ImtahanApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ImtahanApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImtahanlarController : ControllerBase
{
    private readonly ImtahanDbContext _context;

    public ImtahanlarController(ImtahanDbContext context)
    {
        _context = context;
    }

    // GET: api/imtahanlar
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ImtahanDto>>> GetAll()
    {
        var list = await _context.Imtahanlar
            .Include(i => i.Ders)
            .Include(i => i.Sagird)
            .AsNoTracking()
            .Select(i => new ImtahanDto
            {
                Id             = i.Id,
                DersKodu       = i.DersKodu,
                DersAdi        = i.Ders!.DersAdi,
                SagirdNomresi  = i.SagirdNomresi,
                SagirdAdi      = i.Sagird!.Adi,
                SagirdSoyadi   = i.Sagird!.Soyadi,
                ImtahanTarixi  = i.ImtahanTarixi,
                Qiymeti        = i.Qiymeti
            })
            .ToListAsync();

        return Ok(list);
    }

    // GET: api/imtahanlar/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ImtahanDto>> GetById(int id)
    {
        var i = await _context.Imtahanlar
            .Include(x => x.Ders)
            .Include(x => x.Sagird)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (i == null) return NotFound();

        return new ImtahanDto
        {
            Id             = i.Id,
            DersKodu       = i.DersKodu,
            DersAdi        = i.Ders!.DersAdi,
            SagirdNomresi  = i.SagirdNomresi,
            SagirdAdi      = i.Sagird!.Adi,
            SagirdSoyadi   = i.Sagird!.Soyadi,
            ImtahanTarixi  = i.ImtahanTarixi,
            Qiymeti        = i.Qiymeti
        };
    }

    // POST: api/imtahanlar
    [HttpPost]
    public async Task<ActionResult<ImtahanDto>> Create(ImtahanCreateDto dto)
    {
        // FK validation
        var dersExists   = await _context.Dersler.AnyAsync(d => d.DersKodu == dto.DersKodu);
        var sagirdExists = await _context.Sagirdler.AnyAsync(s => s.Nomresi == dto.SagirdNomresi);

        if (!dersExists)   return BadRequest($"'{dto.DersKodu}' kodlu dərs tapılmadı.");
        if (!sagirdExists) return BadRequest($"'{dto.SagirdNomresi}' nömrəli şagird tapılmadı.");

        if (dto.Qiymeti < 1 || dto.Qiymeti > 5)
            return BadRequest("Qiymət 1 ilə 5 arasında olmalıdır.");

        var imtahan = new Imtahan
        {
            DersKodu      = dto.DersKodu,
            SagirdNomresi = dto.SagirdNomresi,
            ImtahanTarixi = dto.ImtahanTarixi,
            Qiymeti       = dto.Qiymeti
        };

        _context.Imtahanlar.Add(imtahan);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = imtahan.Id }, imtahan);
    }

    // PUT: api/imtahanlar/5
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ImtahanCreateDto dto)
    {
        var mevcud = await _context.Imtahanlar.FindAsync(id);
        if (mevcud == null) return NotFound();

        if (dto.Qiymeti < 1 || dto.Qiymeti > 5)
            return BadRequest("Qiymət 1 ilə 5 arasında olmalıdır.");

        mevcud.DersKodu      = dto.DersKodu;
        mevcud.SagirdNomresi = dto.SagirdNomresi;
        mevcud.ImtahanTarixi = dto.ImtahanTarixi;
        mevcud.Qiymeti       = dto.Qiymeti;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/imtahanlar/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var imtahan = await _context.Imtahanlar.FindAsync(id);
        if (imtahan == null) return NotFound();

        _context.Imtahanlar.Remove(imtahan);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
