import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetalleCompra } from '../models/detalle-compra.model';

/**
 * Servicio Angular que consume la API REST de DetalleCompra (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class DetalleCompraService {

  private apiUrl = 'http://localhost:8080/api/detalle-compras';

  constructor(private http: HttpClient) { }

  listar(): Observable<DetalleCompra[]> {
    return this.http.get<DetalleCompra[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<DetalleCompra> {
    return this.http.get<DetalleCompra>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: DetalleCompra): Observable<DetalleCompra> {
    return this.http.post<DetalleCompra>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: DetalleCompra): Observable<DetalleCompra> {
    return this.http.put<DetalleCompra>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
