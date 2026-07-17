import { apiRequest } from "./api";

export interface Producto {
  id?: number;
  codigoSku: string;
  nombre: string;
  descripcion?: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  stockMinimo: number;
  unidadMedida?: string;
  importadora?: {
    id: number;
    razonSocial: string;
  } | null;
  proveedor?: {
    id: number;
    nombreEmpresa: string;
  } | null;
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