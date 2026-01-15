import { Mountain, Instagram, Globe, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800 mt-auto">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        {/* KOLOM 1: BRAND */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <Mountain className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">PPK ORMAWA</span>
          </div>
          <p className="text-sm leading-relaxed max-w-sm text-slate-400">
            Platform publikasi resmi kegiatan pengabdian masyarakat KSR-PMI Universitas Udayana.
            Mewujudkan desa cerdas, tangguh, dan mandiri melalui inovasi mahasiswa.
          </p>
        </div>

        {/* KOLOM 2: LINK */}
        <div>
          <h4 className="font-bold text-white mb-4">Tautan Cepat</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-blue-400 transition-colors">
                Beranda
              </a>
            </li>
            <li>
              <a href="#program" className="hover:text-blue-400 transition-colors">
                Program Desa
              </a>
            </li>
            <li>
              <a href="#news" className="hover:text-blue-400 transition-colors">
                Berita Terkini
              </a>
            </li>
          </ul>
        </div>

        {/* KOLOM 3: KONTAK & SOSMED */}
        <div>
          <h4 className="font-bold text-white mb-4">Hubungi Kami</h4>
          <div className="flex gap-3 mb-4">
            {/* Social Icon Buttons */}
            <a
              href="#"
              className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
            >
              <Globe className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
          <p className="text-xs text-slate-500">
            Universitas Udayana, Bali
            <br />
            info@ppk-ormawa.id
          </p>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
        &copy; {new Date().getFullYear()} Tim PPK ORMAWA KSR-PMI. All rights reserved.
      </div>
    </footer>
  );
}
