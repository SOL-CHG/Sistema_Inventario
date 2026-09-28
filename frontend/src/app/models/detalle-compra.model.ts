export interface DetalleCompra {
  id?: number;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  compra: { id: number };
  producto: { id: number };
}
