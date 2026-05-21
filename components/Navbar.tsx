"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useMathStore } from "@/lib/store";
import { RefreshCw } from "lucide-react";

export default function Navbar() {
  const { resetProgress } = useMathStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="text-xl font-bold text-slate-200">MathKu</span>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-black tracking-tight text-slate-100">
            MathKu
          </span>
        </Link>

        {/* Reset button */}
        <button
          onClick={() => {
            if (confirm("Reset semua data latihan Anda?")) {
              resetProgress();
            }
          }}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors font-medium"
          title="Reset semua progres latihan"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset Progres
        </button>
      </div>
    </header>
  );
}
