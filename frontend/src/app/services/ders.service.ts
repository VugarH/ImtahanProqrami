import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ders } from '../models/models';

@Injectable({ providedIn: 'root' })
export class DersService {
  private apiUrl = 'http://localhost:5000/api/dersler';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Ders[]> {
    return this.http.get<Ders[]>(this.apiUrl);
  }

  getByKod(kod: string): Observable<Ders> {
    return this.http.get<Ders>(`${this.apiUrl}/${kod}`);
  }

  create(ders: Ders): Observable<Ders> {
    return this.http.post<Ders>(this.apiUrl, ders);
  }

  update(kod: string, ders: Ders): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${kod}`, ders);
  }

  delete(kod: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${kod}`);
  }
}
