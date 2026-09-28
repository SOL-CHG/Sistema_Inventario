export interface Producto {
  id?: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  precioCompra: number;
  precioVenta: number;
  stockActual: number;
  stockMinimo: number;
  unidadMedida?: string;
  estado?: boolean;
  categoria: { id: number };
  proveedor: { id: number };
}
