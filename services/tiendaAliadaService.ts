import { apiRequest } from "./api";

export interface TiendaAliada {
  id?: number;
  nombre: string;
  ruc?: string;
  direccion?: string;
  telefono?: string;
  contacto?: string;
  email?: string;
  observaciones?: string;
  activo?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const tiendaAliadaService = {
  listar: () => apiRequest<TiendaAliada[]>("/tiendas", { method: "GET" }),
  
  listarActivas: () => apiRequest<TiendaAliada[]>("/tiendas/activas", { method: "GET" }),
  
  obtener: (id: number) => apiRequest<TiendaAliada>(`/tiendas/${id}`, { method: "GET" }),
  
  guardar: (tienda: TiendaAliada) =>
    apiRequest<TiendaAliada>("/tiendas", {
      method: "POST",
      body: tienda,
    }),
  
  actualizar: (id: number, tienda: TiendaAliada) =>
    apiRequest<TiendaAliada>(`/tiendas/${id}`, {
      method: "PUT",
      body: tienda,
    }),
  
  eliminar: (id: number) =>
    apiRequest<void>(`/tiendas/${id}`, { method: "DELETE" }),
};