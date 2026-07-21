// app/dashboard/page.tsx
import Link from "next/link";
import { Package, Building2, ShoppingCart, TrendingUp } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Panel Principal</h1>
        <p className="text-slate-500 text-sm">Bienvenido al sistema de gestión.</p>
      </div>

      {/* Tarjetas de acceso rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        <Link 
          href="/dashboard/productos"
          className="p-5 bg-white border rounded-xl shadow-sm hover:border-emerald-500 transition group"
        >
          <div className="flex items-center justify-between mb-3">
            <Package className="h-8 w-8 text-emerald-600 group-hover:scale-110 transition" />
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              Gestionar →
            </span>
          </div>
          <h3 className="font-bold text-slate-900">Productos e Inventario</h3>
          <p className="text-xs text-slate-500 mt-1">
            Consulta el catálogo, stock por importadora y tarifas al mayor/menor.
          </p>
        </Link>

        {/* Agrega aquí otras secciones como Clientes, Ventas o Importadoras */}

      </div>
    </div>
  );
}