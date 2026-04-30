export interface Ders {
  dersKodu: string;
  dersAdi: string;
  sinifi: number;
  muellimAdi: string;
  muellimSoyadi: string;
}

export interface Sagird {
  nomresi: number;
  adi: string;
  soyadi: string;
  sinifi: number;
}

export interface Imtahan {
  id: number;
  dersKodu: string;
  dersAdi: string;
  sagirdNomresi: number;
  sagirdAdi: string;
  sagirdSoyadi: string;
  imtahanTarixi: string;
  qiymeti: number;
}

export interface ImtahanCreate {
  dersKodu: string;
  sagirdNomresi: number;
  imtahanTarixi: string;
  qiymeti: number;
}
