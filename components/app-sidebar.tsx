"use client";

import * as React from "react";
import { LayoutDashboard, Package, FileText, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Configuración de las rutas del ERP de Autopartes
const data = {
  empresa: {
    nombre: "CarImport S.A.C.",
    version: "v1.0.0",
  },
  navegacion: [
    {
      title: "Core del Sistema",
      items: [
        {
          title: "Dashboard / Inicio",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Inventario Productos",
          url: "/dashboard/productos",
          icon: Package,
        },
        {
          title: "Nueva Cotización",
          url: "/dashboard/cotizaciones",
          icon: FileText,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-slate-800">
      {/* Cabecera del Sidebar */}
      <SidebarHeader className="bg-slate-950 p-4 border-b border-slate-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-3 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-slate-950 font-bold">
                CI
              </div>
              <div className="flex flex-col gap-0.5 overflow-hidden">
                <span className="font-semibold text-sm truncate text-slate-200">{data.empresa.nombre}</span>
                <span className="text-xs text-slate-400 font-medium">{data.empresa.version}</span>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Contenido / Menú de Navegación */}
      <SidebarContent className="bg-slate-900 px-2 py-4">
        {data.navegacion.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-slate-400 text-xs font-bold px-3 uppercase tracking-wider mb-2">
              {group.title}
            </SidebarGroupLabel>
            <SidebarMenu className="gap-1">
              {group.items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            className={`w-full transition-colors font-medium text-sm flex items-center gap-3 px-3 py-2.5 rounded-md ${
                            isActive
                                ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                            }`}
                        >
                            {/* Pasamos los estilos y la navegación directo al Link interno */}
                            <Link href={item.url} className="flex items-center gap-3 w-full">
                            <item.icon className={`h-4 w-4 shrink-0 ${isActive ? "text-slate-950" : "text-slate-400"}`} />
                            <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer / Botón Cerrar Sesión */}
      <SidebarFooter className="bg-slate-950 p-3 border-t border-slate-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <button
              onClick={() => router.push("/login")}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-950/40 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Cerrar Sesión</span>
            </button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}