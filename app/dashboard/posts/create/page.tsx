"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
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
import { createPost } from "@/actions/post-actions";
import { Loader2 } from "lucide-react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// 1. TAMBAHKAN CONFIG MODULES DISINI (SAMA PERSIS DENGAN HALAMAN EDIT)
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

export default function CreatePostPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    formData.append("content", content);

    const res = await createPost(formData);

    if (res?.error) {
      alert(res.error);
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
      {" "}
      {/* Ubah max-w-2xl jadi 4xl biar lega */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tulis Artikel Baru</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="title">Judul Artikel</Label>
          <Input
            id="title"
            name="title"
            required
            placeholder="Contoh: Sosialisasi Bank Sampah..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select name="categoryId" required defaultValue="1">
              <SelectTrigger>
                <SelectValue placeholder="Pilih..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Berita Kegiatan</SelectItem>
                <SelectItem value="2">Pojok Edukasi</SelectItem>
                <SelectItem value="3">Profil Desa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail (Gambar Cover)</Label>
            <Input id="thumbnail" name="thumbnail" type="file" accept="image/*" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Isi Artikel</Label>
          <div className="h-96 mb-12">
            {" "}
            {/* Tinggi diperbesar jadi h-96 */}
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules} // 2. JANGAN LUPA PASANG PROPS INI
              className="h-full"
            />
          </div>
        </div>

        <div className="pt-8">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Simpan sebagai Draft"}
          </Button>
        </div>
      </form>
    </div>
  );
}
