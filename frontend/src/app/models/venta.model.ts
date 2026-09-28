export interface Venta {
  id?: number;
  fechaVenta: string;
  total: number;
  estado?: string;
  cliente: { id: number };
  usuario: { id: number };
}
