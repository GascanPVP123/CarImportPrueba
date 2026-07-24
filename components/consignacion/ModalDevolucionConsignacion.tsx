"use client";

import React, { useState } from "react";
import { X, Undo2, Package } from "lucide-react";
import { Consignacion, DevolucionConsignacionRequest } from "@/services/consignacionService";

interface ModalDevolucionConsignacionProps {
  isOpen: boolean;
  onClose: () => void;
  consignacion: Consignacion;
  onGuardar: (data: DevolucionConsignacionRequest) => Promise<void>;
}

interface DevolucionDetalleForm {
  detalleConsignacionId: number;
  productoNombre: string;
  cantidadPendiente: number;
  cantidadDevolver: number;
}

export function ModalDevolucionConsignacion({
  isOpen,
  onClose,
  consignacion,
  onGuardar,
}: ModalDevolucionConsignacionProps) {
  const [fechaDevolucion, setFechaDevolucion] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [motivo, setMotivo] = useState("");
  const [detalles, setDetalles] = useState<DevolucionDetalleForm[]>(() => {
    return consignacion.detalles
      .filter(
        (d) =>
          (d.cantidadPendiente ??
            d.cantidadEnviada - d.cantidadVendida - d.cantidadDevuelta) >
            0 && !d.devuelto
      )
      .map((d) => ({
        detalleConsignacionId: d.id!,
        productoNombre: `${d.producto?.codigoSku || ""} - ${d.producto?.nombre || ""}`,
        cantidadPendiente:
          d.cantidadPendiente ??
          d.cantidadEnviada - d.cantidadVendida - d.cantidadDevuelta,
        cantidadDevolver: 0,
      }));
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const detallesDevolucion = detalles.filter((d) => d.cantidadDevolver > 0);

    if (detallesDevolucion.length === 0) {
      setError("Ingresa al menos una cantidad a devolver");
      return;
    }

    for (const d of detallesDevolucion) {
      if (d.cantidadDevolver > d.cantidadPendiente) {
        setError(
          `La cantidad de "${d.productoNombre}" excede el pendiente (${d.cantidadPendiente})`
        );
        return;
      }
    }

    const data: DevolucionConsignacionRequest = {
      fechaDevolucion,
      motivo: motivo.trim() || undefined,
      detalles: detallesDevolucion.map((d) => ({
        detalleConsignacionId: d.detalleConsignacionId,
        cantidad: d.cantidadDevolver,
      })),
    };

    try {
      setLoading(true);
      await onGuardar(data);
      onClose();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Error al registrar devolución"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 bg-amber-700 text-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Undo2 className="h-5 w-5" />
            <h2 className="font-bold text-base">Registrar Devolución</h2>
          </div>
          <button onClick={onClose} className="text-amber-200 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-lg text-xs space-y-1">
            <p><span className="font-semibold">Consignación:</span> {consignacion.numeroConsignacion}</p>
            <p><span className="font-semibold">Tienda:</span> {consignacion.tienda?.nombre}</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Fecha Devolución</label>
            <input
              type="date"
              value={fechaDevolucion}
              onChange={(e) => setFechaDevolucion(e.target.value)}
              className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Motivo</label>
            <textarea
              rows={2}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Razón de la devolución..."
              className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none resize-none"
            />
          </div>

          <div className="border-t pt-4">
            <h4 className="text-sm font-bold text-slate-900 mb-3">Productos pendientes</h4>

            {detalles.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-4 text-center">
                No hay productos pendientes para devolver
              </p>
            ) : (
              <div className="space-y-2">
                {detalles.map((d, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{d.productoNombre}</p>
                      <p className="text-xs text-gray-400">Pendiente: {d.cantidadPendiente} und.</p>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max={d.cantidadPendiente}
                      value={d.cantidadDevolver || ""}
                      onChange={(e) => {
                        setDetalles((prev) => {
                          const nuevos = [...prev];
                          nuevos[i] = { ...nuevos[i], cantidadDevolver: parseInt(e.target.value) || 0 };
                          return nuevos;
                        });
                      }}
                      className="w-24 p-2 text-xs border rounded text-center"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2 text-xs font-bold text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition shadow-sm disabled:bg-gray-300">
              {loading ? "Guardando..." : "Registrar Devolución"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}