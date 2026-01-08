import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  // Panggil fungsi 'SOP Satpam' yang sudah kita buat di folder lib tadi
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Kode regex ini memastikan Middleware BERJALAN di seluruh halaman,
     * KECUALI file gambar, file statis, dan favicon.
     * Jadi kinerja website tidak berat.
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
