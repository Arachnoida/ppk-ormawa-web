export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 mt-auto">
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold text-lg mb-4">PPK ORMAWA</h3>
          <p className="text-sm leading-relaxed">
            Membangun desa cerdas melalui inovasi teknologi dan kolaborasi mahasiswa.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Kontak</h4>
          <p className="text-sm">Universitas Udayana, Bali</p>
          <p className="text-sm">Email: info@ppk-ormawa.id</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 mt-8">
            &copy; {new Date().getFullYear()} Tim PPK ORMAWA 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
