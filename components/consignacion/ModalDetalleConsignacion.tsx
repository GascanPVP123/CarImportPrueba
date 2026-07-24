"use client";

import React from "react";
import { X, Truck, Building2, Calendar, Package, DollarSign, ShoppingCart, Undo2, CheckCircle } from "lucide-react";
import { Consignacion } from "@/services/consignacionService";

interface ModalDetalleConsignacionProps {
  isOpen: boolean;
  onClose: () => void;
  consignacion: Consignacion;
}

const ESTADO_CONFIG: Record<string, { color: string; icono: React.ReactNode; label: string }> = {
  ENVIADA: { color: "bg-blue-100 text-blue-800", icono: <Truck className="h-4 w-4" />, label: "Enviada" },
  PARCIAL: { color: "bg-amber-100 text-amber-800", icono: <ShoppingCart className="h-4 w-4" />, label: "Parcial" },
  COMPLETADA: { color: "bg-emerald-100 text-emerald-800", icono: <CheckCircle className="h-4 w-4" />, label: "Completada" },
  DEVUELTA: { color: "bg-red-100 text-red-800", icono: <Undo2 className="h-4 w-4" />, label: "Devuelta" },
};

export function ModalDetalleConsignacion({
  isOpen,
  onClose,
  consignacion,
}: ModalDetalleConsignacionProps) {
  if (!isOpen) return null;

  const estadoConfig = ESTADO_CONFIG[consignacion.estado] || ESTADO_CONFIG.ENVIADA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-400" />
            <h2 className="font-bold text-base">
              Detalle de Consignación
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información general */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-slate-400" />
                <span className="text-sm font-mono font-bold">{consignacion.numeroConsignacion}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-slate-400" />
                <span className="text-sm">{consignacion.tienda?.nombre}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-sm">{consignacion.fechaEnvio}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${estadoConfig.color}`}>
                  {estadoConfig.icono}
                  {estadoConfig.label}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-400" />
                <span className="text-sm">
                  Total: <span className="font-bold">S/ {consignacion.valorTotal?.toFixed(2)}</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">
                  Vendido: <span className="font-bold text-emerald-700">S/ {consignacion.valorVendido?.toFixed(2)}</span>
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Undo2 className="h-4 w-4 text-amber-500" />
                <span className="text-sm">
                  Devuelto: <span className="font-bold text-amber-700">S/ {consignacion.valorDevuelto?.toFixed(2)}</span>
                </span>
              </div>
            </div>
          </div>

          {consignacion.observaciones && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs font-semibold text-gray-500 mb-1">Observaciones:</p>
              <p className="text-sm text-gray-700">{consignacion.observaciones}</p>
            </div>
          )}

          {/* Tabla de productos */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-bold text-slate-900 mb-3">
              Productos ({consignacion.detalles?.length || 0})
            </h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold">
                    <th className="py-2 px-3 text-left">Producto</th>
                    <th className="py-2 px-3 text-center">Enviado</th>
                    <th className="py-2 px-3 text-center">Vendido</th>
                    <th className="py-2 px-3 text-center">Devuelto</th>
                    <th className="py-2 px-3 text-center">Pendiente</th>
                    <th className="py-2 px-3 text-right">P. Unit.</th>
                    <th className="py-2 px-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {consignacion.detalles?.map((d) => {
                    const pendiente = d.cantidadPendiente ?? (d.cantidadEnviada - d.cantidadVendida - d.cantidadDevuelta);
                    return (
                      <tr key={d.id} className="hover:bg-gray-50">
                        <td className="py-2 px-3">
                          <p className="font-medium text-slate-900 truncate max-w-[200px]">
                            {d.producto?.nombre}
                          </p>
                          <p className="text-gray-400 font-mono text-xs">
                            {d.producto?.codigoSku}
                          </p>
                        </td>
                        <td className="py-2 px-3 text-center font-semibold">{d.cantidadEnviada}</td>
                        <td className="py-2 px-3 text-center text-emerald-700 font-semibold">{d.cantidadVendida}</td>
                        <td className="py-2 px-3 text-center text-amber-700 font-semibold">{d.cantidadDevuelta}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`font-bold ${pendiente > 0 ? "text-blue-700" : "text-gray-400"}`}>
                            {pendiente}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono">S/ {d.precioUnitario?.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold">S/ {d.subtotal?.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50 font-bold">
                    <td colSpan={6} className="py-2 px-3 text-right">Total:</td>
                    <td className="py-2 px-3 text-right font-mono">S/ {consignacion.valorTotal?.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Fechas */}
          <div className="border-t pt-4 text-xs text-gray-500 space-y-1">
            <p>Creado: {consignacion.createdAt ? new Date(consignacion.createdAt).toLocaleString() : "—"}</p>
            <p>Actualizado: {consignacion.updatedAt ? new Date(consignacion.updatedAt).toLocaleString() : "—"}</p>
            {consignacion.fechaDevolucion && (
              <p>Fecha devolución: {consignacion.fechaDevolucion}</p>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}