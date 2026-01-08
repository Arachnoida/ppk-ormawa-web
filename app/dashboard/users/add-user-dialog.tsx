"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createUser } from "@/actions/user-actions";
import { Loader2, Plus, UserPlus } from "lucide-react"; // Tambah Icon UserPlus

export function AddUserDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const res = await createUser(formData);
    setLoading(false);

    if (res?.error) {
      alert(res.error); // Bisa diganti toast.error() jika pakai sonner/toast
    } else {
      setOpen(false);
      alert("User berhasil dibuat!"); // Bisa diganti toast.success()
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* UPDATE STYLE TOMBOL DISINI AGAR SENADA DENGAN TEMA */}
        <Button className="bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 transition-all">
          <Plus className="mr-2 h-4 w-4" /> Tambah User Baru
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <UserPlus className="h-5 w-5 text-slate-900" />
            </div>
            <DialogTitle>Tambah User Baru</DialogTitle>
          </div>
          <DialogDescription>
            Buat akun untuk Admin (Rekan) atau Advisor (Dosen). Password default diperlukan.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* ... (Input form Anda sudah benar, biarkan saja) ... */}
            <div className="grid gap-2">
              <Label htmlFor="fullName">Nama Lengkap</Label>
              <Input id="fullName" name="fullName" required placeholder="Contoh: Budi Santoso" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="email@kampus.ac.id"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password Default</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                placeholder="Minimal 6 karakter"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select name="role" required defaultValue="admin">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin (Rekan Tim)</SelectItem>
                  <SelectItem value="advisor">Advisor (Dosen)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="bg-slate-900 hover:bg-slate-800 w-full sm:w-auto"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan User
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
