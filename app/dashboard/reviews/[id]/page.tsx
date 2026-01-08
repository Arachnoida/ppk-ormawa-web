import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { addComment } from "@/actions/comment-actions";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { CommentForm } from "./comment-form";

export default async function ReviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { id } = await params;

  // 1. Fetch Detail Artikel + Komentar yang sudah ada
  const { data: post } = await supabase
    .from("posts")
    .select(`*, profiles(full_name), categories(name)`)
    .eq("id", id)
    .single();

  const { data: comments } = await supabase
    .from("post_comments")
    .select(`*, profiles(full_name)`)
    .eq("post_id", id)
    .order("created_at", { ascending: true });

  if (!post) return <div>Artikel tidak ditemukan</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* KOLOM KIRI: Preview Artikel */}
      <div className="lg:col-span-2 space-y-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard/reviews">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Link>
        </Button>

        <div className="bg-white p-8 rounded-lg border shadow-sm">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="flex gap-2 mb-6">
            <Badge>{post.categories?.name}</Badge>
            <span className="text-sm text-gray-500">Penulis: {post.profiles?.full_name}</span>
          </div>

          {/* Render HTML dari React Quill */}
          <div
            className="prose max-w-none w-full break-words"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </div>
      </div>

      {/* KOLOM KANAN: Form Komentar Advisor */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Revisi & Masukan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* List Komentar Sebelumnya */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
              {comments?.length === 0 && (
                <p className="text-sm text-gray-400 italic">Belum ada revisi.</p>
              )}

              {comments?.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-yellow-50 p-3 rounded-lg border border-yellow-100"
                >
                  <p className="text-xs font-bold text-yellow-800 mb-1">
                    {comment.profiles?.full_name}
                  </p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {comment.comment_text}
                  </p>
                </div>
              ))}
            </div>

            {/* PANGGIL KOMPONEN FORM DISINI */}
            <CommentForm postId={post.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
