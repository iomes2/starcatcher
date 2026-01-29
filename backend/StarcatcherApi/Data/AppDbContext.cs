using Microsoft.EntityFrameworkCore;
using StarcatcherApi.Models;

namespace StarcatcherApi.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Cota> Cotas { get; set; }
        public DbSet<Consorcio> Consorcios { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }

        public AppDbContext()
        {
            // Construtor vazio para testes
        }
        
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cota>().Property(c => c.Valor).HasColumnType("decimal(18,2)");

            //o q tem muitos q recebe a chave estrangeira
            // Relação Cota -> Consorcio (configurada apenas uma vez)
            // modelBuilder.Entity<Cota>()
            //     .HasOne(c => c.Consorcio)
            //     .WithMany(c => c.Cotas)
            //     .HasForeignKey(c => c.ConsorcioId)
            //     .OnDelete(DeleteBehavior.SetNull);

            // // Relação Usuario -> Cota
            // modelBuilder.Entity<Usuario>()
            //     .HasMany(u => u.Cotas)
            //     .WithOne(c => c.Usuario)
            //     .HasForeignKey(c => c.UsuarioId)
            //     .OnDelete(DeleteBehavior.SetNull);

            base.OnModelCreating(modelBuilder);
        }
    }
}