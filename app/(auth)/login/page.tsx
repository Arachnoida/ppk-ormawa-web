"use client";

import { useState } from "react";
import Link from "next/link";
import { loginAction } from "@/actions/auth-actions"; // Import Action Anda
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LayoutDashboard, Mail, Lock, ArrowRight, Loader2, AlertCircle } from "lucide-react"; // Icon tambahan

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    // Panggil Server Action
    const result = await loginAction(formData);

    if (result?.errorMessage) {
      setError(result.errorMessage);
      setLoading(false);
    }
    // Jika sukses, redirect akan ditangani di server action (auth-actions.ts)
  }

  return (
    <div className="w-full h-screen lg:grid lg:grid-cols-2">
      {/* --- BAGIAN KIRI: BRANDING (Hanya muncul di Layar Besar) --- */}
      <div className="hidden lg:flex flex-col justify-between bg-slate-900 text-white p-12 relative overflow-hidden">
        {/* Dekorasi Background Abstrak */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-[80px] opacity-20 -ml-10 -mb-10 pointer-events-none"></div>

        {/* Logo Header */}
        <div className="relative z-10 flex items-center gap-2 text-lg font-medium">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
            <LayoutDashboard className="h-6 w-6 text-blue-400" />
          </div>
          <span>PPK ORMAWA KSR-PMI</span>
        </div>

        {/* Pesan Utama */}
        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Membangun Desa, <span className="text-blue-400">Merajut Asa.</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Platform terintegrasi untuk mengelola kegiatan, publikasi artikel, dan dokumentasi
            pemberdayaan desa mitra Universitas Udayana.
          </p>
        </div>

        {/* Footer Kecil */}
        <div className="relative z-10 text-sm text-slate-500">
          &copy; 2026 Tim PPK Ormawa KSR-PMI Unud.
        </div>
      </div>

      {/* --- BAGIAN KANAN: FORM LOGIN --- */}
      <div className="flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          {/* Header Form */}
          <div className="text-center">
            {/* Logo Mobile (Hanya muncul di HP) */}
            <div className="lg:hidden flex justify-center mb-4">
              <div className="bg-slate-900 p-3 rounded-xl">
                <LayoutDashboard className="h-8 w-8 text-blue-400" />
              </div>
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Selamat Datang</h2>
            <p className="mt-2 text-sm text-slate-500">
              Silakan masuk untuk mengakses dashboard admin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-5">
              {/* Input Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="nama@email.com"
                    required
                    className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700 font-medium">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-3 text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="pl-10 h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Error Message Display */}
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
            </div>

            {/* Tombol Login */}
            <Button
              type="submit"
              className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-lg shadow-slate-900/20 transition-all flex items-center justify-center gap-2 group"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
