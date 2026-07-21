import { apiRequest } from "./api";
import { NotaVentaHistorial } from "../types/notaVenta";

export interface NotaVentaRequest {
  cotizacionId?: number; // Opcional por si se crea directo sin pasar por cotización
  clienteId: number;
  condicionPago: string;
  moneda: string;
  detalles: {
    productoId: number;
    cantidad: number;
    unidad: string;
    precioUnitario: number;
    descuento: number;
  }[];
}

export interface NotaVentaResponse {
  id: number;
  numero: string;
  total: number;
  estado: string;
}

export const notaVentaService = {
  /**
   * Registra una nueva Nota de Venta (Descuenta stock)
   */
  crearDesdeCotizacion: (data: NotaVentaRequest) =>
    apiRequest<NotaVentaResponse>("/notas-venta", {
      method: "POST",
      body: data,
    }),

  /**
   * Obtiene la lista completa de notas de venta registradas (Historial de Pedidos)
   */
  obtenerHistorial: () =>
    apiRequest<NotaVentaHistorial[]>("/notas-venta", {
      method: "GET",
    }),

  /**
   * Obtiene el detalle de una nota de venta por su ID
   */
  obtenerPorId: (id: number) =>
    apiRequest<NotaVentaHistorial>(`/notas-venta/${id}`, {
      method: "GET",
    }),

  /**
   * Anula una nota de venta (Restaura el stock previamente descontado)
   */
  anular: (id: number) =>
    apiRequest<void>(`/notas-venta/${id}/anular`, {
      method: "PUT",
    }),
};