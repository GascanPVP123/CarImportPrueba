"use client";

import React, { useEffect, useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Package, 
  RefreshCw, 
  AlertCircle, 
  Building2, 
  AlertTriangle, 
  DollarSign, 
  Boxes 
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

import { productoService, Producto } from "@/services/productoService";
import { ModalProducto } from "@/components/modales/ModalProducto";

const COLORES_GRAFICO = ["#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6", "#64748B"];

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>("");

  // Modales
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [productoEditar, setProductoEditar] = useState<Producto | null>(null);

  useEffect(() => {
    let ignore = false;

    const ejecutarCarga = async () => {
      try {
        const data = await productoService.listar();
        if (!ignore) {
          setProductos(data);
          setError(null);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error al obtener productos.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    ejecutarCarga();

    return () => {
      ignore = true;
    };
  }, []);

  const handleRecargar = async () => {
    setLoading(true);
    try {
      const data = await productoService.listar();
      setProductos(data);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al recargar productos.");
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoProducto = () => {
    setProductoEditar(null);
    setModalOpen(true);
  };

  const handleEditarProducto = (prod: Producto) => {
    setProductoEditar(prod);
    setModalOpen(true);
  };

  const handleEliminarProducto = async (id?: number) => {
    if (!id) return;
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) return;

    try {
      await productoService.eliminar(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
    } catch (err: unknown) {
      alert(`Error al eliminar: ${err instanceof Error ? err.message : "Error desconocido"}`);
    }
  };

  const handleGuardarProducto = async (productoForm: Producto) => {
    if (productoForm.id) {
      const actualizado = await productoService.actualizar(productoForm.id, productoForm);
      setProductos((prev) =>
        prev.map((p) => (p.id === actualizado.id ? actualizado : p))
      );
    } else {
      const nuevo = await productoService.guardar(productoForm);
      setProductos((prev) => [...prev, nuevo]);
    }
    await handleRecargar();
  };

  // 🟢 FILTRADO
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const termino = busqueda.toLowerCase().trim();
      const skuMatch = p.codigoSku?.toLowerCase().includes(termino) ?? false;
      const nombreMatch = p.nombre.toLowerCase().includes(termino);
      const impMatch = p.importadora?.razonSocial?.toLowerCase().includes(termino) ?? false;
      return skuMatch || nombreMatch || impMatch;
    });
  }, [productos, busqueda]);

  // 🟢 CÁLCULO DE KPIS
  const kpis = useMemo(() => {
    const totalProductos = productos.length;
    const stockTotal = productos.reduce((acc, p) => acc + (p.stock || 0), 0);
    const bajoStock = productos.filter((p) => (p.stock || 0) <= 5).length;
    const valorizacionTotal = productos.reduce(
      (acc, p) => acc + (p.stock || 0) * (p.precioMenor || p.precioVenta || 0),
      0
    );

    return { totalProductos, stockTotal, bajoStock, valorizacionTotal };
  }, [productos]);

  // 🟢 DATOS PARA GRÁFICO POR IMPORTADORA
  const datosGraficoImportadora = useMemo(() => {
    const mapa: Record<string, number> = {};

    productos.forEach((p) => {
      const nombreImp = p.importadora?.razonSocial || "Sin Importadora";
      mapa[nombreImp] = (mapa[nombreImp] || 0) + 1;
    });

    return Object.keys(mapa).map((key) => ({
      name: key,
      value: mapa[key],
    }));
  }, [productos]);

  // 🟢 DATOS PARA GRÁFICO DE STOCK CRÍTICO (TOP 5)
  const datosGraficoStockBajo = useMemo(() => {
    return [...productos]
      .sort((a, b) => (a.stock || 0) - (b.stock || 0))
      .slice(0, 5)
      .map((p) => ({
        nombre: p.nombre.length > 15 ? `${p.nombre.substring(0, 15)}...` : p.nombre,
        stock: p.stock || 0,
      }));
  }, [productos]);

  return (
    <div className="space-y-6 text-slate-900">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Package className="h-8 w-8 text-emerald-600" />
            Gestión de Productos
          </h1>
          <p className="text-slate-500 text-sm">
            Administra el catálogo de repuestos, stock, importadoras y tarifas.
          </p>
        </div>

        <button
          onClick={handleNuevoProducto}
          className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
        >
          <Plus className="h-4 w-4" /> Nuevo Producto
        </button>
      </div>

      {/* 🟢 TARJETAS KPI (METRICAS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Productos</p>
            <h3 className="text-2xl font-bold text-slate-900">{kpis.totalProductos}</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Package className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Stock Acumulado</p>
            <h3 className="text-2xl font-bold text-slate-900">{kpis.stockTotal} <span className="text-xs font-normal text-slate-500">und.</span></h3>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Boxes className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">En Alerta (Stock ≤ 5)</p>
            <h3 className="text-2xl font-bold text-amber-600">{kpis.bajoStock}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500">Valorización Estimada</p>
            <h3 className="text-xl font-bold text-slate-900">S/ {kpis.valorizacionTotal.toFixed(2)}</h3>
          </div>
          <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* 🟢 SECCIÓN DE GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* GRÁFICO 1: DISTRIBUCIÓN POR IMPORTADORA */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-600" />
            Distribución por Importadora
          </h4>
          <div className="h-60 w-full">
            {datosGraficoImportadora.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                Sin datos de importadoras registrados
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={datosGraficoImportadora}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {datosGraficoImportadora.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORES_GRAFICO[index % COLORES_GRAFICO.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} productos`, "Cantidad"]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* GRÁFICO 2: PRODUCTOS CON MENOR STOCK */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            Top 5 Productos con Menor Stock
          </h4>
          <div className="h-60 w-full">
            {datosGraficoStockBajo.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                Sin productos en catálogo
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={datosGraficoStockBajo} layout="vertical">
                  <XAxis type="number" />
                  <YAxis dataKey="nombre" type="category" width={110} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(value) => [`${value} unidades`, "Stock"]} />
                  <Bar dataKey="stock" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* BARRA DE BÚSQUEDA Y HERRAMIENTAS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por SKU, nombre o importadora..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <button
          onClick={handleRecargar}
          className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Recargar
        </button>
      </div>

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* TABLA DE PRODUCTOS */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-white text-xs uppercase font-semibold">
                <th className="py-3 px-4 text-left">SKU / Código</th>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Importadora</th>
                <th className="py-3 px-4 text-center">Und.</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-right">P. Menor (S/)</th>
                <th className="py-3 px-4 text-right">P. Mayor (S/)</th>
                <th className="py-3 px-4 text-center w-28">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 italic">
                    Cargando catálogo de productos...
                  </td>
                </tr>
              ) : productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-400 italic">
                    {busqueda
                      ? "No se encontraron productos que coincidan con la búsqueda."
                      : "No hay productos registrados en el sistema."}
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((p) => {
                  const pMenor = p.precioMenor ?? p.precioVenta ?? 0;
                  const pMayor = p.precioMayor ?? 0;

                  return (
                    <tr key={p.id} className="hover:bg-gray-50/70 transition">
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-slate-700">
                        {p.codigoSku || "—"}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{p.nombre}</div>
                        {p.descripcion && (
                          <div className="text-xs text-slate-400 truncate max-w-xs">
                            {p.descripcion}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {p.importadora?.razonSocial ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            <Building2 className="h-3 w-3 text-slate-500" />
                            {p.importadora.razonSocial}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center text-xs text-gray-500 uppercase">
                        {p.unidadMedida || "unidad"}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            p.stock > 5
                              ? "bg-emerald-100 text-emerald-800"
                              : p.stock > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {p.stock}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                        S/ {pMenor.toFixed(2)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-semibold text-blue-700">
                        {pMayor > 0 ? `S/ ${pMayor.toFixed(2)}` : "—"}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEditarProducto(p)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Editar producto"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEliminarProducto(p.id)}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Eliminar producto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ModalProducto
        key={productoEditar ? `edit-${productoEditar.id}` : "nuevo"}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setProductoEditar(null);
        }}
        onGuardar={handleGuardarProducto}
        productoEditar={productoEditar}
      />
    </div>
  );
}