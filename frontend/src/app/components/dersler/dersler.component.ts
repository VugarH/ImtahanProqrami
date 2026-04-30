import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ders } from '../../models/models';
import { DersService } from '../../services/ders.service';

@Component({
  selector: 'app-dersler',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Dərslərin idarə edilməsi</h1>

    <div class="card">
      <h2>{{ editMode ? 'Dərsi yenilə' : 'Yeni dərs əlavə et' }}</h2>
      <div class="form-row">
        <div>
          <label>Dərs kodu (3 simvol)</label>
          <input [(ngModel)]="ders.dersKodu" maxlength="3" [disabled]="editMode" placeholder="RIY">
        </div>
        <div>
          <label>Dərs adı</label>
          <input [(ngModel)]="ders.dersAdi" maxlength="30" placeholder="Riyaziyyat">
        </div>
        <div>
          <label>Sinif</label>
          <input type="number" [(ngModel)]="ders.sinifi" min="1" max="12">
        </div>
        <div>
          <label>Müəllim adı</label>
          <input [(ngModel)]="ders.muellimAdi" maxlength="20">
        </div>
        <div>
          <label>Müəllim soyadı</label>
          <input [(ngModel)]="ders.muellimSoyadi" maxlength="20">
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
      <h2>Mövcud dərslər ({{ dersler.length }})</h2>
      <table>
        <thead>
          <tr>
            <th>Kod</th>
            <th>Ad</th>
            <th>Sinif</th>
            <th>Müəllim</th>
            <th>Əməliyyat</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let d of dersler">
            <td>{{ d.dersKodu }}</td>
            <td>{{ d.dersAdi }}</td>
            <td>{{ d.sinifi }}</td>
            <td>{{ d.muellimAdi }} {{ d.muellimSoyadi }}</td>
            <td>
              <button class="btn-edit"   (click)="edit(d)">Düzəlt</button>
              <button class="btn-danger" (click)="remove(d.dersKodu)">Sil</button>
            </td>
          </tr>
          <tr *ngIf="dersler.length === 0">
            <td colspan="5" style="text-align:center;">Heç bir dərs tapılmadı.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class DerslerComponent implements OnInit {
  dersler: Ders[] = [];
  ders: Ders = this.empty();
  editMode = false;
  error = '';
  success = '';

  constructor(private service: DersService) {}

  ngOnInit(): void { this.load(); }

 load(): void {
  this.service.getAll().subscribe({
    next: data => this.dersler = data,
    error: (err: any) => this.error = 'Yüklənmə xətası: ' + err.message
  });
}

  save(): void {
  this.error = ''; this.success = '';

  if (!this.ders.dersKodu || this.ders.dersKodu.length !== 3) {
    this.error = 'Dərs kodu 3 simvoldan ibarət olmalıdır.'; return;
  }
  if (!this.ders.dersAdi || !this.ders.muellimAdi || !this.ders.muellimSoyadi) {
    this.error = 'Bütün xanaları doldurun.'; return;
  }

  if (this.editMode) {
    this.service.update(this.ders.dersKodu, this.ders).subscribe({
      next: () => {
        this.success = 'Dərs yeniləndi.';
        this.cancelEdit();
        this.load();
      },
      error: (err: any) => this.error = err.error || 'Əməliyyat baş tutmadı.'
    });
  } else {
    this.service.create(this.ders).subscribe({
      next: () => {
        this.success = 'Dərs əlavə edildi.';
        this.cancelEdit();
        this.load();
      },
      error: (err: any) => this.error = err.error || 'Əməliyyat baş tutmadı.'
    });
  }
}

  edit(d: Ders): void {
    this.ders = { ...d };
    this.editMode = true;
    this.error = ''; this.success = '';
  }

  remove(kod: string): void {
    if (!confirm(`'${kod}' kodlu dərsi silmək istədiyinizdən əminsiniz?`)) return;
    this.service.delete(kod).subscribe({
      next: () => { this.success = 'Dərs silindi.'; this.load(); },
      error: (err: any) => this.error = err.error || 'Silmək mümkün olmadı.'
    });
}

  cancelEdit(): void {
    this.ders = this.empty();
    this.editMode = false;
  }

  private empty(): Ders {
    return { dersKodu: '', dersAdi: '', sinifi: 1, muellimAdi: '', muellimSoyadi: '' };
  }
}
