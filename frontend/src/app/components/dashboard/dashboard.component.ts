import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UsuarioSesion } from '../../services/auth.service';

import { ProductosComponent } from '../productos/productos.component';
import { CategoriaComponent } from '../categoria/categoria.component';
import { ProveedorComponent } from '../proveedor/proveedor.component';
import { AlmacenComponent } from '../almacen/almacen.component';
import { ClienteComponent } from '../cliente/cliente.component';
import { RolComponent } from '../rol/rol.component';
import { UsuarioComponent } from '../usuario/usuario.component';
import { CompraComponent } from '../compra/compra.component';
import { DetalleCompraComponent } from '../detalle-compra/detalle-compra.component';
import { VentaComponent } from '../venta/venta.component';
import { DetalleVentaComponent } from '../detalle-venta/detalle-venta.component';
import { MovimientoInventarioComponent } from '../movimiento/movimiento.component';

type Seccion =
  | 'productos' | 'categorias' | 'proveedores' | 'almacenes' | 'clientes'
  | 'roles' | 'usuarios' | 'compras' | 'detalle-compras' | 'ventas'
  | 'detalle-ventas' | 'movimientos';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ProductosComponent, CategoriaComponent, ProveedorComponent, AlmacenComponent,
    ClienteComponent, RolComponent, UsuarioComponent, CompraComponent,
    DetalleCompraComponent, VentaComponent, DetalleVentaComponent, MovimientoInventarioComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  usuario: UsuarioSesion | null;
  seccionActiva: Seccion = 'productos';

  menu: { id: Seccion; label: string }[] = [
    { id: 'productos', label: 'Productos' },
    { id: 'categorias', label: 'Categorías' },
    { id: 'proveedores', label: 'Proveedores' },
    { id: 'almacenes', label: 'Almacenes' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'compras', label: 'Compras' },
    { id: 'detalle-compras', label: 'Detalle de Compras' },
    { id: 'ventas', label: 'Ventas' },
    { id: 'detalle-ventas', label: 'Detalle de Ventas' },
    { id: 'movimientos', label: 'Movimientos' },
    { id: 'usuarios', label: 'Usuarios' },
    { id: 'roles', label: 'Roles' },
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = this.authService.getUsuario();
  }

  irA(seccion: Seccion): void {
    this.seccionActiva = seccion;
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
