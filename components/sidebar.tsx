"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, FileText, MessageSquare, LogOut, Mountain } from "lucide-react";
import { logoutAction } from "@/actions/auth-actions"; // Import action logout
import { Button } from "@/components/ui/button";

// Definisikan menu
const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["super_admin", "admin", "advisor"],
  },
  {
    title: "Manajemen User",
    href: "/dashboard/users",
    icon: Users,
    roles: ["super_admin"],
  },
  {
    title: "Berita & Artikel",
    href: "/dashboard/posts",
    icon: FileText,
    roles: ["super_admin", "admin", "advisor"],
  },
  {
    title: "Review Advisor",
    href: "/dashboard/reviews",
    icon: MessageSquare,
    roles: ["advisor"],
  },
];

export function Sidebar({ userRole }: { userRole: string }) {
  const pathname = usePathname();

  // FILTER MENU BERDASARKAN ROLE
  const filteredItems = sidebarItems.filter((item) => item.roles.includes(userRole));

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-900 text-white transition-all duration-300">
      {/* 1. LOGO SECTION */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-6">
        <div className="bg-blue-600 p-1.5 rounded-lg shadow-lg shadow-blue-900/20">
          <Mountain className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-wide">PPK ORMAWA</span>
      </div>

      {/* 2. NAVIGATION MENU */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <nav className="space-y-1">
          {filteredItems.map((item, index) => {
            // Logic Active State yang lebih canggih (menangani sub-path)
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" // Active: Biru & Glowing
                    : "text-slate-400 hover:bg-slate-800 hover:text-white" // Inactive: Abu-abu
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-white" : "text-slate-400 group-hover:text-white"
                  )}
                />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 3. FOOTER (LOGOUT) */}
      <div className="border-t border-slate-800 p-4">
        <form action={logoutAction}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-400 hover:bg-red-950/30 hover:text-red-300 pl-3"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </form>
        <p className="mt-4 text-center text-[10px] text-slate-600">&copy; 2026 Tim PPK Ormawa</p>
      </div>
    </div>
  );
}
