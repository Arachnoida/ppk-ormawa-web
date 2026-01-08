import { Sidebar } from "@/components/sidebar"; // Pastikan path import benar
import { Header } from "@/components/header"; // Pastikan path import benar
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  // 1. Cek User Login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Ambil Profil Lengkap (Role & Nama)
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  // Default role jika profile belum ada (safety)
  const userRole = profile?.role || "guest";

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* SIDEBAR: Kirim Role ke sini untuk filtering menu */}
      <aside className="hidden md:flex flex-col z-20 shadow-xl">
        <Sidebar userRole={userRole} />
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        {/* HEADER: Kirim Data Profil ke sini untuk display nama */}
        <Header user={profile} />

        {/* CONTENT UTAMA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
