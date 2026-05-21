"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useMathStore } from "@/lib/store";
import { MODULES } from "@/lib/modules";
import { Plus, Minus, X, Divide } from "lucide-react";

const ICONS: Record<string, React.ReactNode> = {
  penjumlahan: <Plus className="h-6 w-6" />,
  pengurangan: <Minus className="h-6 w-6" />,
  perkalian: <X className="h-6 w-6" />,
  pembagian: <Divide className="h-6 w-6" />,
};

export default function Home() {
  const { progress } = useMathStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-100">MathKu</h1>
        <p className="text-sm text-slate-400">
          Pilih operasi matematika yang ingin Anda latih. Hafalkan tabel 1-10 secara berurutan, lalu latihan acak.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {MODULES.map((mod) => {
          const modProgress = mounted ? progress[mod.id] : null;
          const completedCount = modProgress?.completedTables?.length ?? 0;
          const isAddSub = mod.id === "penjumlahan" || mod.id === "pengurangan";
          const maxLimit = isAddSub ? 5 : 10;
          const statusLabel = isAddSub ? "Level selesai" : "Tabel selesai";

          return (
            <Link
              key={mod.id}
              href={`/module/${mod.id}`}
              className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-start gap-4 hover:border-slate-600 transition-colors"
            >
              <div className="bg-slate-800 p-3 rounded-lg text-slate-300 shrink-0">
                {ICONS[mod.id]}
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <h2 className="font-bold text-slate-200 text-sm">{mod.title}</h2>
                <p className="text-xs text-slate-400 leading-relaxed">{mod.description}</p>
                {mounted && (
                  <span className="text-[11px] text-slate-500 mt-1">
                    {statusLabel}: {completedCount} / {maxLimit}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
