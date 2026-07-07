"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white shadow-sm">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium text-slate-500">CarImport System</span>
        </header>
        
        {/* Aquí se inyectará dinámicamente la página de inicio o el formulario */}
        <main className="p-6 bg-slate-50 flex-1">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}