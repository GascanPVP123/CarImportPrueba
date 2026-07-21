export interface ClienteData {
  nombre: string;
  ruc: string;
  direccion: string;
  telefono: string;
}


export type TipoPrecio = "MENOR" | "MAYOR" | "LIBRE";
export interface CotizacionItem {
  item?: number;
  codigo: string;
  cantidad: number;
  unidad: string;
  descripcion: string;
  precioVenta: number;
  precioMenor?: number;
  precioMayor?: number;
  tipoPrecio?: TipoPrecio;
  importe: number;
  productoId?: number;
}

export interface CotizacionPDFProps {
  id: number;
  cliente: ClienteData;
  cabecera: FacturaCabecera;
  items: CotizacionItem[];
  fechaEmision: string;
  horaEmision: string;
}

export interface FacturaCabecera {
  fechaEmision: string;
  fechaVencimiento: string;
  condicionPago: string;
  moneda: string;
}