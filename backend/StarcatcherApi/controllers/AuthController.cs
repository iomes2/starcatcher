using Microsoft.AspNetCore.Mvc;
using StarcatcherApi.DTOs;
using StarcatcherApi.Services;

namespace StarcatcherApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            var token = _authService.Authenticate(loginDto.Nome, loginDto.Senha);

            if (token == null)
            {
                return Unauthorized(new { message = "Usuário ou senha inválidos" });
            }

            return Ok(new { Token = token });
        }
    }
}
