import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra } from '../models/compra.model';

/**
 * Servicio Angular que consume la API REST de Compra (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class CompraService {

  private apiUrl = 'http://localhost:8080/api/compras';

  constructor(private http: HttpClient) { }

  listar(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: Compra): Observable<Compra> {
    return this.http.post<Compra>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: Compra): Observable<Compra> {
    return this.http.put<Compra>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
