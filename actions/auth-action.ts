"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const supabase = await createClient(); // Await karena fix Next.js 15 tadi

  // Ambil data dari form HTML
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Proses Login ke Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Jika gagal, kembalikan pesan error ke frontend
    return { errorMessage: error.message };
  }

  // Jika berhasil, refresh cache dan redirect
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}
