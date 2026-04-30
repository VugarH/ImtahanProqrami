# İmtahan Proqramı

Məktəb şagirdlərinin imtahan nəticələrini idarə edən tətbiq.

## Texnologiyalar

- **Backend**: C# / .NET 10 Web API + Entity Framework Core
- **Frontend**: Angular 17 (standalone components) + TypeScript
- **Database**: Microsoft SQL Server

## Layihənin strukturu

```
ImtahanProqrami/
├── database/
│   └── 01_create_database.sql       # DB və test data skripti
├── backend/                          # .NET 10 Web API
│   ├── Controllers/                  # CRUD endpoint-ləri
│   ├── Models/                       # Entity siniflər (Ders, Sagird, Imtahan)
│   ├── Data/                         # EF DbContext
│   ├── DTOs/                         # Data transfer obyektləri
│   ├── Program.cs                    # Entry point
│   ├── appsettings.json              # Connection string
│   └── ImtahanApi.csproj
└── frontend/                         # Angular tətbiq
    ├── src/app/
    │   ├── components/
    │   │   ├── dersler/              # Dərslər səhifəsi
    │   │   ├── sagirdler/            # Şagirdlər səhifəsi
    │   │   └── imtahanlar/           # İmtahanlar səhifəsi
    │   ├── services/                 # HTTP servislər
    │   ├── models/                   # TypeScript interfeyslər
    │   ├── app.component.ts
    │   ├── app.routes.ts
    │   └── ...
    ├── package.json
    └── angular.json
```

---

## Tələb olunan proqramlar


| Proqram | Versiya | Yükləmə linki |
|---------|---------|---------------|
| .NET SDK | 10.0+ | https://dotnet.microsoft.com/download |
| Node.js | 18+ | https://nodejs.org |
| SQL Server | 2019+ (və ya Express) | https://www.microsoft.com/sql-server/sql-server-downloads |
| SSMS (opsional) | Son versiya | https://learn.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms |


---

## ADDIM 1: Database-i quraşdırmaq

1. SQL Server-i işə salın.
2. SSMS (SQL Server Management Studio) və ya `sqlcmd` ilə bağlanın.
3. `database/01_create_database.sql` faylını açıb sql serverde icra edin.


**`sqlcmd` ilə (terminal):**
```bash
sqlcmd -S localhost -E -i database/01_create_database.sql
```

Bu skript:
- `ImtahanDB` adında database yaradır
- `Dersler`, `Sagirdler`, `Imtahanlar` cədvəllərini yaradır
- Test üçün default məlumatlar əlavə edir

### Connection string konfiqurasiyası

`backend/appsettings.json` faylındakı connection string-i sizin SQL Server-ə uyğunlaşdırın:

```json
"DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=ImtahanDB;Trusted_Connection=True;TrustServerCertificate=True;"
```

---

## ADDIM 2: Backend-i işə salmaq

```bash
cd backend
dotnet restore
dotnet run
```

Backend `http://localhost:5000` ünvanında işə düşəcək.

Swagger UI: **http://localhost:5000/swagger**

API endpoint-ləri:
- `GET/POST/PUT/DELETE /api/dersler`
- `GET/POST/PUT/DELETE /api/sagirdler`
- `GET/POST/PUT/DELETE /api/imtahanlar`

---

## ADDIM 3: Frontend-i işə salmaq 

Yeni terminal açın:

```bash
cd frontend
npm install
npm start
```

Frontend `http://localhost:4200` ünvanında açılacaq. 
---
