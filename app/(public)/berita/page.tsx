import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export const revalidate = 0; // Agar data selalu fresh saat dibuka

export default async function NewsIndexPage() {
  const supabase = await createClient();

  // Fetch SEMUA berita yang Published
  const { data: posts } = await supabase
    .from("posts")
    .select(`*, categories(name)`)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header Halaman */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Berita & Edukasi</h1>
          <p className="text-slate-600">
            Dokumentasi kegiatan, artikel edukasi, dan kabar terkini dari PPK ORMAWA di Desa Mitra.
          </p>
        </div>

        {/* Grid Artikel */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts?.length === 0 && (
            <div className="col-span-full text-center py-20 bg-white rounded-lg border border-dashed">
              <p className="text-gray-500">Belum ada berita yang dipublikasikan.</p>
            </div>
          )}

          {posts?.map((post) => (
            <div
              key={post.id}
              className="bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Thumbnail Image */}
              <div className="h-56 bg-gray-200 relative overflow-hidden">
                <Link href={`/berita/${post.slug}`}>
                  {post.thumbnail_url ? (
                    <img
                      src={post.thumbnail_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </Link>
                <div className="absolute top-4 left-4">
                  <Badge className="bg-blue-600 hover:bg-blue-700">{post.categories?.name}</Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-slate-500 text-xs mb-3 gap-2">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.created_at).toLocaleDateString("id-ID", { dateStyle: "long" })}
                </div>

                <h3 className="text-xl font-bold mb-3 line-clamp-2 leading-snug">
                  <Link
                    href={`/berita/${post.slug}`}
                    className="text-slate-900 group-hover:text-blue-600 transition"
                  >
                    {post.title}
                  </Link>
                </h3>

                {/* Cuplikan isi berita */}
                <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                  {
                    post.content
                      ?.replace(/<h[1-6][^>]*>.*?<\/h[1-6]>/gi, "") // 1. Hapus Heading & Isinya
                      .replace(/<[^>]*>?/gm, "") // 2. Hapus tag HTML lain
                      .replace(/&nbsp;/g, " ") // 3. Hapus spasi aneh
                      .substring(0, 100) // 4. Potong 100 huruf
                  }
                  ...
                </p>

                <Link
                  href={`/berita/${post.slug}`}
                  className="text-blue-600 text-sm font-semibold flex items-center hover:underline"
                >
                  Baca Selengkapnya <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
