import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColaboradorService {

  private apiUrl = 'http://localhost:3000/api/colaborador';

  constructor(private http: HttpClient) { }

  getColaboradores(page: number, limit: number) {
    return this.http.get<any>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  createColaborador(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateColaborador(id: number, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteColaborador(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
