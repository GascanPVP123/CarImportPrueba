import { apiRequest } from "./api";
import { Importadora } from "./importadoraService";

export interface Producto {
  id?: number;
  codigoSku: string;
  nombre: string;
  descripcion?: string;
  stock: number;
  precioMenor: number;
  precioMayor?: number;
  precioVenta?: number; // Para retrocompatibilidad
  unidadMedida?: string;
  importadora?: Importadora | null;
  importadoraId?: number | null;
}
export const productoService = {
  
  listar: () => apiRequest<Producto[]>("/productos", { method: "GET" }),

  obtener: (id: number) => apiRequest<Producto>(`/productos/${id}`, { method: "GET" }),

  listarStockBajo: () => apiRequest<Producto[]>("/productos/stock-bajo", { method: "GET" }),

  guardar: (producto: Producto) =>
    apiRequest<Producto>("/productos", {
      method: "POST",
      body: producto,
    }),

  actualizar: (id: number, producto: Producto) =>
    apiRequest<Producto>(`/productos/${id}`, {
      method: "PUT",
      body: producto,
    }),

  eliminar: (id: number) =>
    apiRequest<void>(`/productos/${id}`, { method: "DELETE" }),
};