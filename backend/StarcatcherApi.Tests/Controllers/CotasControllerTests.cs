using Xunit;
using Moq;
using Microsoft.EntityFrameworkCore;
using StarcatcherApi.Data;
using StarcatcherApi.Models;
using StarcatcherApi.Controllers;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace StarcatcherApi.Tests.Controllers
{
    public class CotasControllerTests
    {
        private readonly Mock<AppDbContext> _mockContext;
        private readonly CotasController _controller;

        public CotasControllerTests()
        {
            // Configurar o mock com o construtor vazio e opções (opcional, pode ser removido se não usado)
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: $"TestDb_{Guid.NewGuid()}")
                .Options;
            _mockContext = new Mock<AppDbContext>(options);
            _controller = new CotasController(_mockContext.Object);
        }

[Fact]
public async Task GetCotas_ReturnsAllCotas_AssociatedWithConsorcio()
{
    // Arrange: Usar banco em memória para simular dados
    var options = new DbContextOptionsBuilder<AppDbContext>()
        .UseInMemoryDatabase(databaseName: $"GetCotasDb_{Guid.NewGuid()}")
        .Options;

    using (var context = new AppDbContext(options))
    {
        var consorcio = new Consorcio { Id = 1, Nome = "Cons1" };
        var usuario = new Usuario { Id = 1, Nome = "User1" };
        context.Consorcios.Add(consorcio);
        context.Usuarios.Add(usuario);
        context.Cotas.AddRange(
            new Cota { Id = 1, NumeroCota = "COTA-001", ConsorcioId = 1, UsuarioId = 1, Valor = 9000.00m, Status = "Ativa" },
            new Cota { Id = 2, NumeroCota = "COTA-002", ConsorcioId = 1, UsuarioId = 1, Valor = 9500.00m, Status = "Paga" }
        );
        await context.SaveChangesAsync();
    }

    using (var context = new AppDbContext(options))
    {
        var controller = new CotasController(context);
        var result = await controller.GetCotas();

        var actionResult = Assert.IsType<ActionResult<IEnumerable<Cota>>>(result);
        var list = Assert.IsAssignableFrom<IEnumerable<Cota>>(actionResult.Value);
        Assert.Equal(2, list.Count());
        Assert.Contains(list, c => c.NumeroCota == "COTA-001");
        foreach (var cota in list)
        {
            Assert.NotNull(cota.Consorcio);
            Assert.Equal("Cons1", cota.Consorcio.Nome);
            Assert.NotNull(cota.Usuario);
            Assert.Equal("User1", cota.Usuario.Nome);
        }
    }
}

        [Fact]
        public async Task CreateCota_CreatesCotaSuccessfully()
        {
            // Arrange: Usar banco em memória para simular dados
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: $"CreateCotaDb_{Guid.NewGuid()}")
                .Options;

            using (var context = new AppDbContext(options))
            {
                var controller = new CotasController(context);

                // Adicionar Consorcio e Usuario para passar nas validações
                var consorcio = new Consorcio { Id = 1, Nome = "Cons1" };
                var usuario = new Usuario { Id = 1, Nome = "User1" };
                context.Consorcios.Add(consorcio);
                context.Usuarios.Add(usuario);
                await context.SaveChangesAsync(); // Salvar os dados

                // Forçar sincronização e verificar contagem
                await Task.Delay(1); // Pequeno atraso para garantir sincronização
                var consorcioCount = await context.Consorcios.CountAsync();
                var usuarioCount = await context.Usuarios.CountAsync();
                Console.WriteLine($"Consorcios count: {consorcioCount}, Usuarios count: {usuarioCount}");
                Assert.Equal(1, consorcioCount);
                Assert.Equal(1, usuarioCount);

                // Act: Chamar o método de criação com o DTO
                var cotaDto = new CotaCreateDto
                {
                    ConsorcioId = 1,
                    UsuarioId = 1,
                    NumeroCota = "COTA-003",
                    Valor = 10000.00m,
                    Status = "Ativa"
                };
                var result = await controller.CreateCota(cotaDto);

                // Assert: Verificar o resultado com depuração
                var createdResult = Assert.IsType<ActionResult<Cota>>(result);
                if (createdResult.Result != null)
                {
                    if (createdResult.Result is BadRequestObjectResult badRequest)
                    {
                        Console.WriteLine($"Bad Request: {badRequest.Value}");
                        Assert.Fail($"Bad Request: {badRequest.Value}");
                    }
                    else if (createdResult.Result is ObjectResult objectResult)
                    {
                        Console.WriteLine($"Status Code: {objectResult.StatusCode}, Value: {objectResult.Value}");
                    }
                }
                else
                {
                    Console.WriteLine("Result is null, checking Value directly");
                }
                var createdCota = createdResult.Value;
                Assert.NotNull(createdCota);
                Assert.Equal("COTA-003", createdCota.NumeroCota);

                // Verificar se foi salvo no contexto
                var cotas = context.Cotas.ToList();
                Assert.Single(cotas); // Deve ter exatamente 1 cota
                Assert.Equal("COTA-003", cotas[0].NumeroCota);
            }
        }
    }
}