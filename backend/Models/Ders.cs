using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ImtahanApi.Models;

[Table("Dersler")]
public class Ders
{
    [Key]
    [Column(TypeName = "char(3)")]
    [StringLength(3, MinimumLength = 3)]
    public string DersKodu { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "varchar(30)")]
    [StringLength(30)]
    public string DersAdi { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "numeric(2,0)")]
    public int Sinifi { get; set; }

    [Required]
    [Column(TypeName = "varchar(20)")]
    [StringLength(20)]
    public string MuellimAdi { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "varchar(20)")]
    [StringLength(20)]
    public string MuellimSoyadi { get; set; } = string.Empty;

    // Navigation
    public ICollection<Imtahan> Imtahanlar { get; set; } = new List<Imtahan>();
}
