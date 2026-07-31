"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { Eye, EyeOff, User, Mail, Lock, Package } from "lucide-react";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.username.trim() || form.username.trim().length < 3) {
      setError("El usuario debe tener al menos 3 caracteres");
      return;
    }

    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Ingresa un email válido");
      return;
    }

    if (!form.password || form.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);
      const res = await authService.register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setSuccess("¡Cuenta creada! Redirigiendo...");
      login(res.token, { username: res.username, rol: res.rol });

      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500">
              <Package className="h-8 w-8 text-slate-900" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">CarImport</h1>
          <p className="text-slate-400 text-sm mt-1">Crea tu cuenta</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Registro</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-600">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-gray-400" /> Usuario *
              </label>
              <input type="text" value={form.username} onChange={(e) => handleChange("username", e.target.value)} placeholder="Elige un nombre de usuario" className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" autoComplete="username" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-gray-400" /> Email *
              </label>
              <input type="email" value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="tu@email.com" className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" autoComplete="email" />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-gray-400" /> Contraseña *
              </label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => handleChange("password", e.target.value)} placeholder="Mínimo 6 caracteres" className="w-full p-3 pr-10 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-gray-400" /> Confirmar Contraseña *
              </label>
              <input type={showPassword ? "text" : "password"} value={form.confirmPassword} onChange={(e) => handleChange("confirmPassword", e.target.value)} placeholder="Repite la contraseña" className="w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" autoComplete="new-password" />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 text-sm font-bold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed">
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              ¿Ya tienes una cuenta?{" "}
              <NextLink href="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                Inicia sesión
              </NextLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}