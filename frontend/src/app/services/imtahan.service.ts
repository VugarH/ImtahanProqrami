import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Imtahan, ImtahanCreate } from '../models/models';

@Injectable({ providedIn: 'root' })
export class ImtahanService {
  private apiUrl = 'http://localhost:5000/api/imtahanlar';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Imtahan[]> {
    return this.http.get<Imtahan[]>(this.apiUrl);
  }

  getById(id: number): Observable<Imtahan> {
    return this.http.get<Imtahan>(`${this.apiUrl}/${id}`);
  }

  create(imtahan: ImtahanCreate): Observable<Imtahan> {
    return this.http.post<Imtahan>(this.apiUrl, imtahan);
  }

  update(id: number, imtahan: ImtahanCreate): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, imtahan);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
