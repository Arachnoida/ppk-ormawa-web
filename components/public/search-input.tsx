"use client";

import { Search } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useRef } from "react"; // Kita pakai useRef untuk timer

export function SearchInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Ref untuk menyimpan ID timer agar tidak hilang saat re-render
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (term: string) => {
    // Bersihkan timer sebelumnya jika user masih mengetik (Debounce Logic)
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set timer baru (tunggu 500ms setelah user berhenti mengetik)
    timeoutRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }

      replace(`${pathname}?${params.toString()}`);
    }, 500);
  };

  return (
    <div className="relative w-full md:w-80">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        placeholder="Cari artikel..."
        className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("q")?.toString()}
      />
    </div>
  );
}
