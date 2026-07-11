import { apiRequest } from "./api";

export interface CotizacionRequest {
  clienteId: number;
  fechaVencimiento: string;
  condicionPago: string;
  moneda: string;
  observaciones?: string;
  detalles: {
    productoId: number;
    cantidad: number;
    unidad: string;
    precioUnitario: number;
    descuento: number;
  }[];
}

export interface CotizacionResponse {
  id: number;
  numero: string;
  cliente: {
    id: number;
    nombre: string;
    documento: string;
  };
  usuario: {
    id: number;
    username: string;
  };
  fechaEmision: string;
  fechaVencimiento: string;
  condicionPago: string;
  moneda: string;
  subtotal: number;
  descuento: number;
  igv: number;
  total: number;
  estado: string;
  observaciones: string;
  detalles: {
    id: number;
    producto: {
      id: number;
      codigoSku: string;
      nombre: string;
    };
    codigo: string;
    descripcion: string;
    cantidad: number;
    unidad: string;
    precioUnitario: number;
    descuento: number;
    importe: number;
  }[];
}

export const cotizacionService = {
  listar: () => apiRequest<CotizacionResponse[]>("/cotizaciones", { method: "GET" }),

  obtener: (id: number) =>
    apiRequest<CotizacionResponse>(`/cotizaciones/${id}`, { method: "GET" }),

  guardar: (data: CotizacionRequest) =>
    apiRequest<CotizacionResponse>("/cotizaciones", {
      method: "POST",
      body: data,
    }),

  actualizar: (id: number, data: CotizacionRequest) =>
    apiRequest<CotizacionResponse>(`/cotizaciones/${id}`, {
      method: "PUT",
      body: data,
    }),

  cambiarEstado: (id: number, estado: string) =>
    apiRequest<CotizacionResponse>(`/cotizaciones/${id}/estado?estado=${estado}`, {
      method: "PUT",
    }),

  duplicar: (id: number) =>
    apiRequest<CotizacionResponse>(`/cotizaciones/${id}/duplicar`, {
      method: "POST",
    }),

  convertirAPedido: (id: number) =>
    apiRequest<{ pedidoId: number }>(`/cotizaciones/${id}/convertir`, {
      method: "POST",
    }),

  eliminar: (id: number) =>
    apiRequest<void>(`/cotizaciones/${id}`, { method: "DELETE" }),
};