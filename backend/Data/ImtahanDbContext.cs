using ImtahanApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ImtahanApi.Data;

public class ImtahanDbContext : DbContext
{
    public ImtahanDbContext(DbContextOptions<ImtahanDbContext> options)
        : base(options) { }

    public DbSet<Ders> Dersler => Set<Ders>();
    public DbSet<Sagird> Sagirdler => Set<Sagird>();
    public DbSet<Imtahan> Imtahanlar => Set<Imtahan>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Şagird primary key auto-increment olmasın - istifadəçi özü daxil edir
        modelBuilder.Entity<Sagird>()
            .Property(s => s.Nomresi)
            .ValueGeneratedNever();

        // Ders primary key də manual daxil olunur
        modelBuilder.Entity<Ders>()
            .Property(d => d.DersKodu)
            .ValueGeneratedNever();

        // Foreign key relationships
        modelBuilder.Entity<Imtahan>()
            .HasOne(i => i.Ders)
            .WithMany(d => d.Imtahanlar)
            .HasForeignKey(i => i.DersKodu)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Imtahan>()
            .HasOne(i => i.Sagird)
            .WithMany(s => s.Imtahanlar)
            .HasForeignKey(i => i.SagirdNomresi)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
