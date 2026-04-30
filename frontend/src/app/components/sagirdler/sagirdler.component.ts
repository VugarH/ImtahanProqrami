import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Sagird } from '../../models/models';
import { SagirdService } from '../../services/sagird.service';

@Component({
  selector: 'app-sagirdler',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Şagirdlərin idarə edilməsi</h1>

    <div class="card">
      <h2>{{ editMode ? 'Şagirdi yenilə' : 'Yeni şagird əlavə et' }}</h2>
      <div class="form-row">
        <div>
          <label>Şagird nömrəsi</label>
          <input type="number" [(ngModel)]="sagird.nomresi" [disabled]="editMode" min="1" max="99999">
        </div>
        <div>
          <label>Adı</label>
          <input [(ngModel)]="sagird.adi" maxlength="30">
        </div>
        <div>
          <label>Soyadı</label>
          <input [(ngModel)]="sagird.soyadi" maxlength="30">
        </div>
        <div>
          <label>Sinifi</label>
          <input type="number" [(ngModel)]="sagird.sinifi" min="1" max="11">
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
      <h2>Mövcud şagirdlər ({{ sagirdler.length }})</h2>
      <table>
        <thead>
          <tr>
            <th>Nömrə</th>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Sinif</th>
            <th>Əməliyyat</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let s of sagirdler">
            <td>{{ s.nomresi }}</td>
            <td>{{ s.adi }}</td>
            <td>{{ s.soyadi }}</td>
            <td>{{ s.sinifi }}</td>
            <td>
              <button class="btn-edit"   (click)="edit(s)">Düzəlt</button>
              <button class="btn-danger" (click)="remove(s.nomresi)">Sil</button>
            </td>
          </tr>
          <tr *ngIf="sagirdler.length === 0">
            <td colspan="5" style="text-align:center;">Heç bir şagird tapılmadı.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class SagirdlerComponent implements OnInit {
  sagirdler: Sagird[] = [];
  sagird: Sagird = this.empty();
  editMode = false;
  error = '';
  success = '';

  constructor(private service: SagirdService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.service.getAll().subscribe({
      next: data => this.sagirdler = data,
      error: (err: any) => this.error = 'Yüklənmə xətası: ' + err.message
    });
  }

  save(): void {
  this.error = ''; this.success = '';

  // Şagird nömrəsi məcburi 5 rəqəmli olmalıdır (10000 - 99999 aralığı)
  if (!this.sagird.nomresi) {
    this.error = 'Şagird nömrəsi daxil edin.'; return;
  }
  if (!Number.isInteger(this.sagird.nomresi)) {
    this.error = 'Şagird nömrəsi tam ədəd olmalıdır.'; return;
  }
  if (this.sagird.nomresi < 10000 || this.sagird.nomresi > 99999) {
    this.error = 'Şagird nömrəsi 5 rəqəmli olmalıdır (10000 - 99999 arası).'; return;
  }

  if (!this.sagird.adi || !this.sagird.adi.trim()) {
    this.error = 'Şagirdin adını daxil edin.'; return;
  }
  if (!this.sagird.soyadi || !this.sagird.soyadi.trim()) {
    this.error = 'Şagirdin soyadını daxil edin.'; return;
  }
  if (!this.sagird.sinifi || this.sagird.sinifi < 1 || this.sagird.sinifi > 11) {
    this.error = 'Sinif 1 ilə 11 arasında olmalıdır.'; return;
  }

  if (this.editMode) {
    this.service.update(this.sagird.nomresi, this.sagird).subscribe({
      next: () => {
        this.success = 'Şagird yeniləndi.';
        this.cancelEdit();
        this.load();
      },
      error: (err: any) => this.error = err.error || 'Əməliyyat baş tutmadı.'
    });
  } else {
    this.service.create(this.sagird).subscribe({
      next: () => {
        this.success = 'Şagird əlavə edildi.';
        this.cancelEdit();
        this.load();
      },
      error: (err: any) => this.error = err.error || 'Əməliyyat baş tutmadı.'
    });
  }
}

  edit(s: Sagird): void {
    this.sagird = { ...s };
    this.editMode = true;
    this.error = ''; this.success = '';
  }

  remove(nomre: number): void {
    if (!confirm(`'${nomre}' nömrəli şagirdi silmək istədiyinizdən əminsiniz?`)) return;
    this.service.delete(nomre).subscribe({
      next: () => { this.success = 'Şagird silindi.'; this.load(); },
      error: (err: any) => this.error = err.error || 'Silmək mümkün olmadı.'
    });
  }

  cancelEdit(): void {
    this.sagird = this.empty();
    this.editMode = false;
  }

  private empty(): Sagird {
    return { nomresi: 0, adi: '', soyadi: '', sinifi: 1 };
  }
}
