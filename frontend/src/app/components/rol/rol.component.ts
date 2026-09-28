import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Rol } from '../../models/rol.model';
import { RolService } from '../../services/rol.service';

/**
 * Componente CRUD de Rol contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rol.component.html'
})
export class RolComponent implements OnInit {

  rols: Rol[] = [];

  rolActual: Rol = this.rolVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private rolService: RolService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.cargarRols();
  }

  rolVacio(): Rol {
    return {
      nombre: '',
      descripcion: '',
    };
  }

  cargarRols(): void {
    this.rolService.listar().subscribe(data => this.rols = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.rolActual.id
      ? this.rolService.actualizar(this.rolActual.id, this.rolActual)
      : this.rolService.crear(this.rolActual);

    accion.subscribe({
      next: () => {
        this.cargarRols();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Rol): void {
    this.rolActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.rolService.eliminar(id).subscribe({
      next: () => this.cargarRols(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.rolActual = this.rolVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Roles', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['ID', 'Nombre', 'Descripción']],
      body: this.rols.map(item => [item.id, item.nombre, item.descripcion]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('rol.pdf');
  }
}
