"use client";
import React, { createContext, useContext, useState } from "react";

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

const AuthContext = createContext<AuthContextType>(null!);

function getStoredAuth() {
  if (typeof window === "undefined") {
    return { token: null, user: null };
  }
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return {
    token,
    user: user ? JSON.parse(user) : null,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState(getStoredAuth);
  const [isLoading] = useState(false);

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
};

export const useAuth = () => useContext(AuthContext);