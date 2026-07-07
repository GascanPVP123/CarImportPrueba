"use client";

import React, { useEffect, useState } from "react";
import { productoService, Producto } from "@/services/productoService";
import { cotizacionService, CotizacionInput } from "@/services/cotizacionService";
import { Plus, Trash2, FileText, User, ShoppingBag, Percent } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CotizacionPDF from "./cotizaciones/components/CotizacionPDF";

interface CarritoItem {
  id: number;
  codigoSku: string; // <-- Añadido
  nombre: string;
  precioVenta: number;
  cantidad: number;
  stockDisponible: number;
  unidadMedida: string;
  descuentoPorcentaje: number; // <-- Añadido para el control por mayor
}

export default function NuevaCotizacionPage() {
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteDocumento, setClienteDocumento] = useState("");
  
  const [productos, setProductos] = useState<Producto[]>([]);
  const [productoSeleccionadoId, setProductoSeleccionadoId] = useState<string>("");
  const [cantidadInput, setCantidadInput] = useState<number>(1);
  const [descuentoInput, setDescuentoInput] = useState<number>(0); // Estado para el descuento del input
  
  const [carrito, setCarrito] = useState<CarritoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [cotizacionEmitida, setCotizacionEmitida] = useState<any | null>(null);

  useEffect(() => {
    productoService.listar()
      .then((data) => {
        setProductos(data);
        if (data.length > 0 && data[0].id) {
          setProductoSeleccionadoId(data[0].id.toString());
        }
      })
      .catch((err) => console.error("Error al sincronizar productos:", err));
  }, []);

  const agregarAlCarrito = () => {
    if (!productoSeleccionadoId) return;
    
    const prodReal = productos.find(p => p.id?.toString() === productoSeleccionadoId);
    if (!prodReal || !prodReal.id) return;

    if (prodReal.stock < cantidadInput) {
      alert(`No puedes solicitar ${cantidadInput} unidades. El stock actual en MySQL es de ${prodReal.stock}.`);
      return;
    }

    const unidadReal = (prodReal as any).unidadMedida || "unid";
    const skuReal = prodReal.codigoSku || "N/A"; // Captura el SKU

    const existe = carrito.find(item => item.id === prodReal.id);
    
    if (existe) {
      const nuevaCantidad = existe.cantidad + cantidadInput;
      if (prodReal.stock < nuevaCantidad) {
        alert(`La cantidad total supera el stock disponible (${prodReal.stock} uds).`);
        return;
      }
      setCarrito(carrito.map(item => 
        item.id === prodReal.id ? { ...item, cantidad: nuevaCantidad, descuentoPorcentaje: descuentoInput } : item
      ));
    } else {
      setCarrito([...carrito, {
        id: prodReal.id,
        codigoSku: skuReal,
        nombre: prodReal.nombre,
        precioVenta: prodReal.precioVenta,
        cantidad: cantidadInput,
        stockDisponible: prodReal.stock,
        unidadMedida: unidadReal,
        descuentoPorcentaje: descuentoInput // Inyectamos el descuento
      }]);
    }
    setCantidadInput(1);
    setDescuentoInput(0); // Reseteamos
  };

  const eliminarDelCarrito = (id: number) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  // 🧮 OPERACIONES MATEMÁTICAS DINÁMICAS EN CALIENTE
  const totalBruto = carrito.reduce((sum, item) => sum + (item.precioVenta * item.cantidad), 0);
  
  const totalDescuento = carrito.reduce((sum, item) => {
    const subtotalItem = item.precioVenta * item.cantidad;
    return sum + (subtotalItem * (item.descuentoPorcentaje / 100));
  }, 0);

  const totalNeto = totalBruto - totalDescuento;

  const manejarEnviarCotizacion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteNombre || carrito.length === 0) {
      alert("Por favor, ingresa los datos del cliente y añade mínimo un repuesto.");
      return;
    }

    setLoading(true);

    // Capturamos la hora exacta exacta del sistema en Lima
    const ahora = new Date();
    const horaExactaStr = ahora.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

    // Le mandamos a Spring Boot la data adaptada a tu controlador
    const payload: CotizacionInput = {
      clienteNombre,
      clienteDocumento,
      detalles: carrito.map(item => {
        const subtotalItem = item.precioVenta * item.cantidad;
        const ahorroItem = subtotalItem * (item.descuentoPorcentaje / 100);
        const precioFinalConDescuento = (subtotalItem - ahorroItem) / item.cantidad;

        return {
          cantidad: item.cantidad,
          producto: { id: item.id },
          // Si tu backend lo requiere, pasamos el precio ya rebajado para no romper la consistencia de totales
          precioUnitario: precioFinalConDescuento 
        };
      })
    };

    try {
      const exito = await cotizacionService.guardar(payload);
      alert(`¡Cotización N° ${exito.id} emitida con éxito!`);
      
      // Guardamos el snapshot completo modificado para el PDF estructurado
      setCotizacionEmitida({
        id: exito.id,
        clienteNombre,
        clienteDocumento,
        horaEmision: horaExactaStr, // Guardamos la hora exacta
        items: carrito,
        totalBruto,
        totalDescuento,
        totalNeto
      });

      setClienteNombre("");
      setClienteDocumento("");
      setCarrito([]);
      
      const nuevoInventario = await productoService.listar();
      setProductos(nuevoInventario);
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message || "No se pudo procesar la cotización."}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Generar Cotización 📄</h1>
        <p className="text-slate-500 text-sm">Panel corporativo con descuentos aplicados al por mayor en tiempo real.</p>
      </div>

      <form onSubmit={manejarEnviarCotizacion} className="space-y-6">
        {/* Ficha Cliente */}
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-2 text-slate-700 font-bold text-sm">
            <User className="h-4 w-4 text-emerald-600" />
            <span>Información del Cliente</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Nombre / Razón Social</label>
              <input type="text" required className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Ej. Taller Mecánico Silva" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">RUC o DNI (Opcional)</label>
              <input type="text" className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Ej. 20123456789" value={clienteDocumento} onChange={(e) => setClienteDocumento(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Añadir Productos */}
        <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b pb-2 text-slate-700 font-bold text-sm">
            <ShoppingBag className="h-4 w-4 text-emerald-600" />
            <span>Seleccionar Autopartes de Importación</span>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Buscar Producto</label>
              <select className="w-full p-2.5 text-sm bg-slate-50 border rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500" value={productoSeleccionadoId} onChange={(e) => setProductoSeleccionadoId(e.target.value)}>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>
                    [{p.codigoSku}] {p.nombre} (Stock: {p.stock} | S/. {p.precioVenta.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Cantidad</label>
              <input type="number" min="1" className="w-full p-2.5 text-sm border rounded-lg text-center font-bold" value={cantidadInput} onChange={(e) => setCantidadInput(parseInt(e.target.value) || 1)} />
            </div>
            {/* 🔥 NUEVO INPUT DE DESCUENTO POR MAYOR */}
            <div className="w-28">
              <label className="block text-xs font-semibold text-slate-500 mb-1">Descuento (%)</label>
              <div className="relative flex items-center">
                <Percent className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                <input type="number" min="0" max="100" className="w-full pl-8 pr-3 py-2.5 text-sm border rounded-lg text-center font-bold text-red-600" value={descuentoInput} onChange={(e) => setDescuentoInput(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))} placeholder="0" />
              </div>
            </div>
            <button type="button" onClick={agregarAlCarrito} className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition text-sm shadow-sm">
              <Plus className="h-4 w-4" />
              <span>Añadir Fila</span>
            </button>
          </div>
        </div>

        {/* Tabla Intermedia de Cotización */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Descripción de Autoparte</th>
                <th className="px-6 py-4 text-center">Medida</th>
                <th className="px-6 py-4 text-center">Cantidad</th>
                <th className="px-6 py-4 text-right">P. Unitario</th>
                <th className="px-6 py-4 text-center">Desc. (%)</th>
                <th className="px-6 py-4 text-right">Subtotal Neto</th>
                <th className="px-6 py-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {carrito.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">La lista de cotización está vacía.</td>
                </tr>
              ) : (
                carrito.map(item => {
                  const subtotalBrutoItem = item.precioVenta * item.cantidad;
                  const ahorro = subtotalBrutoItem * (item.descuentoPorcentaje / 100);
                  const subtotalNetoItem = subtotalBrutoItem - ahorro;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{item.codigoSku}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">{item.nombre}</td>
                      <td className="px-6 py-4 text-center text-slate-400 font-mono text-xs">{item.unidadMedida}</td>
                      <td className="px-6 py-4 text-center font-medium">{item.cantidad} uds</td>
                      <td className="px-6 py-4 text-right text-slate-500">S/. {item.precioVenta.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center font-bold text-red-600">{item.descuentoPorcentaje}%</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">S/. {subtotalNetoItem.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center">
                        <button type="button" onClick={() => eliminarDelCarrito(item.id)} className="p-1 text-slate-400 hover:text-red-600 rounded transition"><Trash2 className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          
          {/* Fila Informativa en Caliente */}
          {carrito.length > 0 && (
            <div className="bg-slate-50/80 px-6 py-4 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm gap-2">
              <div className="flex gap-4 text-slate-500">
                <span>Bruto: S/. {totalBruto.toFixed(2)}</span>
                <span className="text-red-600 font-medium">Ahorro por mayor: - S/. {totalDescuento.toFixed(2)}</span>
              </div>
              <span className="text-lg font-bold text-slate-900">Total Neto a Cobrar: S/. {totalNeto.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="text-right">
          <button type="submit" disabled={loading || carrito.length === 0} className="flex inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition disabled:bg-slate-200 disabled:text-slate-400 shadow-sm text-sm">
            <FileText className="h-4 w-4" />
            <span>{loading ? "Registrando en MySQL..." : "Emitir Cotización Oficial"}</span>
          </button>
        </div>
      </form>

      {/* 📥 DESCARGA OFICIAL TOTALMENTE CORREGIDA */}
      {cotizacionEmitida && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between animate-fade-in">
          <div>
            <p className="text-sm font-bold text-emerald-900">¡Presupuesto y descuentos calculados con éxito!</p>
            <p className="text-xs text-emerald-700">Cotización N° #000{cotizacionEmitida.id} emitida a las {cotizacionEmitida.hourEmision}.</p>
          </div>
          
          <PDFDownloadLink
            document={
              <CotizacionPDF
                cotizacionId={cotizacionEmitida.id}
                clienteNombre={cotizacionEmitida.clienteNombre}
                clienteDocumento={cotizacionEmitida.clienteDocumento}
                horaEmision={cotizacionEmitida.horaEmision}
                items={cotizacionEmitida.items}
                totalBruto={cotizacionEmitida.totalBruto}
                totalDescuento={cotizacionEmitida.totalDescuento}
                totalNeto={cotizacionEmitida.totalNeto}
              />
            }
            fileName={`Cotizacion_Nro_${cotizacionEmitida.id}.pdf`}
            className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition shadow-sm"
          >
            {({ loading }) => (loading ? "Estructurando Reporte..." : "📥 Descargar PDF Oficial")}
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
}