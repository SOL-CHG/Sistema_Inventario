import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DetalleCompra } from '../../models/detalle-compra.model';
import { DetalleCompraService } from '../../services/detalle-compra.service';
import { CompraService } from '../../services/compra.service';
import { Compra } from '../../models/compra.model';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

/**
 * Componente CRUD de DetalleCompra contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-detalle-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-compra.component.html'
})
export class DetalleCompraComponent implements OnInit {

  detalleCompras: DetalleCompra[] = [];
  compras: Compra[] = [];
  productos: Producto[] = [];

  detalleCompraActual: DetalleCompra = this.detalleCompraVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private detalleCompraService: DetalleCompraService,
    private http: HttpClient,
    private compraService: CompraService,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.cargarDetalleCompras();
    this.compraService.listar().subscribe(data => this.compras = data);
    this.productoService.listar().subscribe(data => this.productos = data);
  }

  detalleCompraVacio(): DetalleCompra {
    return {
      cantidad: 0,
      precioUnitario: 0,
      subtotal: 0,
      compra: { id: 0 },
      producto: { id: 0 },
    };
  }

  cargarDetalleCompras(): void {
    this.detalleCompraService.listar().subscribe(data => this.detalleCompras = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.detalleCompraActual.id
      ? this.detalleCompraService.actualizar(this.detalleCompraActual.id, this.detalleCompraActual)
      : this.detalleCompraService.crear(this.detalleCompraActual);

    accion.subscribe({
      next: () => {
        this.cargarDetalleCompras();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: DetalleCompra): void {
    this.detalleCompraActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.detalleCompraService.eliminar(id).subscribe({
      next: () => this.cargarDetalleCompras(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.detalleCompraActual = this.detalleCompraVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Detalle de Compras', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Cantidad', 'Precio unit.', 'Subtotal']],
      body: this.detalleCompras.map(item => [item.cantidad, 'S/ ' + item.precioUnitario, 'S/ ' + item.subtotal]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('detalle-compra.pdf');
  }
}
