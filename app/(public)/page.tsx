import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  Target,
  Lightbulb,
  Users,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default async function HomePage() {
  const supabase = await createClient();

  // 1. FETCH DATA BERITA
  const { data: latestPosts } = await supabase
    .from("posts")
    .select(`*, categories(name)`)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(3);

  // 2. HELPER: BERSIHKAN HTML TAGS & ENTITIES (REVISI ANTI-CRASH) 🛡️
  function getExcerpt(htmlContent: string | null) {
    if (!htmlContent) return "Simak selengkapnya mengenai kegiatan ini...";

    // LANGKAH PENGAMAN: Potong string jika terlalu panjang SEBELUM kena Regex.
    // Ini mencegah error "Maximum call stack" jika ada gambar Base64 di dalam konten.
    let text = htmlContent.slice(0, 3000);

    try {
      text = text.replace(/&nbsp;/g, " ");
      text = text.replace(/<\/p>|<\/div>|<br\s*\/?>/gi, " ");
      text = text.replace(/<[^>]+>/g, ""); // Hapus semua tag HTML
      text = text.replace(/\s+/g, " ").trim(); // Rapikan spasi

      return text.length > 100 ? text.substring(0, 100) + "..." : text;
    } catch (error) {
      // Fallback jika masih error, kembalikan teks default agar web tidak crash
      console.error("Error parsing excerpt:", error);
      return "Simak selengkapnya...";
    }
  }

  // 3. DATA DUMMY TIM
  const teamMembers = [
    { name: "Ayu Hista", role: "Ketua Pelaksana", image: "/team/histaa.jpg" },
    { name: "Gede Dhananjaya", role: "Wakil Ketua", image: "/team/gusde.jpg" },
    { name: "Dian Hita", role: "Sekretaris", image: "/team/dian.jpg" },
    { name: "Ayu Dwi Suputri", role: "Bendahara", image: "/team/yuwi.jpg" },
    { name: "Surya Ananta", role: "Anggota Pelaksana", image: "/team/surya.jpg" },
    { name: "Alfito Dinova", role: "Anggota Pelaksana", image: "/team/alfito.jpg" },
    { name: "Bagus Raditya", role: "Anggota Pelaksana", image: "/team/bara.jpg" },
    { name: "Danu Satrio", role: "Anggota Pelaksana", image: "/team/danu.jpg" },
    { name: "Angga Dinata", role: "Anggota Pelaksana", image: "/team/angga.jpg" },
    { name: "Kezya Yonanda", role: "Anggota Pelaksana", image: "/team/kezya.jpg" },
    { name: "Erna Suryawati", role: "Anggota Pelaksana", image: "/team/erna.jpg" },
    { name: "Witari Ningsih", role: "Anggota Pelaksana", image: "/team/tari.jpg" },
    { name: "Yosy Chatarina", role: "Anggota Pelaksana", image: "/team/yosy.jpg" },
  ];

  return (
    <div className="font-sans text-slate-900 selection:bg-blue-100">
      {/* --- SECTION 1: HERO MODERN DENGAN BACKGROUND IMAGE --- */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900 py-20">
        {/* 1. GAMBAR BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Desa Bebandem"
            fill
            className="object-cover opacity-90"
            priority
          />
        </div>

        {/* 2. OVERLAY GRADIENT */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/30" />

        {/* KONTEN TEKS (Di atas overlay) */}
        {/* PERUBAHAN 1: max-w diperkecil jadi 3xl agar teks lebih memadat ke tengah */}
        <div className="container mx-auto px-4 relative z-20 text-center max-w-3xl mt-10">
          <Badge
            variant="outline"
            className="mb-6 px-5 py-1 text-sm font-medium border-blue-400 text-blue-300 bg-blue-900/30 backdrop-blur-sm"
          >
            PPK ORMAWA KSR-PMI 2025
          </Badge>

          {/* PERUBAHAN 2: Font size diperkecil (text-3xl md:text-5xl) agar tidak terlalu raksasa */}
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight drop-shadow-lg">
            Pemberdayaan Desa Bebandem Menuju Desa Cerdas:
            <br className="hidden md:block" />
            {/* PERUBAHAN 3: Sub-judul diperkecil (text-xl md:text-2xl) & margin top ditambah (mt-4) agar ada jarak napas */}
            <span className="block mt-4 text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-indigo-400 leading-snug">
              Integrasi Teknologi, Ketangguhan Bencana, dan Ekonomi Kreatif Berbasis Potensi Lokal
            </span>
          </h1>

          <p className="text-base md:text-lg text-slate-200 mb-10 max-w-xl mx-auto leading-relaxed drop-shadow-md">
            Platform publikasi resmi kegiatan pemberdayaan desa. Menghadirkan inovasi digital untuk
            kemajuan desa Bebandem, Karangasem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="rounded-full px-8 bg-blue-500 hover:bg-blue-600 h-12 text-base shadow-xl shadow-blue-500/30 transition-all hover:scale-105 border-0 text-white"
            >
              <Link href="/berita">Baca Kegiatan Kami</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-12 text-base bg-transparent border-white text-white hover:bg-white hover:text-slate-700 transition-all"
            >
              <a href="#tim-pelaksana">Tentang Tim</a>
            </Button>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: VISI MISI (PILLARS STYLE) --- */}
      <section
        id="visi"
        className="py-20 bg-slate-50 border-y border-slate-100 relative z-30 -mt-10 rounded-t-3xl"
      >
        {/* Tambahkan -mt-10 dan rounded-t-3xl agar overlap sedikit dengan hero section */}
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card Visi */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Visi Kami</h3>
              <p className="text-slate-500 leading-relaxed">
                Mewujudkan desa mandiri yang adaptif terhadap perkembangan teknologi digital dan
                tangguh bencana.
              </p>
            </div>

            {/* Card Inovasi */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Lightbulb className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Inovasi</h3>
              <p className="text-slate-500 leading-relaxed">
                Menghadirkan solusi sistem informasi yang user-friendly, inklusif, dan berkelanjutan
                bagi masyarakat.
              </p>
            </div>

            {/* Card Kolaborasi */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Kolaborasi</h3>
              <p className="text-slate-500 leading-relaxed">
                Bekerja sama erat dengan perangkat desa, pemuda, dan masyarakat setempat secara
                gotong royong.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 3: LATEST NEWS (MODERN CARD) --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Kabar Terbaru</h2>
              <p className="text-slate-500">
                Update kegiatan lapangan dan artikel edukasi terkini.
              </p>
            </div>
            <Button
              asChild
              variant="ghost"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Link href="/berita" className="flex items-center gap-2">
                Lihat Semua <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Grid Berita */}
          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts?.length === 0 ? (
              <div className="col-span-3 text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-slate-500">Belum ada artikel yang dipublikasikan.</p>
              </div>
            ) : (
              latestPosts?.map((post, index) => {
                // Fallback Image Logic
                const imageUrl =
                  post.image_url ||
                  post.thumbnail_url ||
                  `https://images.unsplash.com/photo-${
                    index % 2 === 0 ? "1502082553048-f009c371b9b5" : "1531206715517-5c0ba140b2b8"
                  }?w=800&q=80`;

                return (
                  <Link href={`/berita/${post.slug}`} key={post.id} className="group block h-full">
                    <Card className="h-full border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col rounded-2xl">
                      {/* Gambar */}
                      <div className="h-52 w-full relative overflow-hidden bg-slate-100">
                        <img
                          src={imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/95 text-slate-900 hover:bg-white text-xs backdrop-blur-md shadow-sm border-0 px-3 py-1">
                            {post.categories?.name || "Kegiatan"}
                          </Badge>
                        </div>
                      </div>

                      {/* Konten Text */}
                      <CardContent className="p-6 flex-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400 mb-3 font-medium">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(post.created_at).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                          {post.title}
                        </h3>

                        <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed">
                          {getExcerpt(post.content)}
                        </p>
                      </CardContent>

                      <CardFooter className="p-6 pt-0 mt-auto">
                        <span className="text-sm font-bold text-blue-600 flex items-center group-hover:gap-2 transition-all">
                          Baca Selengkapnya <ArrowUpRight className="ml-1 h-4 w-4" />
                        </span>
                      </CardFooter>
                    </Card>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: TEAM STRUCTURE (MODERN GRID) --- */}
      <section id="tim-pelaksana" className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Tim Pelaksana</h2>
            <p className="text-slate-500">
              Orang-orang berdedikasi di balik suksesnya program pemberdayaan desa ini.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center group"
              >
                {/* Foto Bulat dengan Ring */}
                <div className="w-24 h-24 mx-auto mb-5 relative">
                  <div className="absolute inset-0 rounded-full border-2 border-blue-100 group-hover:border-blue-400 transition-colors duration-300 scale-110"></div>
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-200 relative">
                    {member.image ? (
                      <Image src={member.image} alt={member.name} fill className="object-cover" />
                    ) : (
                      // Fallback Avatar jika foto belum ada
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 font-bold text-xl">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="font-bold text-lg text-slate-900 mb-1">{member.name}</h4>
                <p className="text-sm text-blue-600 font-medium bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
