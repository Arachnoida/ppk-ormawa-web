"use client";

import { Menu } from "lucide-react";

// PERBAIKAN: Tambahkan '| null' dan ubah string jadi 'any' agar lebih fleksibel
export function Header({ user }: { user?: { full_name: any; role: any } | null }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md transition-all">
      {/* KIRI: Breadcrumb / Judul Halaman */}
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Dashboard
          </span>
          <h1 className="text-sm font-semibold text-slate-800">Sistem Informasi Manajemen</h1>
        </div>
      </div>

      {/* KANAN: User Profile Widget */}
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-700">{user?.full_name || "Admin User"}</p>
          <p className="text-xs text-slate-500 capitalize">
            {user?.role?.replace("_", " ") || "Role Undefined"}
          </p>
        </div>

        {/* Avatar Circle (Inisial Nama) */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-sm font-bold text-blue-600 shadow-sm">
          {/* Tambahkan pengecekan user sebelum charAt agar tidak error jika null */}
          {user?.full_name ? user.full_name.charAt(0).toUpperCase() : "A"}
        </div>
      </div>
    </header>
  );
}
