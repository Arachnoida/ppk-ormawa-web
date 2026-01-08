import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, Clock, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Ambil Data User (JANGAN LUPA AMBIL 'role')
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role") // <--- Update disini (tambah role)
    .eq("id", user?.id)
    .single();

  // 2. Hitung Statistik
  const [userRes, publishedRes, draftRes] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "draft"),
  ]);

  const userCount = userRes.count || 0;
  const publishedCount = publishedRes.count || 0;
  const draftCount = draftRes.count || 0;

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16 pointer-events-none"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Halo, {profile?.full_name?.split(" ").slice(-2).join(" ") || "Admin"}!{" "}
          </h1>
          <p className="text-slate-300 mt-2 max-w-xl">
            Selamat datang kembali di Dashboard PPK ORMAWA. Apa yang ingin Anda kerjakan hari ini?
          </p>
        </div>

        <div className="relative z-10 flex gap-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 border-none">
            <Link href="/dashboard/posts/create">
              <Sparkles className="mr-2 h-4 w-4" /> Buat Artikel Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* STATS CARDS SECTION */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* CARD 1: TOTAL USER (Link Hanya untuk Super Admin) */}
        <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Pengguna</p>
                <h3 className="text-3xl font-bold text-slate-800">{userCount}</h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-full text-blue-600">
                <Users className="h-6 w-6" />
              </div>
            </div>

            {/* LOGIKA KONDISIONAL DISINI */}
            {profile?.role === "super_admin" && (
              <div className="mt-4 flex items-center text-xs text-blue-600 font-medium hover:underline cursor-pointer">
                <Link href="/dashboard/users" className="flex items-center">
                  Kelola User <ArrowRight className="ml-1 h-3 w-3" />
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CARD 2: ARTIKEL PUBLISHED */}
        <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Artikel Tayang</p>
                <h3 className="text-3xl font-bold text-slate-800">{publishedCount}</h3>
              </div>
              <div className="p-3 bg-green-50 rounded-full text-green-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-green-600 font-medium hover:underline cursor-pointer">
              <Link href="/dashboard/posts" className="flex items-center">
                Lihat Semua <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* CARD 3: DRAFT / REVIEW */}
        <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Menunggu Review</p>
                <h3 className="text-3xl font-bold text-slate-800">{draftCount}</h3>
              </div>
              <div className="p-3 bg-orange-50 rounded-full text-orange-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-orange-600 font-medium hover:underline cursor-pointer">
              <Link href="/dashboard/posts" className="flex items-center">
                Cek Draft <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
