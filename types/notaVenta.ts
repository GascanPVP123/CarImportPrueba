import { ClienteData, CotizacionItem, FacturaCabecera } from "./cotizacion";

export interface NotaVentaData {
  id: number;
  numero: string;
  cliente: ClienteData;
  cabecera: FacturaCabecera;
  items: CotizacionItem[];
  totalNeto: number;
  fechaEmision: string;
  horaEmision: string;
  dni?: string;
  razonSocial?: string;
                           
}

export interface DetalleNotaVenta {
  id?: number;
  productoId?: number;
  sku?: string;
  codigo?: string; // 👈 Agregado
  razonSocial?: string;
  descripcion?: string;
  cantidad: number;
  unidad?: string;
  precioUnitario: number;
  subtotal?: number;
  importe?: number; // 👈 Agregado
  
  // Objeto opcional cuando se recupera directamente desde la entidad JPA de Spring Boot
  producto?: { // 👈 Agregado
    id: number;
    nombre: string;
    codigoSku: string;
  };
}

export interface NotaVentaHistorial {
  id: number;
  numero?: string;
  numeroDocumento?: string;
  fechaEmision: string;
  total: number;
  estado: "EMITIDA" | "ANULADA";
  
  // Campos cuando la respuesta viene plana (DTO)
  clienteNombre?: string;
  clienteDocumento?: string;
  
  // Campos cuando la respuesta viene como entidad anidada
  cliente?: {
    id?: number;
    nombre?: string;
    numeroDocumento?: string;
    ruc?: string;
  };
  
  detalles: DetalleNotaVenta[];
}