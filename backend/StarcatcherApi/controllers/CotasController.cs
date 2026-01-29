using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using StarcatcherApi.Data;
using StarcatcherApi.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System;

namespace StarcatcherApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CotasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CotasController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CotaReadDto>>> GetCotas()
        {
            var cotas = await _context.Cotas
                .Include(c => c.Consorcio)
                .Include(c => c.Usuario)
                .ToListAsync();

            return cotas.Select(CotaReadDto.FromEntity).ToList();
        }

        [HttpPost]
        public async Task<ActionResult<CotaReadDto>> CreateCota(CotaCreateDto cotaDto)
        {
            if (cotaDto == null) return BadRequest("Cota cannot be null.");
            if (cotaDto.ConsorcioId <= 0 || cotaDto.UsuarioId <= 0)
                return BadRequest("ConsorcioId and UsuarioId are required.");

            var consorcioExists = await _context.Consorcios.AnyAsync(c => c.Id == cotaDto.ConsorcioId);
            var usuarioExists = await _context.Usuarios.AnyAsync(u => u.Id == cotaDto.UsuarioId);
            if (!consorcioExists) return BadRequest("ConsorcioId does not exist.");
            if (!usuarioExists) return BadRequest("UsuarioId does not exist.");

            var cota = cotaDto.ToEntity();
            // cota.DataAtualizacao = DateTime.UtcNow;
            _context.Cotas.Add(cota);
            await _context.SaveChangesAsync();

            var read = CotaReadDto.FromEntity(cota);
            return CreatedAtAction(nameof(GetCota), new { id = cota.Id }, read);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CotaReadDto>> GetCota(int id)
        {
            var cota = await _context.Cotas
                .Include(c => c.Consorcio)
                .Include(c => c.Usuario)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (cota == null) return NotFound();
            return CotaReadDto.FromEntity(cota);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCota(int id, CotaUpdateDto dto)
        {
            if (dto == null) return BadRequest("Cota cannot be null.");

            var cotaExistente = await _context.Cotas
                .Include(c => c.Consorcio)
                .Include(c => c.Usuario)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (cotaExistente == null) return NotFound();

            dto.ApplyTo(cotaExistente);

            try
            {
                _context.Entry(cotaExistente).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Error updating cota: {ex.Message}");
                return StatusCode(500, "Error updating cota");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCota(int id)
        {
            var cota = await _context.Cotas
                .Include(c => c.Consorcio)
                .Include(c => c.Usuario)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (cota == null) return NotFound();

            _context.Cotas.Remove(cota);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("consorcio/{consorcioId}")]
        public async Task<ActionResult<IEnumerable<CotaReadDto>>> GetCotasByConsorcio(int consorcioId)
        {
            var cotas = await _context.Cotas
                .Include(c => c.Consorcio)
                .Include(c => c.Usuario)
                .Where(c => c.ConsorcioId == consorcioId)
                .ToListAsync();

            return cotas.Select(CotaReadDto.FromEntity).ToList();
        }
    }
}