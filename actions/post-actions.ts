"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  // 1. Ambil User yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // 2. Ambil data dari form
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId");
  const imageFile = formData.get("thumbnail") as File;

  // 3. Generate Slug (URL ramah SEO)
  // Contoh: "Kegiatan di Desa" -> "kegiatan-di-desa-1709..."
  const slug =
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Hapus karakter aneh
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Date.now(); // Tambah waktu agar unik

  let thumbnailUrl = null;

  // 4. Proses Upload Gambar (Jika ada gambar dipilih)
  if (imageFile && imageFile.size > 0) {
    // Nama file unik: timestamp-namafileasli
    const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.]/g, "")}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images") // Pastikan nama bucket di Supabase adalah 'images'
      .upload(fileName, imageFile);

    if (uploadError) {
      console.error("Upload Error:", uploadError);
      return { error: "Gagal upload gambar: " + uploadError.message };
    }

    // Dapatkan URL publik gambar agar bisa dilihat orang
    const {
      data: { publicUrl },
    } = supabase.storage.from("images").getPublicUrl(fileName);

    thumbnailUrl = publicUrl;
  }

  // 5. Simpan ke Database
  const { error: dbError } = await supabase.from("posts").insert({
    title,
    slug,
    content,
    category_id: Number(categoryId),
    author_id: user.id,
    thumbnail_url: thumbnailUrl,
    status: "draft", // Default Draft
  });

  if (dbError) {
    console.error("DB Error:", dbError);
    return { error: dbError.message };
  }

  // Refresh halaman list berita
  revalidatePath("/dashboard/posts");
  redirect("/dashboard/posts");
}

export async function deletePost(postId: string) {
  const supabase = await createClient();

  // 1. Hapus dari Database
  const { error } = await supabase.from("posts").delete().eq("id", postId);

  if (error) {
    return { error: "Gagal menghapus artikel: " + error.message };
  }

  // 2. Refresh Halaman
  revalidatePath("/dashboard/posts");
  revalidatePath("/"); // Refresh home
  revalidatePath("/berita"); // Refresh list berita

  return { success: true };
}
