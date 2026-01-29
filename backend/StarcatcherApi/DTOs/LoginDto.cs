using System.ComponentModel.DataAnnotations;

namespace StarcatcherApi.DTOs
{
    public class LoginDto
    {
        [Required]
        public string Nome { get; set; } = string.Empty;

        [Required]
        public string Senha { get; set; } = string.Empty;
    }
}
