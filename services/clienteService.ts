import { apiRequest } from "./api";

export interface Cliente {
  id?: number;
  nombre: string;
  documento: string;
  direccion: string;
  telefono: string;
  email?: string | null;
}

export const clienteService = {
  listar: () => apiRequest<Cliente[]>("/clientes", { method: "GET" }),

  obtener: (id: number) => apiRequest<Cliente>(`/clientes/${id}`, { method: "GET" }),

  guardar: (cliente: Cliente) =>
    apiRequest<Cliente>("/clientes", {
      method: "POST",
      body: cliente,
    }),

  actualizar: (id: number, cliente: Cliente) =>
    apiRequest<Cliente>(`/clientes/${id}`, {
      method: "PUT",
      body: cliente,
    }),

  eliminar: (id: number) =>
    apiRequest<void>(`/clientes/${id}`, { method: "DELETE" }),

  crearRapido: (cliente: Omit<Cliente, "id">) =>
  apiRequest<Cliente>("/clientes", {
    method: "POST",
    body: cliente,
  }),
};