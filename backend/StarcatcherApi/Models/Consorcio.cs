using System.Collections.Generic;

namespace StarcatcherApi.Models
{
    public class Consorcio
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Descricao { get; set; } = string.Empty;
        public DateTime DataCriacao { get; set; }
        public DateTime? DataAtualizacao { get; set; }
        // public List<Cota> Cotas { get; set; } // Relacionamento: um consórcio tem muitas cotas
        public virtual ICollection<Cota> Cotas { get; set; } = new List<Cota>(); // Inicializado como vazio
    }
}