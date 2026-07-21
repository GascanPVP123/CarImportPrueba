// components/ProtectedRoute.tsx
"use client";

import { useAuth } from "@/context/AuthContext"; // 👈 Asegúrate de que apunte a context y no a hooks
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span>Cargando...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}