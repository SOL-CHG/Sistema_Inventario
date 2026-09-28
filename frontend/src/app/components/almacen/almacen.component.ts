import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Almacen } from '../../models/almacen.model';
import { AlmacenService } from '../../services/almacen.service';

/**
 * Componente CRUD de Almacen contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-almacen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './almacen.component.html'
})
export class AlmacenComponent implements OnInit {

  almacens: Almacen[] = [];

  almacenActual: Almacen = this.almacenVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private almacenService: AlmacenService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.cargarAlmacens();
  }

  almacenVacio(): Almacen {
    return {
      nombre: '',
      ubicacion: '',
      encargado: '',
    };
  }

  cargarAlmacens(): void {
    this.almacenService.listar().subscribe(data => this.almacens = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.almacenActual.id
      ? this.almacenService.actualizar(this.almacenActual.id, this.almacenActual)
      : this.almacenService.crear(this.almacenActual);

    accion.subscribe({
      next: () => {
        this.cargarAlmacens();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Almacen): void {
    this.almacenActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.almacenService.eliminar(id).subscribe({
      next: () => this.cargarAlmacens(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.almacenActual = this.almacenVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Almacenes', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Nombre', 'Ubicación', 'Encargado']],
      body: this.almacens.map(item => [item.nombre, item.ubicacion, item.encargado]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('almacen.pdf');
  }
}
