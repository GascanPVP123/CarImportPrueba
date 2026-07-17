"use client";

import React, { useEffect, useState, useMemo } from "react";
import { productoService, Producto } from "@/services/productoService";
import { importadoraService, Importadora } from "@/services/importadoraService";
import { Plus, Trash2, Pencil, Search, X } from "lucide-react";

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [importadoras, setImportadoras] = useState<Importadora[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [importadoraFiltro, setImportadoraFiltro] = useState<string>("todas");

  // Modal producto
  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [form, setForm] = useState({
    codigoSku: "",
    nombre: "",
    descripcion: "",
    precioCompra: "",
    precioVenta: "",
    stock: "",
    stockMinimo: "",
    unidadMedida: "unidad",
    importadoraId: "",
  });

  // Modal importadora rápida
  const [modalImportadora, setModalImportadora] = useState(false);
  const [nuevaImportadora, setNuevaImportadora] = useState({ ruc: "", razonSocial: "", telefono: "" });

  useEffect(() => {
    Promise.all([
      productoService.listar(),
      importadoraService.listar(),
    ]).then(([prods, imps]) => {
      setProductos(prods);
      setImportadoras(imps);
    }).catch(console.error)
    .finally(() => setLoading(false));
  }, []);

  // ========================
  // FILTROS
  // ========================
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const matchBusqueda =
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.codigoSku.toLowerCase().includes(busqueda.toLowerCase());
      const matchImportadora =
        importadoraFiltro === "todas" ||
        p.importadora?.id?.toString() === importadoraFiltro;
      return matchBusqueda && matchImportadora;
    });
  }, [productos, busqueda, importadoraFiltro]);

  // ========================
  // MODAL PRODUCTO
  // ========================
  const abrirModalNuevo = () => {
    setEditandoId(null);
    setForm({
      codigoSku: "", nombre: "", descripcion: "",
      precioCompra: "", precioVenta: "",
      stock: "", stockMinimo: "",
      unidadMedida: "unidad", importadoraId: "",
    });
    setModalAbierto(true);
  };

  const abrirModalEditar = (prod: Producto) => {
    setEditandoId(prod.id!);
    setForm({
      codigoSku: prod.codigoSku,
      nombre: prod.nombre,
      descripcion: prod.descripcion || "",
      precioCompra: prod.precioCompra?.toString() || "",
      precioVenta: prod.precioVenta?.toString() || "",
      stock: prod.stock?.toString() || "",
      stockMinimo: prod.stockMinimo?.toString() || "",
      unidadMedida: prod.unidadMedida || "unidad",
      importadoraId: prod.importadora?.id?.toString() || "",
    });
    setModalAbierto(true);
  };

  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data: Producto = {
        codigoSku: form.codigoSku,
        nombre: form.nombre,
        descripcion: form.descripcion,
        precioCompra: parseFloat(form.precioCompra) || 0,
        precioVenta: parseFloat(form.precioVenta) || 0,
        stock: parseInt(form.stock) || 0,
        stockMinimo: parseInt(form.stockMinimo) || 3,
        unidadMedida: form.unidadMedida,
        importadora: form.importadoraId
          ? { id: parseInt(form.importadoraId), razonSocial: importadoras.find(i => i.id === parseInt(form.importadoraId))?.razonSocial || "" }
          : null,
      };

      if (editandoId) {
        await productoService.actualizar(editandoId, data);
      } else {
        await productoService.guardar(data);
      }
      setModalAbierto(false);
      const prods = await productoService.listar();
      setProductos(prods);
    } catch (err) {
      alert("Error al guardar producto");
    }
  };

  const eliminarProducto = async (id: number, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      await productoService.eliminar(id);
    } catch (err) {
      // ignorar
    }
    setProductos(prev => prev.filter((p) => p.id !== id));
  };

  // ========================
  // MODAL IMPORTADORA RÁPIDA
  // ========================
  const guardarImportadora = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imp = await importadoraService.guardar(nuevaImportadora);
      setImportadoras(prev => [...prev, imp]);
      setForm(prev => ({ ...prev, importadoraId: imp.id.toString() }));
      setModalImportadora(false);
      setNuevaImportadora({ ruc: "", razonSocial: "", telefono: "" });
    } catch (err) {
      alert("Error al guardar importadora");
    }
  };

  // ========================
  // RENDER
  // ========================
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-500 animate-pulse">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-slate-900">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventario de Productos</h1>
          <p className="text-slate-500 text-sm">{productos.length} productos</p>
        </div>
        <button onClick={abrirModalNuevo} className="flex items-center gap-2 bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition text-sm">
          <Plus className="h-4 w-4" /> Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border rounded-lg bg-white"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <select
          className="w-full sm:w-64 p-2.5 text-sm border rounded-lg bg-white"
          value={importadoraFiltro}
          onChange={(e) => setImportadoraFiltro(e.target.value)}
        >
          <option value="todas">Todas las importadoras</option>
          {importadoras.map((imp) => (
            <option key={imp.id} value={imp.id}>{imp.razonSocial}</option>
          ))}
        </select>
      </div>

      {/* Tabla */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b text-xs font-bold text-slate-500 uppercase">
              <tr>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Nombre</th>
                <th className="px-6 py-4">Importadora</th>
                <th className="px-6 py-4 text-right">P. Compra</th>
                <th className="px-6 py-4 text-right">P. Venta</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {productosFiltrados.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-400 italic">No se encontraron productos</td></tr>
              ) : (
                productosFiltrados.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{prod.codigoSku}</td>
                    <td className="px-6 py-4 font-semibold">{prod.nombre}</td>
                    <td className="px-6 py-4 text-slate-600">{prod.importadora?.razonSocial || "—"}</td>
                    <td className="px-6 py-4 text-right">S/ {prod.precioCompra?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right font-semibold">S/ {prod.precioVenta?.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${prod.stock <= prod.stockMinimo ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                        {prod.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => abrirModalEditar(prod)} className="p-1.5 text-slate-400 hover:text-blue-600 rounded"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => prod.id && eliminarProducto(prod.id, prod.nombre)} className="p-1.5 text-slate-400 hover:text-red-600 rounded"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================== */}
      {/* MODAL PRODUCTO           */}
      {/* ======================== */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setModalAbierto(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
            <h2 className="text-xl font-bold mb-4">{editandoId ? "Editar Producto" : "Nuevo Producto"}</h2>
            <form onSubmit={guardarProducto} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Código SKU</label>
                  <input type="text" required className="w-full p-2.5 text-sm border rounded-lg" value={form.codigoSku} onChange={(e) => setForm({...form, codigoSku: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre</label>
                  <input type="text" required className="w-full p-2.5 text-sm border rounded-lg" value={form.nombre} onChange={(e) => setForm({...form, nombre: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción</label>
                <textarea rows={2} className="w-full p-2.5 text-sm border rounded-lg" value={form.descripcion} onChange={(e) => setForm({...form, descripcion: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio Compra</label>
                  <input type="number" step="0.01" placeholder="0.00" className="w-full p-2.5 text-sm border rounded-lg" value={form.precioCompra} onChange={(e) => setForm({...form, precioCompra: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio Venta</label>
                  <input type="number" step="0.01" placeholder="0.00" className="w-full p-2.5 text-sm border rounded-lg" value={form.precioVenta} onChange={(e) => setForm({...form, precioVenta: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock</label>
                  <input type="number" placeholder="0" className="w-full p-2.5 text-sm border rounded-lg" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Mínimo</label>
                  <input type="number" placeholder="3" className="w-full p-2.5 text-sm border rounded-lg" value={form.stockMinimo} onChange={(e) => setForm({...form, stockMinimo: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Unidad</label>
                  <select className="w-full p-2.5 text-sm border rounded-lg" value={form.unidadMedida} onChange={(e) => setForm({...form, unidadMedida: e.target.value})}>
                    <option value="unidad">Unidad</option>
                    <option value="par">Par</option>
                    <option value="doc">Docena</option>
                    <option value="pack">Pack</option>
                    <option value="caja">Caja</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Importadora</label>
                <div className="flex items-end gap-2">
                  <select className="flex-1 p-2.5 text-sm border rounded-lg" value={form.importadoraId} onChange={(e) => setForm({...form, importadoraId: e.target.value})}>
                    <option value="">Sin importadora</option>
                    {importadoras.map((imp) => (
                      <option key={imp.id} value={imp.id}>{imp.razonSocial}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => setModalImportadora(true)} className="p-2.5 text-sm font-bold border rounded-lg hover:bg-gray-100" title="Nueva importadora">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {form.importadoraId && (
                  <div className="mt-2 flex gap-3">
                    <button type="button" onClick={() => setForm({ ...form, importadoraId: "" })} className="text-xs text-blue-600 hover:text-blue-800 hover:underline">Desvincular</button>
                    <button
                      type="button"
                      onClick={async () => {
                        const imp = importadoras.find(i => i.id === parseInt(form.importadoraId));
                        if (!imp) return;
                        if (!confirm(`¿Eliminar definitivamente la importadora "${imp.razonSocial}"?`)) return;
                        try {
                          await importadoraService.eliminar(imp.id);
                          setImportadoras(prev => prev.filter(i => i.id !== imp.id));
                          setForm(prev => ({ ...prev, importadoraId: "" }));
                          const prods = await productoService.listar();
                          setProductos(prods);
                        } catch (err) {
                          alert("No se pudo eliminar la importadora.");
                        }
                      }}
                      className="text-xs text-red-600 hover:text-red-800 hover:underline"
                    >
                      Eliminar importadora
                    </button>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setModalAbierto(false)} className="px-4 py-2 text-sm font-semibold border rounded-lg hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">
                  {editandoId ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================== */}
      {/* MODAL IMPORTADORA RÁPIDA */}
      {/* ======================== */}
      {modalImportadora && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Nueva Importadora</h3>
              <button onClick={() => setModalImportadora(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={guardarImportadora} className="space-y-3">
              <input type="text" required placeholder="RUC" className="w-full p-2.5 text-sm border rounded-lg" value={nuevaImportadora.ruc} onChange={(e) => setNuevaImportadora({ ...nuevaImportadora, ruc: e.target.value })} />
              <input type="text" required placeholder="Razón Social" className="w-full p-2.5 text-sm border rounded-lg" value={nuevaImportadora.razonSocial} onChange={(e) => setNuevaImportadora({ ...nuevaImportadora, razonSocial: e.target.value })} />
              <input type="text" placeholder="Teléfono" className="w-full p-2.5 text-sm border rounded-lg" value={nuevaImportadora.telefono} onChange={(e) => setNuevaImportadora({ ...nuevaImportadora, telefono: e.target.value })} />
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setModalImportadora(false)} className="px-4 py-2 text-sm border rounded-lg">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg font-bold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}