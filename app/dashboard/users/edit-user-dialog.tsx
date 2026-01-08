"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { updateUser } from "@/actions/user-actions";
import { Loader2, Pencil, UserCog } from "lucide-react"; // Gunakan icon Pencil atau UserCog

export function EditUserDialog({ user }: { user: any }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData(event.currentTarget);

    const res = await updateUser(formData);
    setLoading(false);

    if (res?.error) {
      alert(res.error);
    } else {
      setOpen(false);
      // alert("User berhasil diupdate!"); // Opsional
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* STYLE TOMBOL DISAMAKAN DENGAN STYLE DI PAGE.TSX */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserCog className="h-5 w-5 text-blue-700" />
            </div>
            <DialogTitle>Edit User: {user.full_name}</DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="userId" value={user.id} />

          <div className="grid gap-4 py-4">
            {/* Nama Lengkap */}
            <div className="grid gap-2">
              <Label>Nama Lengkap</Label>
              <Input name="fullName" defaultValue={user.full_name} required />
            </div>

            {/* Email (Read Only) */}
            <div className="grid gap-2">
              <Label>Email (Tidak dapat diubah)</Label>
              <Input value={user.email || ""} disabled className="bg-slate-50 text-slate-500" />
            </div>

            {/* Role */}
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select name="role" defaultValue={user.role}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="advisor">Advisor</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
            <div className="grid gap-2 border-t pt-4 mt-2">
              <Label>Reset Password (Opsional)</Label>
              <Input
                name="password"
                type="password"
                placeholder="Isi jika ingin mengganti password"
              />
              <p className="text-[10px] text-gray-500">
                Kosongkan jika tidak ingin mengubah password.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 bg-slate-50 -mx-6 -mb-6 p-4 border-t mt-2 rounded-b-lg">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
