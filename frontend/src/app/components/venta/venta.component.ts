import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Venta } from '../../models/venta.model';
import { VentaService } from '../../services/venta.service';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

/**
 * Componente CRUD de Venta contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './venta.component.html'
})
export class VentaComponent implements OnInit {

  ventas: Venta[] = [];
  clientes: Cliente[] = [];
  usuarios: Usuario[] = [];

  ventaActual: Venta = this.ventaVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private ventaService: VentaService,
    private http: HttpClient,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.cargarVentas();
    this.clienteService.listar().subscribe(data => this.clientes = data);
    this.usuarioService.listar().subscribe(data => this.usuarios = data);
  }

  ventaVacio(): Venta {
    return {
      fechaVenta: '',
      total: 0,
      estado: '',
      cliente: { id: 0 },
      usuario: { id: 0 },
    };
  }

  cargarVentas(): void {
    this.ventaService.listar().subscribe(data => this.ventas = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.ventaActual.id
      ? this.ventaService.actualizar(this.ventaActual.id, this.ventaActual)
      : this.ventaService.crear(this.ventaActual);

    accion.subscribe({
      next: () => {
        this.cargarVentas();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Venta): void {
    this.ventaActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.ventaService.eliminar(id).subscribe({
      next: () => this.cargarVentas(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.ventaActual = this.ventaVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Ventas', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Fecha', 'Total', 'Estado']],
      body: this.ventas.map(item => [item.fechaVenta, 'S/ ' + item.total, item.estado]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('venta.pdf');
  }
}
