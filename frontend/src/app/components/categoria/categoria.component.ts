import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Categoria } from '../../models/categoria.model';
import { CategoriaService } from '../../services/categoria.service';

/**
 * Componente CRUD de Categoria contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categoria.component.html'
})
export class CategoriaComponent implements OnInit {

  categorias: Categoria[] = [];

  categoriaActual: Categoria = this.categoriaVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private categoriaService: CategoriaService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.cargarCategorias();
  }

  categoriaVacio(): Categoria {
    return {
      nombre: '',
      descripcion: '',
    };
  }

  cargarCategorias(): void {
    this.categoriaService.listar().subscribe(data => this.categorias = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.categoriaActual.id
      ? this.categoriaService.actualizar(this.categoriaActual.id, this.categoriaActual)
      : this.categoriaService.crear(this.categoriaActual);

    accion.subscribe({
      next: () => {
        this.cargarCategorias();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Categoria): void {
    this.categoriaActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.categoriaService.eliminar(id).subscribe({
      next: () => this.cargarCategorias(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.categoriaActual = this.categoriaVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Categorías', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['ID', 'Nombre', 'Descripción']],
      body: this.categorias.map(item => [item.id, item.nombre, item.descripcion]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('categoria.pdf');
  }
}
