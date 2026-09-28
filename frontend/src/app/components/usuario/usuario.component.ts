import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { RolService } from '../../services/rol.service';
import { Rol } from '../../models/rol.model';

/**
 * Componente CRUD de Usuario contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.component.html'
})
export class UsuarioComponent implements OnInit {

  usuarios: Usuario[] = [];
  roles: Rol[] = [];

  usuarioActual: Usuario = this.usuarioVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private usuarioService: UsuarioService,
    private http: HttpClient,
    private rolService: RolService
  ) { }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.rolService.listar().subscribe(data => this.roles = data);
  }

  usuarioVacio(): Usuario {
    return {
      nombreCompleto: '',
      username: '',
      password: '',
      email: '',
      rol: { id: 0 },
    };
  }

  cargarUsuarios(): void {
    this.usuarioService.listar().subscribe(data => this.usuarios = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.usuarioActual.id
      ? this.usuarioService.actualizar(this.usuarioActual.id, this.usuarioActual)
      : this.usuarioService.crear(this.usuarioActual);

    accion.subscribe({
      next: () => {
        this.cargarUsuarios();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Usuario): void {
    this.usuarioActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.usuarioService.eliminar(id).subscribe({
      next: () => this.cargarUsuarios(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.usuarioActual = this.usuarioVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Usuarios', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Usuario', 'Nombre completo', 'Email']],
      body: this.usuarios.map(item => [item.username, item.nombreCompleto, item.email]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('usuario.pdf');
  }
}
