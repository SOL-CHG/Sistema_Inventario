export interface DetalleVenta {
  id?: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  venta: { id: number };
  producto: { id: number };
}
