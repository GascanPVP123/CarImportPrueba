import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarProvider>
    </ProtectedRoute>
  );
}