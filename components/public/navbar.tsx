import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mountain, LayoutDashboard } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-white/80 backdrop-blur-md transition-all">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* LOGO BRANDING */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-blue-700 transition-colors">
            <Mountain className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-slate-900">PPK ORMAWA</span>
        </Link>

        {/* MENU DESKTOP */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Beranda
          </Link>

          {/* OPSI 1: Jika ingin scroll ke section program di Home */}
          <a href="/#visi" className="hover:text-blue-600 transition-colors">
            Tentang Program
          </a>

          {/* PERBAIKAN DISINI: Ganti '#news' menjadi '/berita' */}
          {/* Agar dia pindah ke halaman /berita, bukan scroll di home */}
          <Link href="/berita" className="hover:text-blue-600 transition-colors">
            Berita & Edukasi
          </Link>
        </div>

        {/* ACTION BUTTON */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="default"
            className="bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 rounded-full px-5 transition-all hover:scale-105"
          >
            <Link href="/login">
              Login Panitia <LayoutDashboard className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
