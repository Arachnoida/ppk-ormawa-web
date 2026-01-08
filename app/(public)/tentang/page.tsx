import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Lightbulb } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Tentang Tim PPK ORMAWA</h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Kami adalah kelompok mahasiswa Teknologi Informasi Universitas Udayana yang tergabung
            dalam KSR-PMI, berdedikasi untuk membangun desa melalui teknologi tepat guna.
          </p>
        </div>
      </section>

      {/* Visi Misi Icons */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6 border-none shadow-lg bg-blue-50">
            <CardContent className="pt-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visi Kami</h3>
              <p className="text-slate-600 text-sm">
                Mewujudkan desa mandiri yang adaptif terhadap perkembangan teknologi digital.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 border-none shadow-lg bg-indigo-50">
            <CardContent className="pt-6">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                <Lightbulb className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Inovasi</h3>
              <p className="text-slate-600 text-sm">
                Menghadirkan solusi sistem informasi yang user-friendly dan berkelanjutan.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 border-none shadow-lg bg-teal-50">
            <CardContent className="pt-6">
              <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-teal-600">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Kolaborasi</h3>
              <p className="text-slate-600 text-sm">
                Bekerja sama dengan perangkat desa dan masyarakat setempat secara inklusif.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Structure (Dummy Data - Bisa diganti nanti) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Struktur Tim Pelaksana</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { name: "Nama Ketua", role: "Ketua Pelaksana" },
              { name: "Nama Anggota 1", role: "Divisi Teknis" },
              { name: "Nama Anggota 2", role: "Divisi Acara" },
              { name: "Nama Anggota 3", role: "Divisi Humas" },
            ].map((member, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h4 className="font-bold text-slate-900">{member.name}</h4>
                <p className="text-sm text-blue-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
