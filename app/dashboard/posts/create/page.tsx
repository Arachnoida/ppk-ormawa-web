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

// Import CSS tambahan agar Editor terlihat lega
import "@/app/globals.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }], // Tambahkan H3 juga biar lengkap
    ["bold", "italic", "underline", "blockquote"], // Tambahkan blockquote
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
    } else {
      // Redirect atau reset form jika sukses (opsional)
      alert("Artikel berhasil dibuat!");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {" "}
      {/* Tambah padding bawah */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tulis Artikel Baru</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
        {/* ... INPUT JUDUL, KATEGORI, THUMBNAIL (SAMA SEPERTI SEBELUMNYA) ... */}

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
            <Label htmlFor="thumbnail">Thumbnail</Label>
            <Input id="thumbnail" name="thumbnail" type="file" accept="image/*" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Isi Artikel</Label>
          <div className="h-[500px] mb-12">
            {" "}
            {/* Tinggi editor diperbesar */}
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              className="h-full"
            />
          </div>
        </div>

        <div className="pt-12">
          {" "}
          {/* Tambah padding top agar tombol tidak ketabrak */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : "Simpan & Publikasikan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
