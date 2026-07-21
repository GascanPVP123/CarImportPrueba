"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthUser {
  username: string;
  rol: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
}

// 1. Estado inicial por defecto por si se invoca antes de tiempo
const defaultContextValue: AuthContextType = {
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
};

const AuthContext = createContext<AuthContextType>(defaultContextValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<{ token: string | null; user: AuthUser | null }>({
    token: null,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Evitamos el warning del linter posponiendo la carga al microtask
    queueMicrotask(() => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;

        if (token && user) {
          setAuth({ token, user });
        }
      } catch (e) {
        console.error("Error al cargar sesión de localStorage", e);
      } finally {
        setIsLoading(false);
      }
    });
  }, []);

  const login = (token: string, user: AuthUser) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        token: auth.token,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 2. Retornamos defaultContextValue en lugar de null si algo falla en la jerarquía
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context || defaultContextValue;
};