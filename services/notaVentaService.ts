import { apiRequest } from "./api";

export interface NotaVentaRequest {
  cotizacionId: number;
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
  crearDesdeCotizacion: (data: NotaVentaRequest) =>
    apiRequest<NotaVentaResponse>("/notas-venta", {
      method: "POST",
      body: data,
    }),
};