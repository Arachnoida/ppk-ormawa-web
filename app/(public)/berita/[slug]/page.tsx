import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react"; // Update Icon
import { Button } from "@/components/ui/button";

// 1. IMPORT CSS QUILL (Wajib agar teks rata kanan/kiri, bold, list terbaca)
import "react-quill-new/dist/quill.snow.css";

// Helper Generate Metadata SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase.from("posts").select("title").eq("slug", slug).single();
  return { title: post?.title || "Artikel Tidak Ditemukan" };
}

export default async function PublicPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient();
  const { slug } = await params;

  // 2. Fetch Data
  const { data: post } = await supabase
    .from("posts")
    .select(`*, profiles(full_name), categories(name)`)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) {
    notFound();
  }

  // 3. LOGIC GAMBAR (Sama dengan Home/Index)
  const imageUrl =
    post.image_url ||
    post.thumbnail_url ||
    "https://images.unsplash.com/photo-1502082553048-f009c371b9b5?w=1200&q=80";

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* HERO HEADER FULL WIDTH */}
      <div className="relative w-full h-[50vh] bg-slate-900">
        {/* Gambar Background */}
        <img src={imageUrl} alt={post.title} className="w-full h-full object-cover opacity-50" />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Judul di atas Gambar */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white">
          <div className="container mx-auto max-w-4xl">
            <Badge className="bg-blue-600 hover:bg-blue-700 mb-4 border-0 text-sm px-3 py-1">
              {post.categories?.name || "Berita"}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6 shadow-black drop-shadow-lg">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-200 text-sm font-medium">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-blue-400" />
                <span>{post.profiles?.full_name || "Admin PPK ORMAWA"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-400" />
                <span>
                  {new Date(post.created_at).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BODY KONTEN */}
      <div className="container mx-auto px-4 max-w-4xl -mt-8 relative z-10">
        <div className="bg-white rounded-t-3xl p-8 md:p-12 shadow-sm border border-slate-100 min-h-[400px]">
          {/* Tombol Back */}
          <Button variant="ghost" asChild className="mb-8 -ml-4 text-slate-500 hover:text-blue-600">
            <Link href="/berita">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
            </Link>
          </Button>

          {/* RENDER KONTEN QUILL */}
          <div className="ql-snow">
            <div
              className="ql-editor !p-0 !overflow-visible 
               
               /* 1. ATUR UKURAN FONT DISINI */
               prose-lg  /* Ini membuat base font lebih besar */
               [&>p]:text-[18px] /* Paksa paragraf jadi 18px (Ganti 18px jadi 20px jika kurang besar) */
               [&>h1]:text-4xl   /* Ukuran Heading 1 di dalam konten */
               [&>h2]:text-3xl   /* Ukuran Heading 2 di dalam konten */
               
               /* 2. ATUR JARAK BARIS (SPACING) DISINI */
               leading-loose /* Ini setara 2.0 (sangat lega). Ganti 'leading-relaxed' untuk 1.6 */
               
               /* 3. STYLE LAINNYA */
               prose-slate max-w-none 
               prose-headings:font-bold prose-headings:text-slate-900 
               prose-a:text-blue-600 prose-a:underline
               prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
               text-slate-800"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </div>

          {/* Footer Artikel */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-2">
            <Tag className="h-4 w-4 text-slate-400" />
            <span className="text-sm text-slate-500">Kategori: </span>
            <span className="text-sm font-semibold text-slate-700">{post.categories?.name}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
