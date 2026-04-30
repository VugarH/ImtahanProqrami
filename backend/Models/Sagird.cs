using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ImtahanApi.Models;

[Table("Sagirdler")]
public class Sagird
{
    [Key]
    [Column(TypeName = "numeric(5,0)")]
    public int Nomresi { get; set; }

    [Required]
    [Column(TypeName = "varchar(30)")]
    [StringLength(30)]
    public string Adi { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "varchar(30)")]
    [StringLength(30)]
    public string Soyadi { get; set; } = string.Empty;

    [Required]
    [Column(TypeName = "numeric(2,0)")]
    public int Sinifi { get; set; }

    // Navigation
    public ICollection<Imtahan> Imtahanlar { get; set; } = new List<Imtahan>();
}
