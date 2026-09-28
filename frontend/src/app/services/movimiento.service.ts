import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MovimientoInventario } from '../models/movimiento.model';

/**
 * Servicio Angular que consume la API REST de MovimientoInventario (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class MovimientoInventarioService {

  private apiUrl = 'http://localhost:8080/api/movimientos';

  constructor(private http: HttpClient) { }

  listar(): Observable<MovimientoInventario[]> {
    return this.http.get<MovimientoInventario[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<MovimientoInventario> {
    return this.http.get<MovimientoInventario>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: MovimientoInventario): Observable<MovimientoInventario> {
    return this.http.post<MovimientoInventario>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: MovimientoInventario): Observable<MovimientoInventario> {
    return this.http.put<MovimientoInventario>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
