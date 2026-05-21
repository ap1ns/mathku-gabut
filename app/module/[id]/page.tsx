"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMathStore } from "@/lib/store";
import { MODULES } from "@/lib/modules";
import { ArrowLeft } from "lucide-react";

export default function ModuleDetail() {
  const params = useParams();
  const moduleId = params?.id as string;
  const { progress } = useMathStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeModule = MODULES.find(m => m.id === moduleId);
  if (!activeModule) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Modul tidak ditemukan.</p>
        <Link href="/" className="text-blue-400 underline text-sm mt-2 inline-block">Kembali</Link>
      </div>
    );
  }

  const isAddSub = moduleId === "penjumlahan" || moduleId === "pengurangan";
  const mProgress = mounted ? progress[moduleId] : null;
  const completedTables = mProgress?.completedTables ?? [];
  const maxLimit = isAddSub ? 5 : 10;
  const allDone = completedTables.length === maxLimit;

  const LEVELS = [
    { num: 1, name: "Satuan", desc: "1 - 10" },
    { num: 2, name: "Puluhan", desc: "10 - 99" },
    { num: 3, name: "Ratusan", desc: "100 - 999" },
    { num: 4, name: "Ribuan", desc: "1.000 - 9.999" },
    { num: 5, name: "Ratus Ribuan", desc: "100.000 - 999.999" }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <Link href="/" className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Kembali
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-100">{activeModule.title}</h1>
        <p className="text-sm text-slate-400 mt-1">{activeModule.description}</p>
      </div>

      {/* Level/Table grid */}
      {isAddSub ? (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-slate-300">Pilih Level Latihan (Acak)</h2>
          <p className="text-xs text-slate-500">Klik level untuk memulai latihan 10 soal acak. Jawab semua benar untuk menyelesaikan level.</p>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {LEVELS.map((lvl) => {
              const isDone = completedTables.includes(lvl.num);
              return (
                <Link
                  key={lvl.num}
                  href={`/drill/${moduleId}?level=${lvl.num}`}
                  className={`text-center p-3 rounded-lg border text-sm font-medium transition-colors ${
                    isDone
                      ? "border-green-700 bg-green-950/30 text-green-400"
                      : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  {lvl.name}
                  <span className="block text-[10px] text-slate-400 font-mono mt-0.5">({lvl.desc})</span>
                  <span className="block text-[10px] mt-1 text-slate-500">
                    {isDone ? "✅ Selesai" : "Belum"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-bold text-slate-300">Latihan Berurutan (Tabel 1 - 10)</h2>
          <p className="text-xs text-slate-500">Klik tabel untuk memulai latihan 10 soal berurutan. Jawab semua benar untuk menandai selesai.</p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {Array.from({ length: 10 }).map((_, i) => {
              const tableNum = i + 1;
              const isDone = completedTables.includes(tableNum);
              return (
                <Link
                  key={tableNum}
                  href={`/drill/${moduleId}?table=${tableNum}`}
                  className={`text-center p-3 rounded-lg border text-sm font-medium transition-colors ${
                    isDone
                      ? "border-green-700 bg-green-950/30 text-green-400"
                      : "border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  Tabel {tableNum}
                  <span className="block text-[10px] mt-0.5 text-slate-500">
                    {isDone ? "✅ Selesai" : "Belum"}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Random drill */}
      <div className="flex flex-col gap-3 border-t border-slate-800 pt-6">
        <h2 className="text-sm font-bold text-slate-300">Latihan Acak (Campuran)</h2>
        <p className="text-xs text-slate-500">
          {allDone
            ? (isAddSub 
                ? "Semua level selesai! Latihan acak campuran tersedia untuk melatih kecepatan Anda."
                : "Semua tabel selesai! Latihan acak campuran tersedia untuk melatih kecepatan Anda.")
            : (isAddSub 
                ? "Selesaikan semua level terlebih dahulu untuk membuka latihan acak."
                : "Selesaikan semua tabel 1-10 terlebih dahulu untuk membuka latihan acak.")}
        </p>

        {allDone ? (
          <Link
            href={`/drill/${moduleId}`}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-center font-medium text-sm py-3 rounded-lg transition-colors"
          >
            Mulai Latihan Acak (50 Soal)
          </Link>
        ) : (
          <div className="bg-slate-900 text-slate-600 border border-slate-800 text-center text-sm py-3 rounded-lg cursor-not-allowed">
            🔒 {isAddSub ? "Selesaikan Semua Level dulu" : "Selesaikan Tabel 1-10 dulu"}
          </div>
        )}
      </div>
    </div>
  );
}
