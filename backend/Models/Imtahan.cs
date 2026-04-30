using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ImtahanApi.Models;

[Table("Imtahanlar")]
public class Imtahan
{
    [Key]
    public int Id { get; set; }

    [Required]
    [Column(TypeName = "char(3)")]
    [StringLength(3, MinimumLength = 3)]
    public string DersKodu { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "numeric(5,0)")]
    public int SagirdNomresi { get; set; }

    [Required]
    [Column(TypeName = "date")]
    public DateTime ImtahanTarixi { get; set; }

    [Required]
    [Column(TypeName = "numeric(1,0)")]
    [Range(1, 5)]
    public int Qiymeti { get; set; }

    // Navigation
    [ForeignKey(nameof(DersKodu))]
    public Ders? Ders { get; set; }

    [ForeignKey(nameof(SagirdNomresi))]
    public Sagird? Sagird { get; set; }
}
