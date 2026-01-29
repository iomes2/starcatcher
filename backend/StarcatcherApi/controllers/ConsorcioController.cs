// filepath: c:\Users\PC\Desktop\atividades\starcatcher\backend\StarcatcherApi\controllers\ConsorcioController.cs
// ...existing code...
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
    public class ConsorciosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConsorciosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ConsorcioReadDto>>> GetConsorcios()
        {
            var consorcios = await _context.Consorcios
                .Include(c => c.Cotas)
                .ToListAsync();

            return consorcios.Select(ConsorcioReadDto.FromEntity).ToList();
        }

        [HttpPost]
        public async Task<ActionResult<ConsorcioReadDto>> CreateConsorcio(ConsorcioCreateDto dto)
        {
            if (dto == null) return BadRequest("Consorcio cannot be null.");

            var consorcio = dto.ToEntity();
            consorcio.DataAtualizacao = null;

            _context.Consorcios.Add(consorcio);
            await _context.SaveChangesAsync();

            var read = ConsorcioReadDto.FromEntity(consorcio);
            return CreatedAtAction(nameof(GetConsorcio), new { id = consorcio.Id }, read);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ConsorcioReadDto>> GetConsorcio(int id)
        {
            var consorcio = await _context.Consorcios
                .Include(c => c.Cotas)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (consorcio == null) return NotFound();
            return ConsorcioReadDto.FromEntity(consorcio);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutConsorcio(int id, ConsorcioUpdateDto dto)
        {
            if (dto == null) return BadRequest("Consorcio cannot be null.");

            var consorcioExistente = await _context.Consorcios
                .Include(c => c.Cotas)
                .FirstOrDefaultAsync(c => c.Id == id);
            if (consorcioExistente == null) return NotFound();

            dto.ApplyTo(consorcioExistente);

            try
            {
                _context.Entry(consorcioExistente).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Error updating consorcio: {ex.Message}");
                return StatusCode(500, "Error updating consorcio");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteConsorcio(int id)
        {
            var consorcio = await _context.Consorcios.FindAsync(id);
            if (consorcio == null) return NotFound();

            _context.Consorcios.Remove(consorcio);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
// ...existing code...