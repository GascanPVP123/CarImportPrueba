"use client";

import React, { useState } from "react";
import { X, Building2, Phone, MapPin, User, Mail } from "lucide-react";
import { TiendaAliada } from "@/services/tiendaAliadaService";

interface ModalTiendaAliadaProps {
  isOpen: boolean;
  onClose: () => void;
  onGuardar: (tienda: TiendaAliada) => Promise<void>;
  tiendaEditar?: TiendaAliada | null;
}

const FORM_INICIAL: TiendaAliada = {
  nombre: "",
  ruc: "",
  direccion: "",
  telefono: "",
  contacto: "",
  email: "",
  observaciones: "",
  activo: true,
};

export function ModalTiendaAliada({
  isOpen,
  onClose,
  onGuardar,
  tiendaEditar,
}: ModalTiendaAliadaProps) {
  const [contador, setContador] = useState(0);

  if (!isOpen) return null;

  return (
    <ModalTiendaAliadaInner
      key={`tienda-${tiendaEditar?.id ?? "nueva"}-${contador}`}
      onClose={() => {
        setContador(c => c + 1);
        onClose();
      }}
      onGuardar={onGuardar}
      tiendaEditar={tiendaEditar}
    />
  );
}

function ModalTiendaAliadaInner({
  onClose,
  onGuardar,
  tiendaEditar,
}: {
  onClose: () => void;
  onGuardar: (tienda: TiendaAliada) => Promise<void>;
  tiendaEditar?: TiendaAliada | null;
}) {
  const [form, setForm] = useState<TiendaAliada>(() => 
    tiendaEditar ? { ...tiendaEditar } : { ...FORM_INICIAL }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.nombre.trim()) {
      setError("El nombre de la tienda es obligatorio");
      return;
    }

    try {
      setLoading(true);
      await onGuardar(form);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar la tienda");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-emerald-400" />
            <h2 className="font-bold text-base">
              {tiendaEditar ? "Editar Tienda" : "Nueva Tienda Aliada"}
            </h2>
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

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5 text-gray-400" /> Nombre *
            </label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Repuestos La Esquina"
              className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 block">RUC</label>
              <input
                type="text"
                maxLength={11}
                value={form.ruc || ""}
                onChange={(e) => setForm({ ...form, ruc: e.target.value })}
                placeholder="20601234567"
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Phone className="h-3.5 w-3.5 text-gray-400" /> Teléfono
              </label>
              <input
                type="text"
                value={form.telefono || ""}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                placeholder="987654321"
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-gray-400" /> Dirección
            </label>
            <input
              type="text"
              value={form.direccion || ""}
              onChange={(e) => setForm({ ...form, direccion: e.target.value })}
              placeholder="Av. Principal 123"
              className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-gray-400" /> Contacto
              </label>
              <input
                type="text"
                value={form.contacto || ""}
                onChange={(e) => setForm({ ...form, contacto: e.target.value })}
                placeholder="Nombre del encargado"
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-gray-400" /> Email
              </label>
              <input
                type="email"
                value={form.email || ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="tienda@email.com"
                className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 mb-1 block">Observaciones</label>
            <textarea
              rows={2}
              value={form.observaciones || ""}
              onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
              placeholder="Notas adicionales..."
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
              {loading ? "Guardando..." : tiendaEditar ? "Actualizar" : "Crear Tienda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}