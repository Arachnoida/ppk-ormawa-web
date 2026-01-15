import { Navbar } from "@/components/public/navbar";
import { Footer } from "@/components/public/footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navbar otomatis muncul di semua halaman public */}
      <Navbar />

      {/* Konten halaman (page.tsx) akan dirender di sini */}
      <main className="flex-1 pt-16">{children}</main>

      {/* Footer otomatis muncul di semua halaman public */}
      <Footer />
    </div>
  );
}
