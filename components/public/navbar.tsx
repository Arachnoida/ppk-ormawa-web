import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Nama Tim */}
        <Link href="/" className="text-xl font-bold text-slate-900">
          PPK ORMAWA
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium hover:text-blue-600 transition">
            Beranda
          </Link>
          <Link href="/tentang" className="text-sm font-medium hover:text-blue-600 transition">
            Tentang Kami
          </Link>
          <Link href="/berita" className="text-sm font-medium hover:text-blue-600 transition">
            Berita & Edukasi
          </Link>
        </div>

        {/* Tombol Login */}
        <Button asChild variant="outline" size="sm">
          <Link href="/login">Login Panitia</Link>
        </Button>
      </div>
    </nav>
  );
}
