import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

// 1. IMPORT CSS QUILL DISINI AGAR STYLE TERBACA
import "react-quill-new/dist/quill.snow.css";

export default async function PublicPostDetail({ params }: { params: Promise<{ slug: string }> }) {
  const supabase = await createClient();
  const { slug } = await params;

  const { data: post } = await supabase
    .from("posts")
    .select(`*, profiles(full_name), categories(name)`)
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!post) {
    notFound();
  }

  return (
    <article className="min-h-screen pb-20 bg-white">
      {/* Header Artikel (Tetap Sama) */}
      <div className="bg-slate-50 border-b py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button
            variant="ghost"
            asChild
            className="mb-6 pl-0 hover:bg-transparent hover:text-blue-600"
          >
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Beranda
            </Link>
          </Button>

          <Badge className="mb-4">{post.categories?.name}</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-6 text-slate-500 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.profiles?.full_name}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.created_at).toLocaleDateString("id-ID", { dateStyle: "full" })}
            </div>
          </div>
        </div>
      </div>

      {/* Konten Artikel */}
      <div className="container mx-auto px-4 max-w-4xl py-12">
        {post.thumbnail_url && (
          <div className="rounded-xl overflow-hidden mb-10 shadow-lg">
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* PERBAIKAN UTAMA DISINI:
            1. Hapus class 'prose' (karena konflik dengan style Quill)
            2. Tambahkan class 'ql-snow' (Wadah tema)
            3. Tambahkan class 'ql-editor' (Agar CSS Quill bekerja: indent, align, heading)
            4. Tambahkan custom CSS inline/class untuk font size agar tidak kekecilan
        */}
        <div className="ql-snow">
          <div
            className="ql-editor !p-0 !overflow-visible text-lg text-slate-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </div>
      </div>
    </article>
  );
}
