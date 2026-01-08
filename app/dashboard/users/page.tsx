import { createClient } from "@/lib/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Shield, User, Calendar } from "lucide-react";
import { deleteUser } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { AddUserDialog } from "./add-user-dialog";
import { EditUserDialog } from "./edit-user-dialog"; // <--- 1. IMPORT DIALOG EDIT

export default async function UsersPage() {
  const supabase = await createClient();

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Manajemen Pengguna</h2>
          <p className="text-slate-500 mt-1">Kelola akses, peran, dan anggota tim PPK ORMAWA.</p>
        </div>

        <AddUserDialog />
      </div>

      {/* TABLE SECTION */}
      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table className="w-full">
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[40%] pl-6 py-4 text-slate-700 font-semibold">
                Nama Lengkap
              </TableHead>
              <TableHead className="w-[20%] text-slate-700 font-semibold">Role / Jabatan</TableHead>
              <TableHead className="w-[20%] text-slate-700 font-semibold">Tanggal Gabung</TableHead>
              <TableHead className="w-[20%] text-right pr-6 text-slate-700 font-semibold">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                    <User className="h-10 w-10 text-slate-300" />
                    <p>Belum ada pengguna terdaftar.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {users?.map((user) => (
              <TableRow
                key={user.id}
                className="group hover:bg-slate-50/60 transition-colors border-b last:border-0"
              >
                {/* KOLOM NAMA */}
                <TableCell className="pl-6 py-4 align-middle">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold border border-opacity-20 ${
                        user.role === "super_admin"
                          ? "bg-slate-900 text-white border-slate-700"
                          : user.role === "admin"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-orange-100 text-orange-700 border-orange-200"
                      }`}
                    >
                      {user.full_name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 text-base">
                        {user.full_name}
                      </span>
                      <span className="text-xs text-slate-500">
                        {user.email || "Email tidak tersedia"}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* KOLOM ROLE */}
                <TableCell className="align-middle">
                  {user.role === "super_admin" && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white shadow-sm shadow-slate-900/10">
                      <Shield className="h-3 w-3" /> SUPER ADMIN
                    </div>
                  )}
                  {user.role === "admin" && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-700">
                      <User className="h-3 w-3" /> ADMIN
                    </div>
                  )}
                  {user.role === "advisor" && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      <Shield className="h-3 w-3" /> ADVISOR
                    </div>
                  )}
                </TableCell>

                {/* KOLOM TANGGAL */}
                <TableCell className="align-middle text-slate-600 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {new Date(user.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </TableCell>

                {/* KOLOM AKSI */}
                <TableCell className="text-right pr-6 align-middle">
                  <div className="flex justify-end gap-1">
                    {/* 2. INI BAGIAN PENTING: GANTI LINK ERROR DENGAN DIALOG */}
                    <EditUserDialog user={user} />

                    <form
                      action={async () => {
                        "use server";
                        await deleteUser(user.id);
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
