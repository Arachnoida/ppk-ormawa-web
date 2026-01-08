import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));

          // Update response cookies juga
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 1. Cek User Login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. Proteksi Route Dashboard
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Jika belum login, tendang ke login
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // 3. Cek Role (RBAC) - Query ke tabel profiles
    // Hati-hati: Query DB di middleware bisa nambah latensi, tapi aman untuk skala kecil
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    // Contoh Aturan: Advisor tidak boleh masuk menu 'users' (Management User)
    if (
      request.nextUrl.pathname.startsWith("/dashboard/users") &&
      profile?.role !== "super_admin"
    ) {
      // Redirect ke dashboard utama jika mencoba akses ilegal
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Jika user sudah login tapi buka halaman login, lempar ke dashboard
  if (request.nextUrl.pathname.startsWith("/login") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return supabaseResponse;
}
