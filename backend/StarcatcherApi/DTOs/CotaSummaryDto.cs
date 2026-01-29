namespace StarcatcherApi.Models
{
    public class CotaSummaryDto
    {
        public int Id { get; set; }
        public string NumeroCota { get; set; } = string.Empty;
        public decimal Valor { get; set; }

        public static CotaSummaryDto FromEntity(Cota c)
        {
            if (c == null) return null!;
            return new CotaSummaryDto
            {
                Id = c.Id,
                NumeroCota = c.NumeroCota,
                Valor = c.Valor
            };
        }
    }
}