"use client";

import React, { useState } from "react";
import { X, Building2, ArrowRightLeft } from "lucide-react";
import { TiendaAliada } from "@/services/tiendaAliadaService";
import { MovimientoRequest, SaldoTienda } from "@/services/cuentaCorrienteService";

interface ModalMovimientoProps {
  isOpen: boolean;
  onClose: () => void;
  tiendas: TiendaAliada[];
  tiendaPreseleccionada?: SaldoTienda | null;
  onGuardar: (data: MovimientoRequest) => Promise<void>;
}

const ORIGENES = [
  { value: "VENTA_DIRECTA", label: "Venta Directa" },
  { value: "COMPRA", label: "Compra a Tienda" },
  { value: "PAGO_RECIBIDO", label: "Pago Recibido" },
  { value: "GASTO_COMPARTIDO", label: "Gasto Compartido" },
  { value: "AJUSTE", label: "Ajuste" },
  { value: "OTRO", label: "Otro" },
];

export function ModalMovimiento({
  isOpen,
  onClose,
  tiendas,
  tiendaPreseleccionada,
  onGuardar,
}: ModalMovimientoProps) {
  const [tiendaId, setTiendaId] = useState<number | null>(
    tiendaPreseleccionada?.tiendaId || null
  );
  const [tipo, setTipo] = useState<"DEBITO" | "CREDITO">("DEBITO");
  const [origen, setOrigen] = useState("VENTA_DIRECTA");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState<number>(0);
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [referencia, setReferencia] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!tiendaId) {
      setError("Selecciona una tienda");
      return;
    }

    if (!concepto.trim()) {
      setError("El concepto es obligatorio");
      return;
    }

    if (monto <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }

    const data: MovimientoRequest = {
      tiendaId,
      tipo,
      origen,
      concepto: concepto.trim(),
      monto,
      fecha,
      referencia: referencia.trim() || undefined,
      observaciones: observaciones.trim() || undefined,
    };

    try {
      setLoading(true);
      await onGuardar(data);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar movimiento");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-700 text-white">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            <h2 className="font-bold text-base">Nuevo Movimiento</h2>
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

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-gray-400" /> Tienda *
            </label>
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
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Tipo *</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setTipo("DEBITO")}
                className={`p-2.5 rounded-lg text-sm font-bold border transition ${tipo === "DEBITO" ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
                📥 Te Deben
              </button>
              <button type="button" onClick={() => setTipo("CREDITO")}
                className={`p-2.5 rounded-lg text-sm font-bold border transition ${tipo === "CREDITO" ? "bg-red-50 border-red-500 text-red-700" : "bg-gray-50 border-gray-200 text-gray-500"}`}>
                📤 Les Debes
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Origen *</label>
            <select value={origen} onChange={(e) => setOrigen(e.target.value)}
              className="w-full p-2.5 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none">
              {ORIGENES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Concepto *</label>
            <input type="text" value={concepto} onChange={(e) => setConcepto(e.target.value)}
              placeholder="Ej: Venta de 10 focos H4"
              className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Monto (S/) *</label>
              <input type="number" step="0.01" min="0" value={monto || ""}
                onChange={(e) => setMonto(parseFloat(e.target.value) || 0)} placeholder="0.00"
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">Fecha *</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)}
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Referencia <span className="text-gray-400 font-normal">(Opcional)</span></label>
            <input type="text" value={referencia} onChange={(e) => setReferencia(e.target.value)}
              placeholder="Ej: Recibo #001" className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Observaciones <span className="text-gray-400 font-normal">(Opcional)</span></label>
            <textarea rows={2} value={observaciones} onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Notas adicionales..." className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50">Cancelar</button>
            <button type="submit" disabled={loading} className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition shadow-sm disabled:bg-gray-300">
              {loading ? "Guardando..." : "Guardar Movimiento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}