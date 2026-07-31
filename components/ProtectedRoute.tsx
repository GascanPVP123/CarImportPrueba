"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (typeof window !== "undefined" && !isAuthenticated) {
    router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    return null;
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}