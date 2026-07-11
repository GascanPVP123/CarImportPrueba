"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await authService.login(username, password);
      login(res.token, { username: res.username, rol: res.rol });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">
          CarImport System
        </h1>
        {error && (
          <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Usuario
            </label>
            <input
              type="text"
              className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full p-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}