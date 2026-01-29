using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using StarcatcherApi.Data;
using StarcatcherApi.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System;
using StarcatcherApi.Services;

namespace StarcatcherApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly AuthService _authService;

        public UsuariosController(AppDbContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<UsuarioReadDto>>> GetUsuarios()
        {
            var usuarios = await _context.Usuarios
                .Include(u => u.Cotas)
                .ToListAsync();

            return usuarios.Select(UsuarioReadDto.FromEntity).ToList();
        }

        [AllowAnonymous] // Permitir criação de usuário sem autenticação
        [HttpPost]
        public async Task<ActionResult<dynamic>> CreateUsuario(UsuarioCreateDto dto)
        {
            if (dto == null) return BadRequest("Usuario cannot be null.");

            var usuario = dto.ToEntity();
            // garantir que DataAtualizacao permaneça null na criação
            usuario.DataAtualizacao = null;

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            // Gerar token JWT para o novo usuário
            var token = _authService.Authenticate(usuario.Nome, usuario.Senha); // Usar Nome e Senha do usuário recém-criado
            if (token == null)
            {
                return StatusCode(500, "Erro ao gerar token para o novo usuário.");
            }

            return Ok(new { Token = token, Usuario = UsuarioReadDto.FromEntity(usuario) });
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<UsuarioReadDto>> GetUsuario(int id)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Cotas)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (usuario == null) return NotFound();
            return UsuarioReadDto.FromEntity(usuario);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutUsuario(int id, UsuarioUpdateDto dto)
        {
            if (dto == null) return BadRequest("Usuario cannot be null.");

            var usuarioExistente = await _context.Usuarios
                .Include(u => u.Cotas)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (usuarioExistente == null) return NotFound();

            dto.ApplyTo(usuarioExistente);

            try
            {
                _context.Entry(usuarioExistente).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                Console.WriteLine($"Error updating usuario: {ex.Message}");
                return StatusCode(500, "Error updating usuario");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteUsuario(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null) return NotFound();

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}