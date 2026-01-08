"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updatePostStatus(postId: string, newStatus: "published" | "draft") {
  const supabase = await createClient();

  // Update status di database
  const { error } = await supabase.from("posts").update({ status: newStatus }).eq("id", postId);

  if (error) {
    console.error("Gagal update status:", error);
    return { error: "Gagal mengubah status" };
  }

  // Refresh halaman agar tabel langsung berubah
  revalidatePath("/dashboard/posts");
  revalidatePath("/"); // Refresh juga halaman depan agar berita muncul/hilang
  revalidatePath("/berita"); // Refresh halaman arsip

  return { success: true };
}
