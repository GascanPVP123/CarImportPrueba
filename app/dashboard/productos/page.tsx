"use client";

import React, { useEffect, useState } from "react";
import { productoService, Producto } from "@/services/productoService";
import { Trash2, Pencil, Plus, RefreshCw, AlertTriangle, Search, X } from "lucide-react";

export default function InventarioProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState<string>("");

  // 📝 ESTADOS PARA EL MODAL DE CREACIÓN
  const [modalCrearAbierto, setModalCrearAbierto] = useState<boolean>(false);
  const [formCrear, setFormCrear] = useState({
    codigoSku: "",
    nombre: "",
    descripcion: "",
    precioCompra: 0,
    precioVenta: 0,
    stock: 0,
    stockMinimo: 10,
    imagenUrl: "",
  });

  // ✏️ ESTADOS PARA EL MODAL DE EDICIÓN
  const [productoAEditar, setProductoAEditar] = useState<Producto | null>(null);

  // 🔄 EFECTO COMPLETO PARA LEER REGISTROS
  useEffect(() => {
    const cargarProductos = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await productoService.listar();
        setProductos(data);
      } catch (err) {
        console.error(err);
        setError("No se pudo conectar con el servidor de Spring Boot.");
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

  // Handler para recargar manualmente con el botón
  const manejarRecargar = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productoService.listar();
      setProductos(data);
    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor de Spring Boot.");
    } finally {
      setLoading(false);
    }
  };

  // Handler para guardar un nuevo producto
  const manejarCrearProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const nuevoProd = await productoService.guardar(formCrear as Producto);
      alert("¡Producto registrado con éxito!");
      setProductos([nuevoProd, ...productos]);
      setModalCrearAbierto(false);
      setFormCrear({ codigoSku: "", nombre: "", descripcion: "", precioCompra: 0, precioVenta: 0, stock: 0, stockMinimo: 10, imagenUrl: "" });
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : "Error al guardar el producto.";
      alert(mensaje);
    }
  };

  // 🔥 HANDLER PARA EDITAR EL PRODUCTO EXISTENTE (PUT)
  const manejarActualizarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productoAEditar || !productoAEditar.id) return;

    try {
      const prodActualizado = await productoService.actualizar(productoAEditar.id, productoAEditar);
      alert("¡Autoparte actualizada en MySQL correctamente!");
      
      // Reemplazamos el producto viejo por el editado en el estado local de la tabla
      setProductos(productos.map((p) => (p.id === productoAEditar.id ? prodActualizado : p)));
      setProductoAEditar(null); // Cerramos el modal
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : "Error al actualizar la data.";
      alert(mensaje);
    }
  };

  const manejarEliminar = async (id: number, nombre: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${nombre}"?`)) return;
    try {
      await productoService.eliminar(id);
      alert("Producto eliminado.");
      setProductos(productos.filter((p) => p.id !== id));
    } catch (err: unknown) {
      const mensaje = err instanceof Error ? err.message : "Error: Producto enlazado a cotizaciones o error de servidor.";
      alert(mensaje);
    }
  };

  const productosFiltrados = productos.filter((p) => {
    const termino = busqueda.toLowerCase();
    return p.nombre.toLowerCase().includes(termino) || p.codigoSku.toLowerCase().includes(termino);
  });

  return (
    <div className="space-y-6 text-slate-900 relative">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventario de Autopartes 📦</h1>
          <p className="text-slate-500 text-sm">Control general de stock, precios y SKUs de importación.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={manejarRecargar} className="p-2.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 text-slate-600 transition shadow-sm">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={() => setModalCrearAbierto(true)} className="flex items-center gap-2 bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition text-sm shadow-sm">
            <Plus className="h-4 w-4" />
            <span>Nuevo Producto</span>
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="flex items-center max-w-sm relative">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre o SKU..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Tabla */}
      {loading ? (
        <p className="text-slate-500 font-medium animate-pulse py-8 text-center">Leyendo registros de MySQL...</p>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Imagen</th>
                  <th className="px-6 py-4">SKU / Código</th>
                  <th className="px-6 py-4">Descripción del Repuesto</th>
                  <th className="px-6 py-4">Importadora Proveedora</th>
                  <th className="px-6 py-4 text-right">P. Compra</th>
                  <th className="px-6 py-4 text-right">P. Venta</th>
                  <th className="px-6 py-4 text-center">Stock Real</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {productosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 italic">No se encontraron productos.</td>
                  </tr>
                ) : (
                  productosFiltrados.map((prod) => {
                    const esStockBajo = prod.stock <= prod.stockMinimo;
                    return (
                      <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-3">
                          {prod.imagenUrl ? (
                            <img src={prod.imagenUrl} alt={prod.nombre} className="h-10 w-12 object-cover rounded-md border border-slate-200" />
                          ) : (
                            <div className="h-10 w-12 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center text-xs text-slate-400">N/A</div>
                          )}
                        </td>
                        <td className="px-6 py-3 font-mono font-bold text-slate-900 text-xs">
                          <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700">{prod.codigoSku}</span>
                        </td>
                        <td className="px-6 py-3 max-w-xs">
                          <div className="font-semibold text-slate-900 truncate">{prod.nombre}</div>
                          <div className="text-xs text-slate-400 truncate mt-0.5">{prod.descripcion}</div>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {prod.importadora ? prod.importadora.razonSocial : "Sin Asignar"}
                        </td>
                        <td className="px-6 py-3 text-right font-medium text-slate-500">S/. {prod.precioCompra.toFixed(2)}</td>
                        <td className="px-6 py-3 text-right font-semibold text-slate-900">S/. {prod.precioVenta.toFixed(2)}</td>
                        <td className="px-6 py-3 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${esStockBajo ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}>
                            {prod.stock} uds
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => setProductoAEditar({...prod})} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg transition" title="Editar repuesto">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button onClick={() => prod.id && manejarEliminar(prod.id, prod.nombre)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition"><Trash2 className="h-4 w-4" /></button>
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
      )}

      {/* 🟢 MODAL 1: REGISTRO DE PRODUCTO */}
      {modalCrearAbierto && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setModalCrearAbierto(false)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"><X className="h-4 w-4" /></button>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Registrar Nueva Autoparte</h2>
            <p className="text-slate-500 text-xs mb-6">Completa la ficha técnica para añadir el repuesto al catálogo.</p>
            <form onSubmit={manejarCrearProducto} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Código SKU</label>
                  <input type="text" required className="w-full p-2 text-sm border rounded-lg" value={formCrear.codigoSku} onChange={(e) => setFormCrear({...formCrear, codigoSku: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Comercial</label>
                  <input type="text" required className="w-full p-2 text-sm border rounded-lg" value={formCrear.nombre} onChange={(e) => setFormCrear({...formCrear, nombre: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción General</label>
                <textarea rows={2} className="w-full p-2 text-sm border rounded-lg" value={formCrear.descripcion} onChange={(e) => setFormCrear({...formCrear, descripcion: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio Compra (S/.)</label>
                  <input type="number" step="0.01" required className="w-full p-2 text-sm border rounded-lg" value={formCrear.precioCompra || ""} onChange={(e) => setFormCrear({...formCrear, precioCompra: parseFloat(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio Venta (S/.)</label>
                  <input type="number" step="0.01" required className="w-full p-2 text-sm border rounded-lg" value={formCrear.precioVenta || ""} onChange={(e) => setFormCrear({...formCrear, precioVenta: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Inicial</label>
                  <input type="number" required className="w-full p-2 text-sm border rounded-lg" value={formCrear.stock || ""} onChange={(e) => setFormCrear({...formCrear, stock: parseInt(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Mínimo</label>
                  <input type="number" required className="w-full p-2 text-sm border rounded-lg" value={formCrear.stockMinimo || ""} onChange={(e) => setFormCrear({...formCrear, stockMinimo: parseInt(e.target.value) || 10})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL de la Imagen</label>
                <input type="text" className="w-full p-2 text-sm border rounded-lg" value={formCrear.imagenUrl} onChange={(e) => setFormCrear({...formCrear, imagenUrl: e.target.value})} />
              </div>
              <div className="flex items-center justify-end gap-2 border-t pt-4 mt-6">
                <button type="button" onClick={() => setModalCrearAbierto(false)} className="px-4 py-2 text-sm font-semibold border rounded-lg hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700">Guardar en MySQL</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔵 MODAL 2: ACTUALIZACIÓN / EDICIÓN DE PRODUCTO */}
      {productoAEditar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border rounded-xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button onClick={() => setProductoAEditar(null)} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"><X className="h-4 w-4" /></button>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Editar Ficha de Autoparte</h2>
            <p className="text-slate-500 text-xs mb-6">Modifica las propiedades técnicas seleccionadas en caliente.</p>
            <form onSubmit={manejarActualizarProducto} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Código SKU</label>
                  <input type="text" required className="w-full p-2 text-sm border rounded-lg bg-slate-50 text-slate-500" value={productoAEditar.codigoSku} disabled />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Comercial</label>
                  <input type="text" required className="w-full p-2 text-sm border rounded-lg" value={productoAEditar.nombre} onChange={(e) => setProductoAEditar({...productoAEditar, nombre: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Descripción General</label>
                <textarea rows={2} className="w-full p-2 text-sm border rounded-lg" value={productoAEditar.descripcion} onChange={(e) => setProductoAEditar({...productoAEditar, descripcion: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio Compra (S/.)</label>
                  <input type="number" step="0.01" required className="w-full p-2 text-sm border rounded-lg" value={productoAEditar.precioCompra} onChange={(e) => setProductoAEditar({...productoAEditar, precioCompra: parseFloat(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Precio Venta (S/.)</label>
                  <input type="number" step="0.01" required className="w-full p-2 text-sm border rounded-lg" value={productoAEditar.precioVenta} onChange={(e) => setProductoAEditar({...productoAEditar, precioVenta: parseFloat(e.target.value) || 0})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Actual</label>
                  <input type="number" required className="w-full p-2 text-sm border rounded-lg" value={productoAEditar.stock} onChange={(e) => setProductoAEditar({...productoAEditar, stock: parseInt(e.target.value) || 0})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Stock Mínimo</label>
                  <input type="number" required className="w-full p-2 text-sm border rounded-lg" value={productoAEditar.stockMinimo} onChange={(e) => setProductoAEditar({...productoAEditar, stockMinimo: parseInt(e.target.value) || 10})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL de la Imagen</label>
                <input type="text" className="w-full p-2 text-sm border rounded-lg" value={productoAEditar.imagenUrl || ""} onChange={(e) => setProductoAEditar({...productoAEditar, imagenUrl: e.target.value})} />
              </div>
              <div className="flex items-center justify-end gap-2 border-t pt-4 mt-6">
                <button type="button" onClick={() => setProductoAEditar(null)} className="px-4 py-2 text-sm font-semibold border rounded-lg hover:bg-slate-50">Cancelar</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">Actualizar Cambios</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}