"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addComment(formData: FormData) {
  const supabase = await createClient();

  // 1. Cek User Login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // 2. Ambil data form
  const postId = formData.get("postId") as string;
  const content = formData.get("comment") as string;

  if (!content) return { error: "Komentar tidak boleh kosong" };

  // 3. Simpan Komentar
  const { error } = await supabase.from("post_comments").insert({
    post_id: postId,
    user_id: user.id,
    comment_text: content,
    is_resolved: false,
  });

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/reviews/${postId}`); // Refresh halaman review
  return { success: true };
}
