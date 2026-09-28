import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DetalleVenta } from '../../models/detalle-venta.model';
import { DetalleVentaService } from '../../services/detalle-venta.service';
import { VentaService } from '../../services/venta.service';
import { Venta } from '../../models/venta.model';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';

/**
 * Componente CRUD de DetalleVenta contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-detalle-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-venta.component.html'
})
export class DetalleVentaComponent implements OnInit {

  detalleVentas: DetalleVenta[] = [];
  ventas: Venta[] = [];
  productos: Producto[] = [];

  detalleVentaActual: DetalleVenta = this.detalleVentaVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private detalleVentaService: DetalleVentaService,
    private http: HttpClient,
    private ventaService: VentaService,
    private productoService: ProductoService
  ) { }

  ngOnInit(): void {
    this.cargarDetalleVentas();
    this.ventaService.listar().subscribe(data => this.ventas = data);
    this.productoService.listar().subscribe(data => this.productos = data);
  }

  detalleVentaVacio(): DetalleVenta {
    return {
      cantidad: 0,
      precioUnitario: 0,
      subtotal: 0,
      venta: { id: 0 },
      producto: { id: 0 },
    };
  }

  cargarDetalleVentas(): void {
    this.detalleVentaService.listar().subscribe(data => this.detalleVentas = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.detalleVentaActual.id
      ? this.detalleVentaService.actualizar(this.detalleVentaActual.id, this.detalleVentaActual)
      : this.detalleVentaService.crear(this.detalleVentaActual);

    accion.subscribe({
      next: () => {
        this.cargarDetalleVentas();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: DetalleVenta): void {
    this.detalleVentaActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.detalleVentaService.eliminar(id).subscribe({
      next: () => this.cargarDetalleVentas(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.detalleVentaActual = this.detalleVentaVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Detalle de Ventas', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Cantidad', 'Precio unit.', 'Subtotal']],
      body: this.detalleVentas.map(item => [item.cantidad, 'S/ ' + item.precioUnitario, 'S/ ' + item.subtotal]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('detalle-venta.pdf');
  }
}
