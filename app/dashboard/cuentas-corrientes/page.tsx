
"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { 
  Search, RefreshCw, AlertCircle, Building2, DollarSign, 
  TrendingUp, TrendingDown, Wallet, Eye, Plus
} from "lucide-react";
import { cuentaCorrienteService, SaldoTienda, ResumenCuentas, MovimientoRequest } from "@/services/cuentaCorrienteService";
import { tiendaAliadaService, TiendaAliada } from "@/services/tiendaAliadaService";
import { ModalMovimiento } from "@/components/cuentas-corrientes/ModalMovimiento";
import { ModalDetalleTienda } from "@/components/cuentas-corrientes/ModalDetalleTienda";

const COLORES_ESTADO: Record<string, string> = {
  FAVOR_TUYO: "bg-emerald-100 text-emerald-800",
  FAVOR_TIENDA: "bg-red-100 text-red-800",
  BALANCEADO: "bg-gray-100 text-gray-600",
};

const LABELS_ESTADO: Record<string, string> = {
  FAVOR_TUYO: "A tu favor",
  FAVOR_TIENDA: "A favor tienda",
  BALANCEADO: "Balanceado",
};

const COLORES_ICONOS: Record<string, string> = {
  slate: "bg-slate-100 text-slate-700",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-600",
};

export default function CuentasCorrientesPage() {
  const [saldos, setSaldos] = useState<SaldoTienda[]>([]);
  const [tiendas, setTiendas] = useState<TiendaAliada[]>([]);
  const [resumen, setResumen] = useState<ResumenCuentas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");

  const [modalMovimientoOpen, setModalMovimientoOpen] = useState(false);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [tiendaSeleccionada, setTiendaSeleccionada] = useState<SaldoTienda | null>(null);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const [saldosData, resumenData, tiendasData] = await Promise.all([
        cuentaCorrienteService.obtenerSaldos(),
        cuentaCorrienteService.obtenerResumen(),
        tiendaAliadaService.listarActivas(),
      ]);
      setSaldos(saldosData);
      setResumen(resumenData);
      setTiendas(tiendasData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const saldosFiltrados = useMemo(() => {
    let resultado = saldos;
    if (filtroEstado !== "TODOS") resultado = resultado.filter(s => s.estadoSaldo === filtroEstado);
    if (busqueda.trim()) {
      const t = busqueda.toLowerCase();
      resultado = resultado.filter(s => s.tiendaNombre.toLowerCase().includes(t));
    }
    return resultado;
  }, [saldos, busqueda, filtroEstado]);

  const handleCrearMovimiento = async (data: MovimientoRequest) => {
    await cuentaCorrienteService.crearMovimiento(data);
    setModalMovimientoOpen(false);
    cargarDatos();
  };

  return (
    <div className="space-y-6 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Wallet className="h-8 w-8 text-emerald-600" />Cuentas Corrientes
          </h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona deudas, cobros y pagos con tiendas aliadas.</p>
        </div>
        <button onClick={() => { setTiendaSeleccionada(null); setModalMovimientoOpen(true); }} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition shadow-sm">
          <Plus className="h-4 w-4" /> Nuevo Movimiento
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPICard titulo="Tiendas" valor={resumen?.totalTiendas || 0} icono={<Building2 className="h-5 w-5" />} color="slate" />
        <KPICard titulo="Te Deben" valor={`S/ ${(resumen?.totalDebe || 0).toFixed(0)}`} icono={<TrendingUp className="h-5 w-5" />} color="emerald" />
        <KPICard titulo="Les Debes" valor={`S/ ${(resumen?.totalHaber || 0).toFixed(0)}`} icono={<TrendingDown className="h-5 w-5" />} color="red" />
        <KPICard titulo="Saldo Neto" valor={`S/ ${(resumen?.saldoNeto || 0).toFixed(0)}`} icono={<DollarSign className="h-5 w-5" />} color="blue" />
        <KPICard titulo="Balance" valor={(resumen?.saldoNeto || 0) >= 0 ? "Positivo ✅" : "Negativo ⚠️"} icono={<Wallet className="h-5 w-5" />} color={(resumen?.saldoNeto || 0) >= 0 ? "emerald" : "red"} />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar tienda..." className="w-full pl-9 pr-4 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
          </div>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="p-2 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none">
            <option value="TODOS">Todos</option>
            <option value="FAVOR_TUYO">A tu favor</option>
            <option value="FAVOR_TIENDA">A favor tienda</option>
            <option value="BALANCEADO">Balanceado</option>
          </select>
        </div>
        <button onClick={cargarDatos} disabled={loading} className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition disabled:opacity-50">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Recargar
        </button>
      </div>

      {error && <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-sm text-red-700"><AlertCircle className="h-5 w-5 text-red-500 shrink-0" /><span>{error}</span></div>}

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase font-semibold">
                <th className="py-3 px-4 text-left">Tienda</th>
                <th className="py-3 px-4 text-right">Te Deben</th>
                <th className="py-3 px-4 text-right">Les Debes</th>
                <th className="py-3 px-4 text-right">Saldo Neto</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 italic">Cargando...</td></tr>
              ) : saldosFiltrados.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400 italic">No hay movimientos registrados.</td></tr>
              ) : (
                saldosFiltrados.map((s) => (
                  <tr key={s.tiendaId} className="hover:bg-gray-50/70 transition">
                    <td className="py-3 px-4 font-medium">{s.tiendaNombre}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-emerald-700">S/ {s.totalDebe.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-red-700">S/ {s.totalHaber.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-bold">{s.saldoNeto >= 0 ? "+" : ""}S/ {s.saldoNeto.toFixed(2)}</td>
                    <td className="py-3 px-4 text-center"><span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${COLORES_ESTADO[s.estadoSaldo]}`}>{LABELS_ESTADO[s.estadoSaldo]}</span></td>
                    <td className="py-3 px-4 text-center">
                      <button onClick={() => { setTiendaSeleccionada(s); setModalDetalleOpen(true); }} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Ver"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => { setTiendaSeleccionada(s); setModalMovimientoOpen(true); }} className="p-1.5 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg ml-1" title="Nuevo"><Plus className="h-4 w-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalMovimiento isOpen={modalMovimientoOpen} onClose={() => setModalMovimientoOpen(false)} tiendas={tiendas} tiendaPreseleccionada={tiendaSeleccionada} onGuardar={handleCrearMovimiento} />
      {tiendaSeleccionada && <ModalDetalleTienda isOpen={modalDetalleOpen} onClose={() => setModalDetalleOpen(false)} tiendaId={tiendaSeleccionada.tiendaId} tiendaNombre={tiendaSeleccionada.tiendaNombre} />}
    </div>
  );
}

function KPICard({ titulo, valor, icono, color }: { titulo: string; valor: string | number; icono: React.ReactNode; color: string }) {
  return (
    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div><p className="text-xs font-semibold text-slate-500">{titulo}</p><h3 className="text-lg font-bold text-slate-900">{valor}</h3></div>
      <div className={`p-2 rounded-lg ${COLORES_ICONOS[color]}`}>{icono}</div>
    </div>
  );
}