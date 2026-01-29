using System;
using System.Collections.Generic;
using System.Linq;

namespace StarcatcherApi.Models
{
    public class UsuarioCreateDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;

        public Usuario ToEntity()
        {
            return new Usuario
            {
                Nome = Nome,
                Email = Email,
                Senha = Senha,
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = null
            };
        }
    }

    public class UsuarioUpdateDto
    {
        public string? Nome { get; set; }
        public string? Email { get; set; }
        public string? Senha { get; set; }

        public void ApplyTo(Usuario usuario)
        {
            if (!string.IsNullOrWhiteSpace(Nome)) usuario.Nome = Nome!;
            if (!string.IsNullOrWhiteSpace(Email)) usuario.Email = Email!;
            if (!string.IsNullOrWhiteSpace(Senha)) usuario.Senha = Senha!;
            usuario.DataAtualizacao = DateTime.UtcNow;
        }
    }

    public class UsuarioReadDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }
        public DateTime? DataAtualizacao { get; set; }
        public IEnumerable<CotaSummaryDto>? Cotas { get; set; }

        public static UsuarioReadDto FromEntity(Usuario u)
        {
            if (u == null) return null!;
            return new UsuarioReadDto
            {
                Id = u.Id,
                Nome = u.Nome,
                Email = u.Email,
                DataCriacao = u.DataCriacao,
                DataAtualizacao = u.DataAtualizacao,
                Cotas = u.Cotas?.Select(CotaSummaryDto.FromEntity).ToList()
            };
        }
    }
}