"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface User {
  username: string;
  rol: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
});

// Leer valores iniciales del localStorage (solo se ejecuta una vez al montar)
const getInitialAuth = () => {
  if (typeof window === "undefined") return { isAuthenticated: false, user: null };
  
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  if (token && userData) {
    try {
      return { isAuthenticated: true, user: JSON.parse(userData) as User };
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
  return { isAuthenticated: false, user: null };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState(getInitialAuth);
  const router = useRouter();

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ isAuthenticated: true, user });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ isAuthenticated: false, user: null });
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);