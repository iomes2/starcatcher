using System;
using System.Collections.Generic;
using System.Linq;

namespace StarcatcherApi.Models
{
    public class ConsorcioCreateDto
    {
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;

        public Consorcio ToEntity()
        {
            return new Consorcio
            {
                Nome = Nome,
                Descricao = Descricao,
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = null
            };
        }
    }

    public class ConsorcioUpdateDto
    {
        public string? Nome { get; set; }
        public string? Descricao { get; set; }

        public void ApplyTo(Consorcio consorcio)
        {
            if (!string.IsNullOrWhiteSpace(Nome)) consorcio.Nome = Nome!;
            if (!string.IsNullOrWhiteSpace(Descricao)) consorcio.Descricao = Descricao!;
            consorcio.DataAtualizacao = DateTime.UtcNow;
        }
    }

    public class ConsorcioReadDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }
        public DateTime? DataAtualizacao { get; set; }
        public IEnumerable<CotaSummaryDto>? Cotas { get; set; }

        public static ConsorcioReadDto FromEntity(Consorcio c)
        {
            if (c == null) return null!;
            return new ConsorcioReadDto
            {
                Id = c.Id,
                Nome = c.Nome,
                Descricao = c.Descricao,
                DataCriacao = c.DataCriacao,
                DataAtualizacao = c.DataAtualizacao,
                Cotas = c.Cotas?.Select(CotaSummaryDto.FromEntity).ToList()
            };
        }
    }
}