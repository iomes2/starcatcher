using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace StarcatcherApi.Models
{
    public class Cota
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("Consorcio")]
        public int ConsorcioId { get; set; } // Adicionado de volta
        [ForeignKey("Usuario")]
        public int UsuarioId { get; set; }   // Adicionado de volta
        public string NumeroCota { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }
        public DateTime? DataAtualizacao { get; set; }
        // [ForeignKey("ConsorcioId")]
        [JsonIgnore] // Ignora na serialização
        public virtual Consorcio? Consorcio { get; set; } // Relacionamento
        // [ForeignKey("UsuarioId")]
        [JsonIgnore] // Ignora na serialização
        public virtual Usuario? Usuario { get; set; }     // Relacionamento, ? deixa a propriedade como opcional (pode ser nula)
    }
}