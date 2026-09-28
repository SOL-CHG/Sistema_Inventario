import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { MovimientoInventario } from '../../models/movimiento.model';
import { MovimientoInventarioService } from '../../services/movimiento.service';
import { ProductoService } from '../../services/producto.service';
import { Producto } from '../../models/producto.model';
import { AlmacenService } from '../../services/almacen.service';
import { Almacen } from '../../models/almacen.model';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

/**
 * Componente CRUD de MovimientoInventario contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-movimiento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movimiento.component.html'
})
export class MovimientoInventarioComponent implements OnInit {

  movimientos: MovimientoInventario[] = [];
  productos: Producto[] = [];
  almacenes: Almacen[] = [];
  usuarios: Usuario[] = [];

  movimientoActual: MovimientoInventario = this.movimientoVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private movimientoService: MovimientoInventarioService,
    private http: HttpClient,
    private productoService: ProductoService,
    private almacenService: AlmacenService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.cargarMovimientoInventarios();
    this.productoService.listar().subscribe(data => this.productos = data);
    this.almacenService.listar().subscribe(data => this.almacenes = data);
    this.usuarioService.listar().subscribe(data => this.usuarios = data);
  }

  movimientoVacio(): MovimientoInventario {
    return {
      tipoMovimiento: '',
      cantidad: 0,
      fechaMovimiento: '',
      motivo: '',
      producto: { id: 0 },
      almacen: { id: 0 },
      usuario: { id: 0 },
    };
  }

  cargarMovimientoInventarios(): void {
    this.movimientoService.listar().subscribe(data => this.movimientos = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.movimientoActual.id
      ? this.movimientoService.actualizar(this.movimientoActual.id, this.movimientoActual)
      : this.movimientoService.crear(this.movimientoActual);

    accion.subscribe({
      next: () => {
        this.cargarMovimientoInventarios();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: MovimientoInventario): void {
    this.movimientoActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.movimientoService.eliminar(id).subscribe({
      next: () => this.cargarMovimientoInventarios(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.movimientoActual = this.movimientoVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Movimientos de Inventario', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Tipo', 'Cantidad', 'Fecha', 'Motivo']],
      body: this.movimientos.map(item => [item.tipoMovimiento, item.cantidad, item.fechaMovimiento, item.motivo]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('movimiento.pdf');
  }
}
