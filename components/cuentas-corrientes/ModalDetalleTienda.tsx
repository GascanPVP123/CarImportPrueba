"use client";

import React, { useState, useCallback } from "react";
import { X, Building2, TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";
import { cuentaCorrienteService, CuentaCorriente, SaldoTienda } from "@/services/cuentaCorrienteService";

interface ModalDetalleTiendaProps {
  isOpen: boolean;
  onClose: () => void;
  tiendaId: number;
  tiendaNombre: string;
}

const ORIGEN_LABELS: Record<string, string> = {
  CONSIGNACION_VENTA: "Venta Consignación",
  CONSIGNACION_COMISION: "Comisión",
  CONSIGNACION_DEVOLUCION: "Devolución",
  VENTA_DIRECTA: "Venta Directa",
  COMPRA: "Compra a Tienda",
  PAGO_RECIBIDO: "Pago Recibido",
  GASTO_COMPARTIDO: "Gasto Compartido",
  AJUSTE: "Ajuste",
  OTRO: "Otro",
};

export function ModalDetalleTienda({
  isOpen,
  onClose,
  tiendaId,
  tiendaNombre,
}: ModalDetalleTiendaProps) {
  const [movimientos, setMovimientos] = useState<CuentaCorriente[]>([]);
  const [saldo, setSaldo] = useState<SaldoTienda | null>(null);
  const [loading, setLoading] = useState(false);
  const [cargado, setCargado] = useState(false);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [movimientosData, saldoData] = await Promise.all([
        cuentaCorrienteService.obtenerMovimientos(tiendaId),
        cuentaCorrienteService.obtenerSaldoPorTienda(tiendaId),
      ]);
      setMovimientos(movimientosData);
      setSaldo(saldoData);
    } catch (e) {
      console.error("Error al cargar movimientos:", e);
    } finally {
      setLoading(false);
    }
  }, [tiendaId]);

  if (isOpen && !cargado) {
    setCargado(true);
    cargarDatos();
  }

  if (!isOpen && cargado) {
    setCargado(false);
    setMovimientos([]);
    setSaldo(null);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-400" />
            <h2 className="font-bold text-base">{tiendaNombre}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {saldo && (
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 p-3 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-700 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-semibold">Te Deben</span>
                </div>
                <p className="text-lg font-bold text-emerald-700">S/ {saldo.totalDebe.toFixed(2)}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1 text-red-700 mb-1">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-xs font-semibold">Les Debes</span>
                </div>
                <p className="text-lg font-bold text-red-700">S/ {saldo.totalHaber.toFixed(2)}</p>
              </div>
              <div className={`p-3 rounded-lg text-center ${saldo.saldoNeto >= 0 ? "bg-blue-50" : "bg-amber-50"}`}>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-xs font-semibold">Saldo Neto</span>
                </div>
                <p className={`text-lg font-bold ${saldo.saldoNeto >= 0 ? "text-blue-700" : "text-amber-700"}`}>
                  {saldo.saldoNeto >= 0 ? "+" : ""}S/ {saldo.saldoNeto.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <h4 className="text-sm font-bold text-slate-900 mb-3">Historial ({movimientos.length})</h4>
            {loading ? (
              <p className="text-xs text-gray-400 italic py-4 text-center">Cargando...</p>
            ) : movimientos.length === 0 ? (
              <p className="text-xs text-gray-400 italic py-4 text-center">No hay movimientos</p>
            ) : (
              <div className="space-y-2">
                {movimientos.map((m) => (
                  <div key={m.id} className={`flex items-start gap-3 p-3 rounded-lg border ${m.tipo === "DEBITO" ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"}`}>
                    <div className={`p-1.5 rounded-full ${m.tipo === "DEBITO" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {m.tipo === "DEBITO" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">{m.concepto}</p>
                        <span className={`text-sm font-bold ${m.tipo === "DEBITO" ? "text-emerald-700" : "text-red-700"}`}>
                          {m.tipo === "DEBITO" ? "+" : "-"}S/ {m.monto.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="h-3 w-3" />{m.fecha}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">{ORIGEN_LABELS[m.origen] || m.origen}</span>
                        {m.referencia && <span className="text-xs text-gray-400">Ref: {m.referencia}</span>}
                      </div>
                      {m.observaciones && <p className="text-xs text-gray-400 mt-1">{m.observaciones}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  );
}