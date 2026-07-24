"use client";

import React, { useState } from "react";
import { X, ShoppingCart, DollarSign } from "lucide-react";
import { Consignacion, VentaConsignacionRequest } from "@/services/consignacionService";

interface ModalVentaConsignacionProps {
  isOpen: boolean;
  onClose: () => void;
  consignacion: Consignacion;
  onGuardar: (data: VentaConsignacionRequest) => Promise<void>;
}

interface VentaDetalleForm {
  detalleConsignacionId: number;
  productoNombre: string;
  cantidadPendiente: number;
  cantidadVender: number;
  precioUnitario: number;
}

export function ModalVentaConsignacion({
  isOpen,
  onClose,
  consignacion,
  onGuardar,
}: ModalVentaConsignacionProps) {
  const [fechaVenta, setFechaVenta] = useState(new Date().toISOString().split("T")[0]);
  const [comisionPorcentaje, setComisionPorcentaje] = useState<number>(0);
  const [observaciones, setObservaciones] = useState("");
  const [detalles, setDetalles] = useState<VentaDetalleForm[]>(() => {
    if (!isOpen) return [];
    return consignacion.detalles
      .filter(d => (d.cantidadPendiente ?? (d.cantidadEnviada - d.cantidadVendida - d.cantidadDevuelta)) > 0)
      .map(d => ({
        detalleConsignacionId: d.id!,
        productoNombre: `${d.producto?.codigoSku || ""} - ${d.producto?.nombre || ""}`,
        cantidadPendiente: d.cantidadPendiente ?? (d.cantidadEnviada - d.cantidadVendida - d.cantidadDevuelta),
        cantidadVender: 0,
        precioUnitario: d.precioUnitario || 0,
      }));
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const detallesVenta = detalles.filter(d => d.cantidadVender > 0);
    
    if (detallesVenta.length === 0) {
      setError("Ingresa al menos una cantidad a vender");
      return;
    }

    // Validar que no exceda el pendiente
    for (const d of detallesVenta) {
      if (d.cantidadVender > d.cantidadPendiente) {
        setError(`La cantidad de "${d.productoNombre}" excede el pendiente (${d.cantidadPendiente})`);
        return;
      }
    }

    const data: VentaConsignacionRequest = {
      fechaVenta,
      comisionPorcentaje: comisionPorcentaje || 0,
      observaciones,
      detalles: detallesVenta.map(d => ({
        detalleConsignacionId: d.detalleConsignacionId,
        cantidad: d.cantidadVender,
        precioUnitario: d.precioUnitario,
      })),
    };

    try {
      setLoading(true);
      await onGuardar(data);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar venta");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const totalVenta = detalles.reduce((acc, d) => acc + d.cantidadVender * d.precioUnitario, 0);
  const comisionMonto = totalVenta * (comisionPorcentaje / 100);
  const montoAPagar = totalVenta - comisionMonto;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-700 text-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="font-bold text-base">Registrar Venta</h2>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          {/* Info de la consignación */}
          <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
            <p><span className="font-semibold">Consignación:</span> {consignacion.numeroConsignacion}</p>
            <p><span className="font-semibold">Tienda:</span> {consignacion.tienda?.nombre}</p>
            <p><span className="font-semibold">Estado actual:</span> {consignacion.estado}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Fecha Venta</label>
              <input
                type="date"
                value={fechaVenta}
                onChange={(e) => setFechaVenta(e.target.value)}
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Comisión (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={comisionPorcentaje || ""}
                onChange={(e) => setComisionPorcentaje(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Productos */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-bold text-slate-900 mb-3">
              Productos pendientes de vender
            </h4>

            {detalles.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-4 text-center">
                No hay productos pendientes de venta
              </p>
            ) : (
              <div className="space-y-2">
                {detalles.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{d.productoNombre}</p>
                      <p className="text-xs text-gray-400">Pendiente: {d.cantidadPendiente} und.</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max={d.cantidadPendiente}
                      value={d.cantidadVender || ""}
                      onChange={(e) => {
                        const nuevos = [...detalles];
                        nuevos[i].cantidadVender = parseInt(e.target.value) || 0;
                        setDetalles(nuevos);
                      }}
                      className="w-20 p-2 text-xs border rounded text-center"
                      placeholder="0"
                    />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={d.precioUnitario || ""}
                      onChange={(e) => {
                        const nuevos = [...detalles];
                        nuevos[i].precioUnitario = parseFloat(e.target.value) || 0;
                        setDetalles(nuevos);
                      }}
                      className="w-24 p-2 text-xs border rounded text-right"
                      placeholder="0.00"
                    />
                    <span className="text-xs font-bold w-20 text-right text-emerald-700">
                      S/ {(d.cantidadVender * d.precioUnitario).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Totales */}
          {totalVenta > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Venta:</span>
                <span className="font-bold">S/ {totalVenta.toFixed(2)}</span>
              </div>
              {comisionPorcentaje > 0 && (
                <>
                  <div className="flex justify-between text-amber-700">
                    <span>Comisión ({comisionPorcentaje}%):</span>
                    <span>- S/ {comisionMonto.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold text-emerald-700">Monto a pagar:</span>
                    <span className="font-bold text-emerald-700">S/ {montoAPagar.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Observaciones</label>
            <textarea
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Notas sobre esta venta..."
              className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
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
              {loading ? "Guardando..." : "Registrar Venta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}