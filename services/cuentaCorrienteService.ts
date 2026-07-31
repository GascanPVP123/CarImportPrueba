import { apiRequest } from "./api";
import { TiendaAliada } from "./tiendaAliadaService";

export interface CuentaCorriente {
  id?: number;
  tienda: TiendaAliada;
  tipo: 'DEBITO' | 'CREDITO';
  origen: 'CONSIGNACION_VENTA' | 'CONSIGNACION_COMISION' | 'CONSIGNACION_DEVOLUCION' | 'VENTA_DIRECTA' | 'COMPRA' | 'PAGO_RECIBIDO' | 'GASTO_COMPARTIDO' | 'AJUSTE' | 'OTRO';
  concepto: string;
  consignacion?: {
    id: number;
    numeroConsignacion: string;
  };
  monto: number;
  fecha: string;
  referencia?: string;
  observaciones?: string;
  usuario?: {
    id: number;
    username: string;
  };
  createdAt?: string;
}

export interface SaldoTienda {
  tiendaId: number;
  tiendaNombre: string;
  telefono?: string;
  totalDebe: number;
  totalHaber: number;
  saldoNeto: number;
  estadoSaldo: 'FAVOR_TUYO' | 'FAVOR_TIENDA' | 'BALANCEADO';
}

export interface ResumenCuentas {
  totalDebe: number;
  totalHaber: number;
  saldoNeto: number;
  totalTiendas: number;
}

export interface MovimientoRequest {
  tiendaId: number;
  tipo: 'DEBITO' | 'CREDITO';
  origen: string;
  concepto: string;
  monto: number;
  fecha: string;
  referencia?: string;
  observaciones?: string;
}

export const cuentaCorrienteService = {
  // Saldos
  obtenerSaldos: () => 
    apiRequest<SaldoTienda[]>("/cuentas-corrientes/saldos", { method: "GET" }),

  obtenerSaldoPorTienda: (tiendaId: number) => 
    apiRequest<SaldoTienda>(`/cuentas-corrientes/saldos/${tiendaId}`, { method: "GET" }),

  obtenerResumen: () => 
    apiRequest<ResumenCuentas>("/cuentas-corrientes/resumen", { method: "GET" }),

  // Movimientos
  obtenerMovimientos: (tiendaId: number) => 
    apiRequest<CuentaCorriente[]>(`/cuentas-corrientes/movimientos/${tiendaId}`, { method: "GET" }),

  crearMovimiento: (data: MovimientoRequest) => 
    apiRequest<CuentaCorriente>("/cuentas-corrientes/movimientos", {
      method: "POST",
      body: data,
    }),
};