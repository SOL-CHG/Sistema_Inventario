import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface UsuarioSesion {
  idUsuario: number;
  nombreCompleto: string;
  username: string;
  rolNombre: string;
}

/**
 * Servicio de autenticacion. Llama a POST /api/auth/login (JSON) y,
 * si es correcto, guarda los datos del usuario en localStorage para
 * mantener la sesion mientras el navegador siga abierto.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';
  private storageKey = 'usuarioActual';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<UsuarioSesion> {
    return this.http.post<UsuarioSesion>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(usuario => localStorage.setItem(this.storageKey, JSON.stringify(usuario)))
      );
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(): boolean {
    return this.getUsuario() !== null;
  }

  getUsuario(): UsuarioSesion | null {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }
}
