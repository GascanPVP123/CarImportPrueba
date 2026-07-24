"use client";

import React, { useState, useEffect } from "react";
import { X, Truck, Plus, Trash2, Search } from "lucide-react";
import { TiendaAliada } from "@/services/tiendaAliadaService";
import { ConsignacionRequest } from "@/services/consignacionService";
import { productoService, Producto } from "@/services/productoService";

interface ModalConsignacionProps {
  isOpen: boolean;
  onClose: () => void;
  tiendas: TiendaAliada[];
  onGuardar: (data: ConsignacionRequest) => Promise<void>;
}

interface DetalleForm {
  productoId: number | null;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
}

export function ModalConsignacion({
  isOpen,
  onClose,
  tiendas,
  onGuardar,
}: ModalConsignacionProps) {
  const [tiendaId, setTiendaId] = useState<number | null>(null);
  const [fechaEnvio, setFechaEnvio] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [detalles, setDetalles] = useState<DetalleForm[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [mostrarBusqueda, setMostrarBusqueda] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    let ignore = false;

    const inicializar = async () => {
      try {
        const [data] = await Promise.all([
          productoService.listar(),
        ]);

        if (ignore) return;

        setProductos(data);
        setTiendaId(null);
        setFechaEnvio(new Date().toISOString().split("T")[0]);
        setObservaciones("");
        setDetalles([]);
        setError(null);
        setBusquedaProducto("");
        setMostrarBusqueda(false);
      } catch (e) {
        console.error("Error al cargar productos:", e);
      }
    };

    inicializar();

    return () => {
      ignore = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
    p.codigoSku.toLowerCase().includes(busquedaProducto.toLowerCase())
  );

  const agregarDetalle = (producto: Producto) => {
    const existe = detalles.find(d => d.productoId === producto.id);
    if (existe) {
      setError("Este producto ya est\u00e1 agregado");
      return;
    }

    setDetalles(prev => [
      ...prev,
      {
        productoId: producto.id!,
        productoNombre: `${producto.codigoSku} - ${producto.nombre}`,
        cantidad: 1,
        precioUnitario: producto.precioMenor || producto.precioVenta || 0,
      },
    ]);
    setMostrarBusqueda(false);
    setBusquedaProducto("");
    setError(null);
  };

  const eliminarDetalle = (index: number) => {
    setDetalles(prev => prev.filter((_, i) => i !== index));
  };

  const actualizarDetalle = (index: number, field: keyof DetalleForm, value: number) => {
    setDetalles(prev => {
      const nuevos = [...prev];
      nuevos[index] = { ...nuevos[index], [field]: value };
      return nuevos;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tiendaId) {
      setError("Selecciona una tienda");
      return;
    }

    if (detalles.length === 0) {
      setError("Agrega al menos un producto");
      return;
    }

    for (const d of detalles) {
      if (d.cantidad <= 0) {
        setError(`La cantidad de "${d.productoNombre}" debe ser mayor a 0`);
        return;
      }
      if (d.precioUnitario <= 0) {
        setError(`El precio de "${d.productoNombre}" debe ser mayor a 0`);
        return;
      }
    }

    const data: ConsignacionRequest = {
      tiendaId,
      fechaEnvio,
      observaciones: observaciones.trim() || undefined,
      detalles: detalles.map(d => ({
        productoId: d.productoId!,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario,
      })),
    };

    try {
      setLoading(true);
      await onGuardar(data);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al crear consignaci\u00f3n");
    } finally {
      setLoading(false);
    }
  };

  const total = detalles.reduce((acc, d) => acc + d.cantidad * d.precioUnitario, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-400" />
            <h2 className="font-bold text-base">Nueva Consignaci\u00f3n</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Tienda *</label>
              <select
                value={tiendaId || ""}
                onChange={(e) => setTiendaId(e.target.value ? Number(e.target.value) : null)}
                className="w-full p-2.5 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">Seleccionar tienda...</option>
                {tiendas.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Fecha Env\u00edo</label>
              <input
                type="date"
                value={fechaEnvio}
                onChange={(e) => setFechaEnvio(e.target.value)}
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Observaciones</label>
            <textarea
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Notas sobre esta consignaci\u00f3n..."
              className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-slate-900">Productos</h4>
              <button
                type="button"
                onClick={() => {
                  setMostrarBusqueda(!mostrarBusqueda);
                  setBusquedaProducto("");
                }}
                className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-bold"
              >
                <Plus className="h-3 w-3" /> Agregar Producto
              </button>
            </div>

            {mostrarBusqueda && (
              <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={busquedaProducto}
                    onChange={(e) => setBusquedaProducto(e.target.value)}
                    placeholder="Buscar producto por nombre o SKU..."
                    className="w-full pl-9 pr-4 py-2 text-xs border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    autoFocus
                  />
                </div>
                {busquedaProducto && (
                  <div className="mt-2 max-h-40 overflow-y-auto">
                    {productosFiltrados.slice(0, 10).map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => agregarDetalle(p)}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-emerald-50 rounded transition flex justify-between items-center"
                      >
                        <span>
                          <span className="font-mono font-semibold">{p.codigoSku}</span> - {p.nombre}
                        </span>
                        <span className="text-emerald-700 font-bold">
                          S/ {(p.precioMenor || p.precioVenta || 0).toFixed(2)}
                        </span>
                      </button>
                    ))}
                    {productosFiltrados.length === 0 && (
                      <p className="text-xs text-gray-400 italic p-2">No se encontraron productos</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {detalles.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-4 text-center">
                No hay productos agregados. Haz clic en &quot;Agregar Producto&quot; para comenzar.
              </p>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 px-2">
                  <div className="col-span-4">Producto</div>
                  <div className="col-span-2 text-center">Cantidad</div>
                  <div className="col-span-3 text-right">P. Unitario</div>
                  <div className="col-span-2 text-right">Subtotal</div>
                  <div className="col-span-1"></div>
                </div>
                
                {detalles.map((d, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-lg">
                    <span className="col-span-4 text-xs truncate font-medium">{d.productoNombre}</span>
                    <input
                      type="number"
                      min="1"
                      value={d.cantidad || ""}
                      onChange={(e) => actualizarDetalle(i, "cantidad", parseInt(e.target.value) || 0)}
                      className="col-span-2 p-1.5 text-xs border rounded text-center"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={d.precioUnitario || ""}
                      onChange={(e) => actualizarDetalle(i, "precioUnitario", parseFloat(e.target.value) || 0)}
                      className="col-span-3 p-1.5 text-xs border rounded text-right"
                    />
                    <span className="col-span-2 text-xs font-bold text-right text-emerald-700">
                      S/ {(d.cantidad * d.precioUnitario).toFixed(2)}
                    </span>
                    <button
                      type="button"
                      onClick={() => eliminarDetalle(i)}
                      className="col-span-1 text-red-500 hover:text-red-700 flex justify-center"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {detalles.length > 0 && (
              <div className="flex justify-end mt-3 pt-3 border-t">
                <span className="text-sm font-bold text-slate-900">
                  Total: S/ {total.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition shadow-sm disabled:bg-gray-300"
            >
              {loading ? "Guardando..." : "Crear Consignaci\u00f3n"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}