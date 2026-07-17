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
}