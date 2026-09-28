import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/categoria.model';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../models/proveedor.model';

/**
 * Componente CRUD de Productos contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html'
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];

  productoActual: Producto = this.productoVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private productoService: ProductoService,
    private http: HttpClient,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService
  ) { }

  ngOnInit(): void {
    this.cargarProductoss();
    this.categoriaService.listar().subscribe(data => this.categorias = data);
    this.proveedorService.listar().subscribe(data => this.proveedores = data);
  }

  productoVacio(): Producto {
    return {
      codigo: '',
      nombre: '',
      descripcion: '',
      precioCompra: 0,
      precioVenta: 0,
      stockActual: 0,
      stockMinimo: 0,
      categoria: { id: 0 },
      proveedor: { id: 0 },
    };
  }

  cargarProductoss(): void {
    this.productoService.listar().subscribe(data => this.productos = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.productoActual.id
      ? this.productoService.actualizar(this.productoActual.id, this.productoActual)
      : this.productoService.crear(this.productoActual);

    accion.subscribe({
      next: () => {
        this.cargarProductoss();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Producto): void {
    this.productoActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.productoService.eliminar(id).subscribe({
      next: () => this.cargarProductoss(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.productoActual = this.productoVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Productos', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Código', 'Nombre', 'Precio venta', 'Stock']],
      body: this.productos.map(item => [item.codigo, item.nombre, 'S/ ' + item.precioVenta, item.stockActual]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('productos.pdf');
  }
}
