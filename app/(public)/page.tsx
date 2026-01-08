import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Lightbulb } from "lucide-react";
import Image from "next/image";

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch 3 Berita Terbaru yang Statusnya PUBLISHED
  const { data: latestPosts } = await supabase
    .from("posts")
    .select(`*, categories(name)`)
    .eq("status", "published") // HANYA YANG PUBLISHED
    .order("published_at", { ascending: false })
    .limit(3);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="bg-slate-900 text-white py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 tracking-tight">
            Membangun Desa, <span className="text-blue-400">Merajut Asa</span>
          </h1>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Platform publikasi resmi kegiatan PPK ORMAWA KSR-PMI Universitas Udayana. Menghadirkan
            inovasi digital untuk kemajuan desa mitra.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/berita">Baca Kegiatan Kami</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-black hover:bg-white/10 hover:text-white border-white/20"
            >
              <Link href="/tentang">Tentang Tim</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* LATEST NEWS SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Kabar Terbaru</h2>
              <p className="text-slate-500 mt-2">Update kegiatan dan artikel edukasi terkini.</p>
            </div>
            <Button variant="ghost" asChild className="hidden md:flex">
              <Link href="/berita">
                Lihat Semua <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts?.length === 0 && (
              <div className="col-span-3 text-center py-10 text-gray-500">
                Belum ada berita yang dipublikasikan.
              </div>
            )}

            {latestPosts?.map((post) => (
              <div
                key={post.id}
                className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Thumbnail Image */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {post.thumbnail_url ? (
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-blue-600 font-bold mb-2 uppercase">
                    <span>{post.categories?.name}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-2">
                    <Link href={`/berita/${post.slug}`} className="hover:text-blue-600 transition">
                      {post.title}
                    </Link>
                  </h3>
                  <div className="flex items-center text-slate-500 text-sm mt-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(post.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}
                  </div>
                </div>
              </div>
            ))}
          </div>
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

      {/* Team Structure */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Struktur Tim Pelaksana</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              // GANTI path '/team/foto.jpg' SESUAI NAMA FILE ANDA DI FOLDER PUBLIC
              { name: "Gusti Ayu Hista", role: "Ketua Pelaksana", image: "/team/hista.jpg" },
              { name: "Gede Dhananjaya", role: "Wakil Ketua", image: "/team/dhananjaya.jpg" },
              { name: "Dian Hita", role: "Sekretaris", image: "/team/dian.jpg" },
              { name: "Ayu Dwi Suputri", role: "Bendahara", image: "/team/ayu.jpg" },

              // ... Tambahkan anggota lainnya disini ...
              { name: "Nama Anggota Lain", role: "Divisi Teknis", image: null }, // Contoh jika belum ada foto
            ].map((member, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow"
              >
                {/* LOGIKA FOTO: Jika ada foto tampilkan, jika null tampilkan kotak abu */}
                <div className="w-24 h-24 mx-auto mb-4 relative rounded-full overflow-hidden bg-gray-200">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover" // Agar foto tidak gepeng/penyok
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Photo
                    </div>
                  )}
                </div>

                <h4 className="font-bold text-slate-900">{member.name}</h4>
                <p className="text-sm text-blue-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
