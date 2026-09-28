import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Compra } from '../../models/compra.model';
import { CompraService } from '../../services/compra.service';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../models/proveedor.model';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

/**
 * Componente CRUD de Compra contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compra.component.html'
})
export class CompraComponent implements OnInit {

  compras: Compra[] = [];
  proveedores: Proveedor[] = [];
  usuarios: Usuario[] = [];

  compraActual: Compra = this.compraVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private compraService: CompraService,
    private http: HttpClient,
    private proveedorService: ProveedorService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.cargarCompras();
    this.proveedorService.listar().subscribe(data => this.proveedores = data);
    this.usuarioService.listar().subscribe(data => this.usuarios = data);
  }

  compraVacio(): Compra {
    return {
      fechaCompra: '',
      total: 0,
      estado: '',
      proveedor: { id: 0 },
      usuario: { id: 0 },
    };
  }

  cargarCompras(): void {
    this.compraService.listar().subscribe(data => this.compras = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.compraActual.id
      ? this.compraService.actualizar(this.compraActual.id, this.compraActual)
      : this.compraService.crear(this.compraActual);

    accion.subscribe({
      next: () => {
        this.cargarCompras();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Compra): void {
    this.compraActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.compraService.eliminar(id).subscribe({
      next: () => this.cargarCompras(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.compraActual = this.compraVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Compras', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Fecha', 'Total', 'Estado']],
      body: this.compras.map(item => [item.fechaCompra, 'S/ ' + item.total, item.estado]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('compra.pdf');
  }
}
