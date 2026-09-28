import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Almacen } from '../models/almacen.model';

/**
 * Servicio Angular que consume la API REST de Almacen (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  private apiUrl = 'http://localhost:8080/api/almacenes';

  constructor(private http: HttpClient) { }

  listar(): Observable<Almacen[]> {
    return this.http.get<Almacen[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Almacen> {
    return this.http.get<Almacen>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: Almacen): Observable<Almacen> {
    return this.http.post<Almacen>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: Almacen): Observable<Almacen> {
    return this.http.put<Almacen>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
