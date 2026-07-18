"use client";

import React, { useEffect, useState } from "react";
import { productoService, Producto } from "@/services/productoService";
import { cotizacionService, CotizacionRequest } from "@/services/cotizacionService";
import { clienteService, Cliente } from "@/services/clienteService";
import { Plus, Trash2, FileText, User, ShoppingBag, Calendar } from "lucide-react";
import { ModalConfirmacion } from "@/components/modales/ModalConfirmacion";
import { ClienteData, CotizacionItem, FacturaCabecera } from "@/types/cotizacion";

// ============================================================
// INTERFACES
// ============================================================
interface CarritoItem {
  id: number;
  codigoSku: string;
  nombre: string;
  precioVenta: number;
  cantidad: number;
  stockDisponible: number;
  unidadMedida: string;
}

// ============================================================
// CONSTANTES
// ============================================================
const OPCIONES_UNIDAD = ["unidad", "par", "doc", "pack", "caja"] as const;
type Unidad = (typeof OPCIONES_UNIDAD)[number];

const OPCIONES_PAGO = ["CONTADO", "CREDITO_15", "CREDITO_30", "CREDITO_45"] as const;
const OPCIONES_MONEDA = ["SOLES", "USD"] as const;

const normalizarUnidad = (unidad: string | undefined): Unidad => {
  if (unidad && OPCIONES_UNIDAD.includes(unidad as Unidad)) return unidad as Unidad;
  const lower = unidad?.toLowerCase();
  if (lower === "unid" || lower === "pza" || lower === "pieza") return "unidad";
  if (lower === "par" || lower === "pares") return "par";
  if (lower === "docena" || lower === "doc") return "doc";
  if (lower === "pack" || lower === "paquete") return "pack";
  if (lower === "caja" || lower === "cajas") return "caja";
  return "unidad";
};

// ============================================================
// SUBCOMPONENTE: VISTA PREVIA
// ============================================================
const VistaPrevia: React.FC<{
  clienteNombre: string;
  clienteDocumento: string;
  clienteDireccion: string;
  clienteTelefono: string;
  cabecera: FacturaCabecera;
  carrito: CarritoItem[];
  totalNeto: number;
}> = ({ clienteNombre, clienteDocumento, clienteDireccion, clienteTelefono, cabecera, carrito, totalNeto }) => {
  return (
    <div className="bg-white border border-gray-200 shadow-sm overflow-hidden" style={{ aspectRatio: "1/1.414" }}>
      <div className="p-4 h-full flex flex-col text-[10px] leading-tight text-gray-800">
        <div className="flex items-start justify-between border-b border-gray-300 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-[8px] font-bold text-gray-500">LOGO</div>
            <div>
              <div className="font-bold text-xs text-gray-900">CAR IMPORT RAMOS & HUAMAN S.A.C.</div>
              <div className="text-[8px] text-gray-500">RUC 20123456789</div>
              <div className="text-[8px] text-gray-400">Av. Gerardo Unger 4485 Int. 16 - Lima</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-[10px] text-gray-700">COTIZACIÓN</div>
            <div className="text-[9px] font-bold text-blue-900">COT-XXX-2026</div>
            <div className="text-[7px] text-gray-400">{cabecera.fechaEmision}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] border-b border-gray-200 pb-2 mb-2">
          <div><span className="font-semibold text-gray-500">Cliente:</span> {clienteNombre || "—"}</div>
          <div><span className="font-semibold text-gray-500">RUC/DNI:</span> {clienteDocumento || "—"}</div>
          <div><span className="font-semibold text-gray-500">Dirección:</span> {clienteDireccion || "—"}</div>
          <div><span className="font-semibold text-gray-500">Teléfono:</span> {clienteTelefono || "—"}</div>
          <div><span className="font-semibold text-gray-500">Fecha:</span> {cabecera.fechaEmision}</div>
          <div><span className="font-semibold text-gray-500">Moneda:</span> {cabecera.moneda}</div>
          <div><span className="font-semibold text-gray-500">Condición:</span> {cabecera.condicionPago}</div>
          <div><span className="font-semibold text-gray-500">Vigencia:</span> <span className="text-emerald-600 font-bold">Válido 7 días</span></div>
        </div>

        <div className="flex-1 overflow-hidden border border-gray-200 rounded mb-2">
          <div className="grid grid-cols-12 bg-gray-100 text-[8px] font-bold text-gray-600 uppercase border-b border-gray-200">
            <div className="col-span-1 px-1 py-1 text-center">ITEM</div>
            <div className="col-span-2 px-1 py-1">CÓDIGO</div>
            <div className="col-span-4 px-1 py-1">DESCRIPCIÓN</div>
            <div className="col-span-1 px-1 py-1 text-center">CANT</div>
            <div className="col-span-1 px-1 py-1 text-center">UND</div>
            <div className="col-span-1 px-1 py-1 text-right">P.U</div>
            <div className="col-span-2 px-1 py-1 text-right">IMPORTE</div>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "calc(100% - 18px)" }}>
            {carrito.length === 0 ? (
              <div className="text-[8px] text-gray-300 text-center py-8 italic">Sin productos</div>
            ) : (
              carrito.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className="grid grid-cols-12 text-[8px] border-b border-gray-100">
                  <div className="col-span-1 px-1 py-0.5 text-center text-gray-500">{idx + 1}</div>
                  <div className="col-span-2 px-1 py-0.5 text-gray-600">{item.codigoSku}</div>
                  <div className="col-span-4 px-1 py-0.5 truncate">{item.nombre}</div>
                  <div className="col-span-1 px-1 py-0.5 text-center">{item.cantidad}</div>
                  <div className="col-span-1 px-1 py-0.5 text-center text-gray-500">{item.unidadMedida}</div>
                  <div className="col-span-1 px-1 py-0.5 text-right">{item.precioVenta.toFixed(2)}</div>
                  <div className="col-span-2 px-1 py-0.5 text-right font-semibold">{(item.precioVenta * item.cantidad).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="text-[9px] space-y-0.5 mb-1">
          <div className="flex justify-between font-bold text-[10px] border-t border-gray-300 pt-1">
            <span>TOTAL:</span><span>S/ {totalNeto.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-[7px] text-gray-400 leading-tight border-t border-gray-200 pt-1">
          <div>• Productos sujetos a disponibilidad de stock.</div>
          <div>• Precios incluyen IGV. • Cotización válida por 7 días.</div>
          <div className="flex justify-between mt-1">
            <span>BCP: 191-01945499-0-48</span>
            <span>Yape: 977 182 320</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function NuevaCotizacionPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteDocumento, setClienteDocumento] = useState("");
  const [clienteDireccion, setClienteDireccion] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");

  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState<string>("");
  const [cantidadInput, setCantidadInput] = useState<number>(1);
  const [unidadInput, setUnidadInput] = useState<Unidad>("unidad");

  const [carrito, setCarrito] = useState<CarritoItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("carrito");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datosConfirmacion, setDatosConfirmacion] = useState<{
    cotizacionId: number;
    clienteId: number;
    cliente: ClienteData;
    cabecera: FacturaCabecera;
    items: CotizacionItem[];
    totalNeto: number;
    horaEmision: string;
  } | null>(null);

  const [cabeceraFactura, setCabeceraFactura] = useState<FacturaCabecera>({
    fechaEmision: new Date().toLocaleDateString("es-PE"),
    fechaVencimiento: new Date().toLocaleDateString("es-PE"),
    condicionPago: "CONTADO",
    moneda: "SOLES",
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    Promise.all([productoService.listar(), clienteService.listar()])
      .then(([productosData, clientesData]) => {
        setProductos(productosData);
        setClientes(clientesData);
        if (productosData.length > 0 && productosData[0].id) {
          setProductoSeleccionadoId(productosData[0].id.toString());
          setUnidadInput(normalizarUnidad(productosData[0].unidadMedida));
        }
      })
      .catch((err: unknown) => {
        console.error("Error al cargar datos:", err instanceof Error ? err.message : "Error desconocido");
      });
  }, []);

  // 🔥 Agregar al carrito: si el producto ya existe, SUMA la cantidad
  const agregarAlCarrito = () => {
    if (!productoSeleccionadoId) return;
    const prodReal = productos.find((p) => p.id?.toString() === productoSeleccionadoId);
    if (!prodReal || !prodReal.id) return;

    const cantidadTotal = cantidadInput;
    const stockDisponible = prodReal.stock;

    setCarrito(prev => {
      const existente = prev.find(item => item.id === prodReal.id);
      
      if (existente) {
        const nuevaCantidad = existente.cantidad + cantidadTotal;
        if (stockDisponible < nuevaCantidad) {
          alert(`Stock insuficiente. Disponible: ${stockDisponible}, ya tienes ${existente.cantidad} en el carrito.`);
          return prev;
        }
        return prev.map(item =>
          item.id === prodReal.id
            ? { ...item, cantidad: nuevaCantidad, unidadMedida: unidadInput }
            : item
        );
      } else {
        if (stockDisponible < cantidadTotal) {
          alert(`Stock insuficiente. Disponible: ${stockDisponible}`);
          return prev;
        }
        return [...prev, {
          id: prodReal.id as number,
          codigoSku: prodReal.codigoSku || "N/A",
          nombre: prodReal.nombre,
          precioVenta: prodReal.precioVenta,
          cantidad: cantidadTotal,
          stockDisponible: prodReal.stock,
          unidadMedida: unidadInput,
        }];
      }
    });
    setCantidadInput(1);
  };

  const eliminarDelCarrito = (id: number) => setCarrito(prev => prev.filter((item) => item.id !== id));

  const totalNeto = carrito.reduce((sum, item) => sum + item.precioVenta * item.cantidad, 0);

  const itemsParaPDF = (): CotizacionItem[] =>
    carrito.map((item, index) => ({
      item: index + 1,
      codigo: item.codigoSku,
      cantidad: item.cantidad,
      unidad: item.unidadMedida,
      descripcion: item.nombre,
      precioVenta: item.precioVenta,
      importe: item.precioVenta * item.cantidad,
      productoId: item.id,
    }));

  // 🔥 Agrupar detalles antes de enviar al backend
  const agruparDetalles = () => {
    const agrupados: { [key: number]: { productoId: number; cantidad: number; unidad: string; precioUnitario: number; descuento: number } } = {};
    
    carrito.forEach(item => {
      if (agrupados[item.id]) {
        agrupados[item.id].cantidad += item.cantidad;
      } else {
        agrupados[item.id] = {
          productoId: item.id,
          cantidad: item.cantidad,
          unidad: item.unidadMedida,
          precioUnitario: item.precioVenta,
          descuento: 0,
        };
      }
    });
    
    return Object.values(agrupados);
  };

  const manejarEnviarCotizacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteNombre || carrito.length === 0) {
      alert("Complete los datos del cliente y agregue al menos un producto.");
      return;
    }
    setLoading(true);
    const ahora = new Date();
    const horaExactaStr = ahora.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    try {
      const documentoLimpio = clienteDocumento.trim();
      let clienteId: number;

      if (documentoLimpio) {
        const clienteExistente = clientes.find(c => c.documento === documentoLimpio);
        if (clienteExistente) {
          clienteId = clienteExistente.id!;
        } else {
          const nuevoCliente = await clienteService.guardar({
            nombre: clienteNombre,
            documento: documentoLimpio,
            direccion: clienteDireccion || "",
            telefono: clienteTelefono || "",
          });
          clienteId = nuevoCliente.id!;
          setClientes(prev => [...prev, nuevoCliente]);
        }
      } else {
        const nuevoCliente = await clienteService.guardar({
          nombre: clienteNombre,
          documento: `TEMP-${Date.now()}`,
          direccion: clienteDireccion || "",
          telefono: clienteTelefono || "",
        });
        clienteId = nuevoCliente.id!;
        setClientes(prev => [...prev, nuevoCliente]);
      }

      const payload: CotizacionRequest = {
        clienteId,
        fechaVencimiento: new Date().toISOString().split("T")[0],
        condicionPago: "CONTADO",
        moneda: "SOLES",
        observaciones: "",
        detalles: agruparDetalles(),
      };

      const exito = await cotizacionService.guardar(payload);

      setDatosConfirmacion({
        cotizacionId: exito.id,
        clienteId: clienteId,
        cliente: {
          nombre: clienteNombre,
          ruc: documentoLimpio || "N/A",
          direccion: clienteDireccion || "N/A",
          telefono: clienteTelefono || "N/A",
        },
        cabecera: cabeceraFactura,
        items: itemsParaPDF(),
        totalNeto: exito.total,
        horaEmision: horaExactaStr,
      });
      setMostrarModal(true);

      setClienteNombre("");
      setClienteDocumento("");
      setClienteDireccion("");
      setClienteTelefono("");
      setCarrito([]);
      localStorage.removeItem("carrito");
    } catch (error: unknown) {
      const mensaje = error instanceof Error ? error.message : "Error desconocido";
      alert(`Error: ${mensaje}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Generar Cotización</h1>
        <p className="text-slate-500 text-sm">Complete los datos del cliente y agregue productos al detalle.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={manejarEnviarCotizacion} className="lg:col-span-2 space-y-6">
          <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center shrink-0">1</div>
              <div className="flex items-center gap-2 text-gray-700 font-bold text-sm"><User className="h-4 w-4 text-gray-500" /><span>Datos del Cliente</span></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" required className="w-full p-2.5 text-sm border rounded-lg" placeholder="Nombre / Razón Social *" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} />
              <input type="text" className="w-full p-2.5 text-sm border rounded-lg" placeholder="RUC / DNI" value={clienteDocumento} onChange={(e) => setClienteDocumento(e.target.value)} />
              <input type="text" className="w-full p-2.5 text-sm border rounded-lg" placeholder="Dirección" value={clienteDireccion} onChange={(e) => setClienteDireccion(e.target.value)} />
              <input type="text" className="w-full p-2.5 text-sm border rounded-lg" placeholder="Teléfono" value={clienteTelefono} onChange={(e) => setClienteTelefono(e.target.value)} />
            </div>
          </div>

          <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center shrink-0">2</div>
              <div className="flex items-center gap-2 text-gray-700 font-bold text-sm"><Calendar className="h-4 w-4 text-gray-500" /><span>Información de la Cotización</span></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div><label className="text-xs text-gray-500 mb-1 block">Fecha Emisión</label><input type="text" className="w-full p-2.5 text-sm border rounded-lg bg-gray-50" value={cabeceraFactura.fechaEmision} readOnly /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Fecha Vencimiento</label><input type="text" className="w-full p-2.5 text-sm border rounded-lg bg-gray-50" value={cabeceraFactura.fechaVencimiento} readOnly /></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Condición de Pago</label><select className="w-full p-2.5 text-sm border rounded-lg bg-white" value={cabeceraFactura.condicionPago} onChange={(e) => setCabeceraFactura({ ...cabeceraFactura, condicionPago: e.target.value })}>{OPCIONES_PAGO.map(op => <option key={op} value={op}>{op.replace("_", " ")}</option>)}</select></div>
              <div><label className="text-xs text-gray-500 mb-1 block">Moneda</label><select className="w-full p-2.5 text-sm border rounded-lg bg-white" value={cabeceraFactura.moneda} onChange={(e) => setCabeceraFactura({ ...cabeceraFactura, moneda: e.target.value })}>{OPCIONES_MONEDA.map(op => <option key={op} value={op}>{op}</option>)}</select></div>
            </div>
          </div>

          <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center shrink-0">3</div>
              <div className="flex items-center gap-2 text-gray-700 font-bold text-sm"><ShoppingBag className="h-4 w-4 text-gray-500" /><span>Seleccionar Productos</span></div>
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <select className="flex-1 min-w-[200px] p-2.5 text-sm border rounded-lg bg-white" value={productoSeleccionadoId} onChange={(e) => { setProductoSeleccionadoId(e.target.value); const prod = productos.find(p => p.id?.toString() === e.target.value); setUnidadInput(normalizarUnidad(prod?.unidadMedida)); }}>
                {productos.map((p) => (<option key={p.id} value={p.id}>[{p.codigoSku}] {p.nombre} (Stock: {p.stock} | S/ {p.precioVenta.toFixed(2)})</option>))}
              </select>
              <input type="number" min="1" className="w-20 p-2.5 text-sm border rounded-lg text-center" value={cantidadInput} onChange={(e) => setCantidadInput(parseInt(e.target.value) || 1)} />
              <select className="w-24 p-2.5 text-sm border rounded-lg bg-white" value={unidadInput} onChange={(e) => setUnidadInput(e.target.value as Unidad)}>{OPCIONES_UNIDAD.map(op => <option key={op} value={op}>{op}</option>)}</select>
              <button type="button" onClick={agregarAlCarrito} className="flex items-center gap-1 bg-gray-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-900 transition"><Plus className="h-4 w-4" /> Añadir Fila</button>
            </div>
          </div>

          <div className="bg-white p-5 border border-gray-200 rounded-xl shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-gray-800 text-white text-xs font-bold flex items-center justify-center shrink-0">4</div>
              <div className="flex items-center gap-2 text-gray-700 font-bold text-sm"><FileText className="h-4 w-4 text-gray-500" /><span>Detalle de la Cotización</span></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 text-xs text-gray-500 uppercase"><th className="text-left py-2 font-semibold">SKU</th><th className="text-left py-2 font-semibold">Descripción</th><th className="text-center py-2 font-semibold">Unidad</th><th className="text-center py-2 font-semibold">Cant.</th><th className="text-right py-2 font-semibold">P. Unitario</th><th className="text-right py-2 font-semibold">Importe</th><th className="text-center py-2 font-semibold w-10"></th></tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {carrito.length === 0 ? (
                    <tr><td colSpan={7} className="py-12 text-center text-gray-300 italic text-sm">Selecciona un producto y presiona Añadir Fila</td></tr>
                  ) : (
                    carrito.map((item, index) => {
                      const importeItem = item.precioVenta * item.cantidad;
                      return (
                        <tr key={`${item.id}-${index}`} className="hover:bg-gray-50/50">
                          <td className="py-2 font-mono text-xs text-gray-600">{item.codigoSku}</td>
                          <td className="py-2 font-medium text-gray-900">{item.nombre}</td>
                          <td className="py-2 text-center text-gray-500">{item.unidadMedida}</td>
                          <td className="py-2 text-center">{item.cantidad}</td>
                          <td className="py-2 text-right text-gray-600">S/ {item.precioVenta.toFixed(2)}</td>
                          <td className="py-2 text-right font-semibold">S/ {importeItem.toFixed(2)}</td>
                          <td className="py-2 text-center"><button type="button" onClick={() => eliminarDelCarrito(item.id)} className="text-gray-400 hover:text-red-600 transition"><Trash2 className="h-4 w-4" /></button></td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            {carrito.length > 0 && (
              <div className="flex justify-end border-t border-gray-200 pt-3"><span className="text-lg font-bold text-gray-900">Total: S/ {totalNeto.toFixed(2)}</span></div>
            )}
          </div>

          <button type="submit" disabled={loading || carrito.length === 0} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold text-sm hover:bg-emerald-700 transition disabled:bg-gray-200 disabled:text-gray-400">
            {loading ? "Emitiendo..." : "Emitir Cotización Oficial"}
          </button>
        </form>

        <div className="lg:col-span-1">
          <div className="sticky top-6 space-y-4">
            <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><FileText className="h-4 w-4" /> Vista Previa — COT-XXX-2026</h3>
              <VistaPrevia clienteNombre={clienteNombre} clienteDocumento={clienteDocumento} clienteDireccion={clienteDireccion} clienteTelefono={clienteTelefono} cabecera={cabeceraFactura} carrito={carrito} totalNeto={totalNeto} />
            </div>
          </div>
        </div>
      </div>

      {mostrarModal && datosConfirmacion && (
        <ModalConfirmacion
          cotizacionId={datosConfirmacion.cotizacionId}
          cliente={datosConfirmacion.cliente}
          clienteId={datosConfirmacion.clienteId}
          cabecera={datosConfirmacion.cabecera}
          items={datosConfirmacion.items}
          totalNeto={datosConfirmacion.totalNeto}
          horaEmision={datosConfirmacion.horaEmision}
          onClose={() => { setMostrarModal(false); setDatosConfirmacion(null); }}
        />
      )}
    </div>
  );
}