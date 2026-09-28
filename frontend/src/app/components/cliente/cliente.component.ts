import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Cliente } from '../../models/cliente.model';
import { ClienteService } from '../../services/cliente.service';

/**
 * Componente CRUD de Cliente contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cliente.component.html'
})
export class ClienteComponent implements OnInit {

  clientes: Cliente[] = [];

  clienteActual: Cliente = this.clienteVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private clienteService: ClienteService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.cargarClientes();
  }

  clienteVacio(): Cliente {
    return {
      numeroDocumento: '',
      nombres: '',
      telefono: '',
      email: '',
      direccion: '',
    };
  }

  cargarClientes(): void {
    this.clienteService.listar().subscribe(data => this.clientes = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.clienteActual.id
      ? this.clienteService.actualizar(this.clienteActual.id, this.clienteActual)
      : this.clienteService.crear(this.clienteActual);

    accion.subscribe({
      next: () => {
        this.cargarClientes();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Cliente): void {
    this.clienteActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.clienteService.eliminar(id).subscribe({
      next: () => this.cargarClientes(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.clienteActual = this.clienteVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Clientes', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Documento', 'Nombres', 'Teléfono', 'Email']],
      body: this.clientes.map(item => [item.numeroDocumento, item.nombres, item.telefono, item.email]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('cliente.pdf');
  }
}
