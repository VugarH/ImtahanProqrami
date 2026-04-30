import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sagird } from '../models/models';

@Injectable({ providedIn: 'root' })
export class SagirdService {
  private apiUrl = 'http://localhost:5000/api/sagirdler';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sagird[]> {
    return this.http.get<Sagird[]>(this.apiUrl);
  }

  getByNomre(nomre: number): Observable<Sagird> {
    return this.http.get<Sagird>(`${this.apiUrl}/${nomre}`);
  }

  create(sagird: Sagird): Observable<Sagird> {
    return this.http.post<Sagird>(this.apiUrl, sagird);
  }

  update(nomre: number, sagird: Sagird): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${nomre}`, sagird);
  }

  delete(nomre: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${nomre}`);
  }
}
