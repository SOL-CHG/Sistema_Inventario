import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Proveedor } from '../../models/proveedor.model';
import { ProveedorService } from '../../services/proveedor.service';

/**
 * Componente CRUD de Proveedor contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-proveedor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedor.component.html'
})
export class ProveedorComponent implements OnInit {

  proveedors: Proveedor[] = [];

  proveedorActual: Proveedor = this.proveedorVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private proveedorService: ProveedorService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.cargarProveedors();
  }

  proveedorVacio(): Proveedor {
    return {
      ruc: '',
      razonSocial: '',
      telefono: '',
      email: '',
      direccion: '',
    };
  }

  cargarProveedors(): void {
    this.proveedorService.listar().subscribe(data => this.proveedors = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.proveedorActual.id
      ? this.proveedorService.actualizar(this.proveedorActual.id, this.proveedorActual)
      : this.proveedorService.crear(this.proveedorActual);

    accion.subscribe({
      next: () => {
        this.cargarProveedors();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Proveedor): void {
    this.proveedorActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.proveedorService.eliminar(id).subscribe({
      next: () => this.cargarProveedors(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.proveedorActual = this.proveedorVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Proveedores', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['RUC', 'Razón social', 'Teléfono', 'Email']],
      body: this.proveedors.map(item => [item.ruc, item.razonSocial, item.telefono, item.email]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('proveedor.pdf');
  }
}
