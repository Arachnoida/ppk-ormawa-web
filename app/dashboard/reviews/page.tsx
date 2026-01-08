import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ReviewsPage() {
  const supabase = await createClient();

  // 1. Cek Apakah User adalah Advisor?
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .single();

  if (profile?.role !== "advisor" && profile?.role !== "super_admin") {
    return <div className="p-4 text-red-500">Akses Ditolak. Halaman ini khusus Advisor.</div>;
  }

  // 2. Fetch HANYA Draft
  const { data: posts } = await supabase
    .from("posts")
    .select(`*, categories(name), profiles(full_name)`)
    .eq("status", "draft") // Filter Draft
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Review Draft Artikel</h2>
      <p className="text-muted-foreground">Daftar artikel yang menunggu persetujuan/revisi.</p>

      <div className="border rounded-md bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Judul</TableHead>
              <TableHead>Penulis</TableHead>
              <TableHead>Tanggal Submit</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  Tidak ada draft baru.
                </TableCell>
              </TableRow>
            )}
            {posts?.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.profiles?.full_name}</TableCell>
                <TableCell>{new Date(post.created_at).toLocaleDateString("id-ID")}</TableCell>
                <TableCell>
                  <Button variant="default" size="sm" asChild>
                    <Link href={`/dashboard/reviews/${post.id}`}>
                      <Eye className="mr-2 h-4 w-4" /> Periksa
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
