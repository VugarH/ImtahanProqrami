-- ============================================
-- İmtahan Proqramı - Database Yaradılması
-- ============================================

-- Database yaratmaq (əgər yoxdursa)
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'ImtahanDB')
BEGIN
    CREATE DATABASE ImtahanDB;
END
GO

USE ImtahanDB;
GO

-- ============================================
-- Dərslər cədvəli
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Dersler')
BEGIN
    CREATE TABLE Dersler (
        DersKodu        CHAR(3)         NOT NULL PRIMARY KEY,
        DersAdi         VARCHAR(30)     NOT NULL,
        Sinifi          NUMERIC(2,0)    NOT NULL,
        MuellimAdi      VARCHAR(20)     NOT NULL,
        MuellimSoyadi   VARCHAR(20)     NOT NULL
    );
END
GO

-- ============================================
-- Şagirdlər cədvəli
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Sagirdler')
BEGIN
    CREATE TABLE Sagirdler (
        Nomresi         NUMERIC(5,0)    NOT NULL PRIMARY KEY,
        Adi             VARCHAR(30)     NOT NULL,
        Soyadi          VARCHAR(30)     NOT NULL,
        Sinifi          NUMERIC(2,0)    NOT NULL
    );
END
GO

-- ============================================
-- İmtahanlar cədvəli
-- ============================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Imtahanlar')
BEGIN
    CREATE TABLE Imtahanlar (
        Id              INT IDENTITY(1,1) PRIMARY KEY,
        DersKodu        CHAR(3)         NOT NULL,
        SagirdNomresi   NUMERIC(5,0)    NOT NULL,
        ImtahanTarixi   DATE            NOT NULL,
        Qiymeti         NUMERIC(1,0)    NOT NULL CHECK (Qiymeti BETWEEN 1 AND 5),

        CONSTRAINT FK_Imtahanlar_Dersler
            FOREIGN KEY (DersKodu) REFERENCES Dersler(DersKodu),
        CONSTRAINT FK_Imtahanlar_Sagirdler
            FOREIGN KEY (SagirdNomresi) REFERENCES Sagirdler(Nomresi)
    );
END
GO

-- ============================================
-- Test məlumatları
-- ============================================
IF NOT EXISTS (SELECT 1 FROM Dersler)
BEGIN
    INSERT INTO Dersler (DersKodu, DersAdi, Sinifi, MuellimAdi, MuellimSoyadi) VALUES
    ('RIY', 'Riyaziyyat',     10, 'Aysel',  'Memmedova'),
    ('FIZ', 'Fizika',         10, 'Rashad', 'Aliyev'),
    ('AZD', 'Azerbaycan dili', 9, 'Lale',   'Huseynova'),
    ('ING', 'Ingilis dili',   11, 'Nigar',  'Ismayilova');
END
GO

IF NOT EXISTS (SELECT 1 FROM Sagirdler)
BEGIN
    INSERT INTO Sagirdler (Nomresi, Adi, Soyadi, Sinifi) VALUES
    (10001, 'Elchin', 'Quliyev',   10),
    (10002, 'Aysel',  'Memmedova', 10),
    (10003, 'Tural',  'Hasanov',    9),
    (10004, 'Lamiya', 'Aliyeva',   11);
END
GO

IF NOT EXISTS (SELECT 1 FROM Imtahanlar)
BEGIN
    INSERT INTO Imtahanlar (DersKodu, SagirdNomresi, ImtahanTarixi, Qiymeti) VALUES
    ('RIY', 10001, '2026-01-15', 5),
    ('FIZ', 10001, '2026-01-20', 4),
    ('RIY', 10002, '2026-01-15', 5),
    ('AZD', 10003, '2026-01-18', 3);
END
GO

PRINT 'ImtahanDB database və cədvəllər uğurla yaradıldı.';
