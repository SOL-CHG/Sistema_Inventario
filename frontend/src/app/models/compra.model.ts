export interface Compra {
  id?: number;
  fechaCompra: string;
  total: number;
  estado?: string;
  proveedor: { id: number };
  usuario: { id: number };
}
