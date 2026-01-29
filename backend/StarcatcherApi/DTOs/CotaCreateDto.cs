using System;

namespace StarcatcherApi.Models
{
    public class CotaCreateDto
    {
        public int ConsorcioId { get; set; }
        public int UsuarioId { get; set; }
        public string NumeroCota { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public string Status { get; set; } = string.Empty;

        public Cota ToEntity()
        {
            return new Cota
            {
                ConsorcioId = ConsorcioId,
                UsuarioId = UsuarioId,
                NumeroCota = NumeroCota,
                Valor = Valor,
                Status = Status,
                DataCriacao = DateTime.UtcNow,
                DataAtualizacao = null
            };
        }
    }

    public class CotaUpdateDto
    {
        public string? NumeroCota { get; set; }
        public decimal? Valor { get; set; }
        public string? Status { get; set; }

        public void ApplyTo(Cota cota)
        {
            if (!string.IsNullOrWhiteSpace(NumeroCota)) cota.NumeroCota = NumeroCota!;
            if (Valor.HasValue) cota.Valor = Valor.Value;
            if (!string.IsNullOrWhiteSpace(Status)) cota.Status = Status!;
            cota.DataAtualizacao = DateTime.UtcNow;
        }
    }

    public class CotaReadDto
    {
        public int Id { get; set; }
        public int ConsorcioId { get; set; }
        public int UsuarioId { get; set; }
        public string NumeroCota { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }
        public DateTime? DataAtualizacao { get; set; }

        public static CotaReadDto FromEntity(Cota c)
        {
            return new CotaReadDto
            {
                Id = c.Id,
                ConsorcioId = c.ConsorcioId,
                UsuarioId = c.UsuarioId,
                NumeroCota = c.NumeroCota,
                Valor = c.Valor,
                Status = c.Status,
                DataCriacao = c.DataCriacao,
                DataAtualizacao = c.DataAtualizacao
            };
        }
    }
}