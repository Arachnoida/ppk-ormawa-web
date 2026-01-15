import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, ArrowUpRight, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/public/search-input"; // 1. Import Component Search Tadi

export const revalidate = 0;

// 2. Terima props searchParams
export default async function NewsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();

  // Ambil query dari URL (tunggu promise karena Next.js 15)
  const params = await searchParams;
  const query = params.q || "";

  // 3. Mulai Query Dasar
  let postQuery = supabase
    .from("posts")
    .select(`*, categories(name)`)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // 4. JIKA ADA PENCARIAN -> Tambahkan Filter
  if (query) {
    // ilike = case insensitive search (mencari judul YANG MENGANDUNG kata kunci)
    postQuery = postQuery.ilike("title", `%${query}%`);
  }

  // Jalankan Query
  const { data: posts } = await postQuery;

  // HELPER: CLEAN EXCERPT
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

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="text-center md:text-left">
            <Button
              variant="link"
              asChild
              className="px-0 text-slate-400 hover:text-blue-600 mb-2 h-auto"
            >
              <Link href="/">
                <ArrowLeft className="w-3 h-3 mr-1" /> Kembali ke Beranda
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-slate-900">Berita & Edukasi</h1>
            <p className="text-slate-500 mt-2">
              Jelajahi dokumentasi kegiatan dan artikel edukasi dari tim PPK ORMAWA.
            </p>
          </div>

          {/* 5. GANTI INPUT HTML BIASA DENGAN COMPONENT SEARCH */}
          <SearchInput />
        </div>

        {/* GRID ARTIKEL */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Kondisi jika tidak ada hasil search */}
          {posts?.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">Tidak ada artikel yang ditemukan.</p>
              {query && (
                <p className="text-slate-400 text-sm mt-2">
                  Coba kata kunci lain selain &quot;<span className="text-slate-600">{query}</span>
                  &quot;
                </p>
              )}
            </div>
          ) : (
            posts?.map((post, index) => {
              const imageUrl =
                post.image_url ||
                post.thumbnail_url ||
                `https://images.unsplash.com/photo-${
                  index % 2 === 0 ? "1502082553048-f009c371b9b5" : "1531206715517-5c0ba140b2b8"
                }?w=800&q=80`;

              return (
                <Link href={`/berita/${post.slug}`} key={post.id} className="group block h-full">
                  <Card className="h-full border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col rounded-2xl bg-white">
                    {/* Gambar Header */}
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
    </div>
  );
}
