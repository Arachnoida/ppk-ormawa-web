"use client";

import { useEffect, useState, use } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Image buat preview
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// KONFIGURASI TOOLBAR DENGAN ANGKA
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }], // Hanya H1, H2, dan Normal
    [{ size: ["small", false] }], // Hanya 'Small' (untuk Source) dan 'Normal'
    ["bold", "italic", "underline"], // Hapus strike jika tidak perlu
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "image"],
    ["clean"],
  ],
};

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);
  const [content, setContent] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase.from("posts").select("*").eq("id", id).single();
      if (data) {
        setPost(data);
        setContent(data.content);
      }
      setLoading(false);
    }
    fetchPost();
  }, [id]);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    let finalThumbnailUrl = post.thumbnail_url; // Default pakai gambar lama

    // 1. LOGIKA UPLOAD GAMBAR BARU (CLIENT SIDE)
    const imageFile = formData.get("thumbnail") as File;
    if (imageFile && imageFile.size > 0) {
      const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, "")}`;

      // Upload ke Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, imageFile);

      if (uploadError) {
        alert("Gagal upload gambar: " + uploadError.message);
        setLoading(false);
        return;
      }

      // Ambil URL Publik
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(fileName);
      finalThumbnailUrl = publicUrl;
    }

    // 2. DATA YANG DIUPDATE (Tanpa Status)
    const updates = {
      title: formData.get("title"),
      content: content,
      category_id: Number(formData.get("categoryId")),
      thumbnail_url: finalThumbnailUrl, // Update URL gambar
    };

    const { error } = await supabase.from("posts").update(updates).eq("id", id);

    if (error) alert("Gagal update!");
    else {
      alert("Artikel berhasil diperbarui!");
      router.push("/dashboard/posts");
      router.refresh();
    }
    setLoading(false);
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      <h2 className="text-2xl font-bold">Edit Artikel</h2>

      <form onSubmit={handleUpdate} className="space-y-6 bg-white p-6 rounded-lg border">
        {/* INPUT JUDUL (Full Width) */}
        <div className="space-y-2">
          <Label>Judul</Label>
          <Input name="title" defaultValue={post.title} required />
        </div>

        {/* GRID KATEGORI & THUMBNAIL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select name="categoryId" defaultValue={String(post.category_id)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Berita Kegiatan</SelectItem>
                <SelectItem value="2">Pojok Edukasi</SelectItem>
                <SelectItem value="3">Profil Desa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Ganti Thumbnail (Opsional)</Label>
            <Input name="thumbnail" type="file" accept="image/*" />

            {/* PREVIEW GAMBAR LAMA */}
            {post.thumbnail_url && (
              <div className="mt-2 text-xs text-gray-500">
                <p className="mb-1">Thumbnail saat ini:</p>
                <div className="relative w-32 h-20 rounded overflow-hidden border">
                  <Image
                    src={post.thumbnail_url}
                    alt="Thumbnail Lama"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Isi Artikel</Label>
          <div className="h-96 mb-12">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              className="h-full"
            />
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
}
