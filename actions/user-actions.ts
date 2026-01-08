"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createUser(formData: FormData) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient();

  // 1. Cek Permission (Super Admin Only)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: requesterProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (requesterProfile?.role !== "super_admin") {
    return { error: "Anda bukan Super Admin!" };
  }

  // 2. Ambil data Form
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;

  // 3. Create User di Supabase Auth
  const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (authError) return { error: authError.message };

  if (newUser.user) {
    // 4. INSERT Manual ke Tabel Profiles (PENGGANTI TRIGGER)
    // Kita pakai .upsert() biar aman (kalau id sudah ada dia update, kalau belum dia insert)
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: newUser.user.id,
      full_name: fullName,
      role: role,
      email: email, // Pastikan email juga disimpan manual
    });

    if (profileError) {
      // Jika gagal simpan profil, hapus user auth biar tidak jadi data sampah
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return { error: "Gagal membuat profil: " + profileError.message };
    }
  }

  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function deleteUser(userId: string) {
  const supabase = await createClient(); // Cek Permission dulu
  const supabaseAdmin = createAdminClient(); // Action deletion butuh ini

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: requester } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (requester?.role !== "super_admin") return { error: "Unauthorized" };

  // Hapus dari Auth Supabase (Otomatis profile terhapus karena Cascade)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/users");
  return { success: true };
}

export async function updateUser(formData: FormData) {
  const supabase = await createClient();
  const supabaseAdmin = createAdminClient(); // Butuh admin untuk ubah password orang lain

  // 1. Cek Permission (Hanya Super Admin)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: requester } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (requester?.role !== "super_admin") return { error: "Unauthorized" };

  // 2. Ambil Data Form
  const userId = formData.get("userId") as string;
  const fullName = formData.get("fullName") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  // 3. Update Password (Jika diisi)
  if (password && password.length > 0) {
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: password,
    });
    if (authError) return { error: "Gagal update password: " + authError.message };
  }

  // 4. Update Profile (Nama & Role)
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({ full_name: fullName, role: role })
    .eq("id", userId);

  if (profileError) return { error: "Gagal update profil: " + profileError.message };

  revalidatePath("/dashboard/users");
  return { success: true };
}
