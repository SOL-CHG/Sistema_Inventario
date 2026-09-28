export interface MovimientoInventario {
  id?: number;
  tipoMovimiento: string;
  cantidad: number;
  fechaMovimiento?: string;
  motivo?: string;
  producto: { id: number };
  almacen: { id: number };
  usuario: { id: number };
}
