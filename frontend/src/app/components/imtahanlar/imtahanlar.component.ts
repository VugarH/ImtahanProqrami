import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { Ders, Imtahan, ImtahanCreate, Sagird } from '../../models/models';
import { ImtahanService } from '../../services/imtahan.service';
import { DersService } from '../../services/ders.service';
import { SagirdService } from '../../services/sagird.service';

@Component({
  selector: 'app-imtahanlar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>İmtahanların idarə edilməsi</h1>

    <div class="card">
      <h2>{{ editMode ? 'İmtahanı yenilə' : 'Yeni imtahan əlavə et' }}</h2>
      <div class="form-row">
        <div>
          <label>Dərs</label>
          <select [(ngModel)]="form.dersKodu">
            <option value="">-- seçin --</option>
            <option *ngFor="let d of dersler" [value]="d.dersKodu">
              {{ d.dersKodu }} - {{ d.dersAdi }}
            </option>
          </select>
        </div>
        <div>
          <label>Şagird</label>
          <select [(ngModel)]="form.sagirdNomresi">
            <option [ngValue]="0">-- seçin --</option>
            <option *ngFor="let s of sagirdler" [ngValue]="s.nomresi">
              {{ s.nomresi }} - {{ s.adi }} {{ s.soyadi }}
            </option>
          </select>
        </div>
        <div>
          <label>İmtahan tarixi</label>
          <input type="date" [(ngModel)]="form.imtahanTarixi">
        </div>
        <div>
          <label>Qiymət (1-10)</label>
          <input type="number" [(ngModel)]="form.qiymeti" min="1" max="10">
        </div>
      </div>
      <button class="btn-primary" (click)="save()">
        {{ editMode ? 'Yenilə' : 'Əlavə et' }}
      </button>
      <button *ngIf="editMode" (click)="cancelEdit()">Ləğv et</button>
      <p class="error" *ngIf="error">{{ error }}</p>
      <p class="success" *ngIf="success">{{ success }}</p>
    </div>

    <div class="card">
      <h2>Mövcud imtahanlar ({{ imtahanlar.length }})</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Dərs</th>
            <th>Şagird</th>
            <th>Tarix</th>
            <th>Qiymət</th>
            <th>Əməliyyat</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let i of imtahanlar">
            <td>{{ i.id }}</td>
            <td>{{ i.dersKodu }} - {{ i.dersAdi }}</td>
            <td>{{ i.sagirdNomresi }} - {{ i.sagirdAdi }} {{ i.sagirdSoyadi }}</td>
            <td>{{ i.imtahanTarixi | date: 'dd.MM.yyyy' }}</td>
            <td><strong>{{ i.qiymeti }}</strong></td>
            <td>
              <button class="btn-edit"   (click)="edit(i)">Düzəlt</button>
              <button class="btn-danger" (click)="remove(i.id)">Sil</button>
            </td>
          </tr>
          <tr *ngIf="imtahanlar.length === 0">
            <td colspan="6" style="text-align:center;">Heç bir imtahan tapılmadı.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class ImtahanlarComponent implements OnInit {
  imtahanlar: Imtahan[] = [];
  dersler: Ders[] = [];
  sagirdler: Sagird[] = [];

  form: ImtahanCreate = this.empty();
  editingId: number | null = null;
  editMode = false;
  error = '';
  success = '';

  constructor(
    private imtahanService: ImtahanService,
    private dersService: DersService,
    private sagirdService: SagirdService
  ) {}

  ngOnInit(): void {
    forkJoin({
      dersler:   this.dersService.getAll(),
      sagirdler: this.sagirdService.getAll()
    }).subscribe({
      next: ({ dersler, sagirdler }) => {
        this.dersler = dersler;
        this.sagirdler = sagirdler;
        this.loadImtahanlar();
      },
      error: err => this.error = 'Yüklənmə xətası: ' + err.message
    });
  }

  loadImtahanlar(): void {
    this.imtahanService.getAll().subscribe({
      next: data => this.imtahanlar = data,
      error: err => this.error = 'İmtahanların yüklənməsi xətası: ' + err.message
    });
  }

  save(): void {
    this.error = ''; this.success = '';

    if (!this.form.dersKodu) { this.error = 'Dərs seçin.'; return; }
    if (!this.form.sagirdNomresi) { this.error = 'Şagird seçin.'; return; }
    if (!this.form.imtahanTarixi) { this.error = 'Tarix daxil edin.'; return; }
    if (this.form.qiymeti < 1 || this.form.qiymeti > 10) {
      this.error = 'Qiymət 1 ilə 10 arasında olmalıdır.'; return;
    }

    if (this.editMode && this.editingId) {
      this.imtahanService.update(this.editingId, this.form).subscribe({
        next: () => {
          this.success = 'İmtahan yeniləndi.';
          this.cancelEdit();
          this.loadImtahanlar();
        },
        error: (err: any) => this.error = err.error || 'Əməliyyat baş tutmadı.'
      });
    } else {
      this.imtahanService.create(this.form).subscribe({
        next: () => {
          this.success = 'İmtahan əlavə edildi.';
          this.cancelEdit();
          this.loadImtahanlar();
        },
        error: (err: any) => this.error = err.error || 'Əməliyyat baş tutmadı.'
      });
    }
  }

  edit(i: Imtahan): void {
    this.form = {
      dersKodu: i.dersKodu,
      sagirdNomresi: i.sagirdNomresi,
      imtahanTarixi: i.imtahanTarixi.substring(0, 10),
      qiymeti: i.qiymeti
    };
    this.editingId = i.id;
    this.editMode = true;
    this.error = ''; this.success = '';
  }

  remove(id: number): void {
    if (!confirm(`#${id} nömrəli imtahanı silmək istədiyinizdən əminsiniz?`)) return;
    this.imtahanService.delete(id).subscribe({
      next: () => { this.success = 'İmtahan silindi.'; this.loadImtahanlar(); },
      error: err => this.error = err.error || 'Silmək mümkün olmadı.'
    });
  }

  cancelEdit(): void {
    this.form = this.empty();
    this.editingId = null;
    this.editMode = false;
  }

  private empty(): ImtahanCreate {
    return {
      dersKodu: '',
      sagirdNomresi: 0,
      imtahanTarixi: new Date().toISOString().substring(0, 10),
      qiymeti: 3
    };
  }
}
