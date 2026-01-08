import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Plus, Edit, UploadCloud, Ban, FileText, Globe, Trash2 } from "lucide-react";
import { updatePostStatus } from "@/actions/status-actions";
import { deletePost } from "@/actions/post-actions";

export default async function PostsPage() {
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("posts")
    .select(`*, categories (name)`)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Artikel & Berita</h2>
          <p className="text-slate-500 mt-1">Kelola semua konten publikasi kegiatan di sini.</p>
        </div>
        <Button
          asChild
          className="bg-slate-900 hover:bg-slate-700 shadow-lg shadow-slate-900/20 transition-all"
        >
          <Link href="/dashboard/posts/create">
            <Plus className="mr-2 h-4 w-4" /> Tulis Artikel Baru
          </Link>
        </Button>
      </div>

      {/* TABLE CARD SECTION */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table className="table-fixed w-full">
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              {/* REVISI LEBAR KOLOM: Judul dikurangi, Aksi ditambah biar muat memanjang */}
              <TableHead className="w-[50%] pl-6 py-4 text-slate-700 font-semibold">
                Judul Artikel
              </TableHead>
              <TableHead className="w-[10%] text-slate-700 font-semibold text-center">
                Kategori
              </TableHead>
              <TableHead className="w-[15%] text-slate-700 font-semibold text-center">
                Status
              </TableHead>
              <TableHead className="w-[25%] text-center pr-6 text-slate-700 font-semibold">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <FileText className="h-6 w-6 text-slate-400" />
                    </div>
                    <p>Belum ada artikel yang dibuat.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {posts?.map((post) => (
              <TableRow
                key={post.id}
                className="group hover:bg-slate-50/60 transition-colors border-b last:border-0"
              >
                {/* KOLOM JUDUL: Tetap align-top agar rapi jika teks panjang */}
                <TableCell className="pl-6 py-4 align-middle">
                  <div className="flex flex-col gap-1 pr-4">
                    <span className="font-semibold text-slate-900 text-base leading-snug whitespace-normal break-words">
                      {post.title}
                    </span>
                    <div className="flex items-center text-xs text-slate-500 gap-2 mt-1">
                      <span>
                        {new Date(post.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* KOLOM KATEGORI: align-middle & text-center */}
                <TableCell className="align-middle py-4 text-center">
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap">
                    {post.categories?.name}
                  </div>
                </TableCell>

                {/* KOLOM STATUS: align-middle & text-center */}
                <TableCell className="align-middle py-4">
                  <div className="flex justify-center">
                    {" "}
                    {/* Container tengah */}
                    {post.status === "published" ? (
                      <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-1 rounded-full w-fit border border-green-100 whitespace-nowrap">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-bold">PUBLISHED</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full w-fit border border-yellow-100 whitespace-nowrap">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                        </span>
                        <span className="text-xs font-bold">DRAFT</span>
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* KOLOM AKSI: align-middle & layout horizontal */}
                <TableCell className="text-right pr-6 align-middle py-4">
                  <div className="flex justify-end gap-2 items-center flex-nowrap">
                    {/* TOMBOL QUICK ACTION */}
                    {post.status === "draft" ? (
                      <form
                        action={async () => {
                          "use server";
                          await updatePostStatus(post.id, "published");
                        }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 border-green-200 hover:bg-green-50 h-8 font-medium whitespace-nowrap"
                        >
                          <UploadCloud className="h-3.5 w-3.5 mr-1.5" /> POST
                        </Button>
                      </form>
                    ) : (
                      <form
                        action={async () => {
                          "use server";
                          await updatePostStatus(post.id, "draft");
                        }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-amber-600 border-amber-200 hover:bg-amber-50 h-8 font-medium whitespace-nowrap"
                        >
                          <Ban className="h-3.5 w-3.5 mr-1.5" /> TAKE DOWN
                        </Button>
                      </form>
                    )}

                    {/* GROUP TOMBOL ICON */}
                    <div className="flex items-center gap-1 border-l pl-2 ml-1 border-slate-200">
                      {/* EDIT */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                        asChild
                      >
                        <Link href={`/dashboard/posts/${post.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>

                      {/* VIEW */}
                      {post.status === "published" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full"
                          asChild
                        >
                          <Link href={`/berita/${post.slug}`} target="_blank">
                            <Globe className="h-4 w-4" />
                          </Link>
                        </Button>
                      )}

                      {/* DELETE */}
                      <form
                        action={async () => {
                          "use server";
                          await deletePost(post.id);
                        }}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
