import { apiRequest } from "./api";
import { Producto } from "./productoService";
import { TiendaAliada } from "./tiendaAliadaService";

export interface DetalleConsignacion {
  id?: number;
  producto: Producto;
  cantidadEnviada: number;
  cantidadVendida: number;
  cantidadDevuelta: number;
  precioUnitario: number;
  subtotal: number;
  devuelto: boolean;
  cantidadPendiente?: number;
  observaciones?: string;
}

export interface Consignacion {
  id?: number;
  numeroConsignacion?: string;
  tienda: TiendaAliada;
  fechaEnvio: string;
  fechaDevolucion?: string;
  estado: 'ENVIADA' | 'PARCIAL' | 'COMPLETADA' | 'DEVUELTA';
  observaciones?: string;
  valorTotal: number;
  valorVendido: number;
  valorDevuelto: number;
  detalles: DetalleConsignacion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ConsignacionRequest {
  tiendaId: number;
  fechaEnvio: string;
  observaciones?: string;
  detalles: {
    productoId: number;
    cantidad: number;
    precioUnitario: number;
  }[];
}

export interface VentaConsignacionRequest {
  fechaVenta: string;
  comisionPorcentaje?: number;
  observaciones?: string;
  detalles: {
    detalleConsignacionId: number;
    cantidad: number;
    precioUnitario?: number;
  }[];
}

export interface DevolucionConsignacionRequest {
  fechaDevolucion: string;
  motivo?: string;
  detalles: {
    detalleConsignacionId: number;
    cantidad: number;
  }[];
}

export const consignacionService = {
  listar: () => apiRequest<Consignacion[]>("/consignaciones", { method: "GET" }),
  
  listarActivas: () => apiRequest<Consignacion[]>("/consignaciones/activas", { method: "GET" }),
  
  obtener: (id: number) => apiRequest<Consignacion>(`/consignaciones/${id}`, { method: "GET" }),
  
  crear: (data: ConsignacionRequest) =>
    apiRequest<Consignacion>("/consignaciones", {
      method: "POST",
      body: data,
    }),
  
  registrarVenta: (id: number, data: VentaConsignacionRequest) =>
    apiRequest<Consignacion>(`/consignaciones/${id}/venta`, {
      method: "POST",
      body: data,
    }),
  
  registrarDevolucion: (id: number, data: DevolucionConsignacionRequest) =>
    apiRequest<Consignacion>(`/consignaciones/${id}/devolucion`, {
      method: "POST",
      body: data,
    }),
  
  eliminar: (id: number) =>
    apiRequest<void>(`/consignaciones/${id}`, { method: "DELETE" }),
};