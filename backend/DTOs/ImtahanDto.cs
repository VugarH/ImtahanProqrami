namespace ImtahanApi.DTOs;

public class ImtahanDto
{
    public int Id { get; set; }
    public string DersKodu { get; set; } = string.Empty;
    public string DersAdi { get; set; } = string.Empty;
    public int SagirdNomresi { get; set; }
    public string SagirdAdi { get; set; } = string.Empty;
    public string SagirdSoyadi { get; set; } = string.Empty;
    public DateTime ImtahanTarixi { get; set; }
    public int Qiymeti { get; set; }
}

public class ImtahanCreateDto
{
    public string DersKodu { get; set; } = string.Empty;
    public int SagirdNomresi { get; set; }
    public DateTime ImtahanTarixi { get; set; }
    public int Qiymeti { get; set; }
}
