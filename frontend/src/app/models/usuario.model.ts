export interface Usuario {
  id?: number;
  nombreCompleto: string;
  username: string;
  password: string;
  email?: string;
  activo?: boolean;
  fechaRegistro?: string;
  rol: { id: number };
}
