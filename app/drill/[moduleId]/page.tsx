"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMathStore } from "@/lib/store";
import { MODULES } from "@/lib/modules";
import { generateQuestions, Question } from "@/lib/questions";
import { ArrowLeft, Check, X as XIcon } from "lucide-react";

function DrillContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const moduleId = params?.moduleId as string;
  const { progress, completeTable } = useMathStore();

  const tableParam = searchParams?.get("table");
  const parsedTable = tableParam ? parseInt(tableParam) : NaN;
  const tableNum = !isNaN(parsedTable) ? parsedTable : undefined;
  const rangeParam = searchParams?.get("range") || undefined;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [wrongAnswer, setWrongAnswer] = useState("");
  const [done, setDone] = useState(false);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const q = tableNum !== undefined
      ? generateQuestions(moduleId, 10, tableNum, rangeParam)
      : generateQuestions(moduleId, 50, undefined, rangeParam);
    setQuestions(q);
    setCurrentIndex(0);
    setCorrectCount(0);
    setDone(false);
    setFeedback("idle");
    setInputValue("");
  }, [moduleId, tableNum]);

  useEffect(() => {
    if (mounted && inputRef.current && !done && feedback === "idle") {
      inputRef.current.focus();
    }
  }, [currentIndex, done, mounted, feedback]);

  if (!mounted || questions.length === 0) {
    return <div className="text-center py-12 text-slate-500">Memuat soal...</div>;
  }

  const activeModule = MODULES.find(m => m.id === moduleId);
  if (!activeModule) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Modul tidak ditemukan.</p>
        <Link href="/" className="text-blue-400 underline text-sm">Kembali</Link>
      </div>
    );
  }

  // Bypass check for random mode
  const mProgress = progress[moduleId];
  const allTablesCompleted = mProgress?.completedTables?.length === 10;
  if (tableNum === undefined && !allTablesCompleted) {
    return (
      <div className="text-center py-12 flex flex-col items-center gap-4">
        <p className="text-slate-400 text-sm">Latihan acak terkunci. Selesaikan tabel 1-10 terlebih dahulu.</p>
        <Link href={`/module/${moduleId}`} className="text-blue-400 underline text-sm">Kembali ke Modul</Link>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || feedback !== "idle") return;

    const userAns = inputValue.trim();
    const correctAns = currentQ.correctAnswer.trim();

    if (userAns === correctAns) {
      setCorrectCount(prev => prev + 1);
      setFeedback("correct");
      setTimeout(() => advance(), 400);
    } else {
      setWrongAnswer(correctAns);
      setFeedback("wrong");
      setTimeout(() => advance(), 1200);
    }
  };

  const advance = () => {
    setInputValue("");
    setFeedback("idle");
    setWrongAnswer("");

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setDone(true);
      // Check if table mastered (100% for sequential)
      if (tableNum !== undefined) {
        const finalCorrect = correctCount + (feedback === "correct" ? 0 : 0);
        // We already incremented correctCount before calling advance for correct
        // The correctCount at this point reflects answers up to currentIndex
        // But since we check after the last answer, we need to account for the last one
      }
    }
  };

  // Done view
  if (done) {
    // Recalculate - correctCount was set before advance for the last question
    const accuracy = Math.round((correctCount / questions.length) * 100);
    const isSeq = tableNum !== undefined;
    const passed = accuracy === 100;

    // Mark table complete if passed sequential
    if (isSeq && passed) {
      completeTable(moduleId, tableNum);
    }

    return (
      <div className="max-w-md mx-auto py-8 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center flex flex-col gap-4">
          <h2 className="text-lg font-bold text-slate-200">
            {isSeq ? `Tabel ${tableNum} Selesai` : "Latihan Acak Selesai"}
          </h2>

          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className={`text-3xl font-bold ${passed ? "text-green-400" : "text-red-400"}`}>{accuracy}%</div>
              <div className="text-xs text-slate-500">Akurasi</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-300">{correctCount}/{questions.length}</div>
              <div className="text-xs text-slate-500">Benar</div>
            </div>
          </div>

          {isSeq && !passed && (
            <p className="text-xs text-slate-400">Anda perlu menjawab semua benar (100%) untuk menandai tabel ini selesai.</p>
          )}
          {isSeq && passed && (
            <p className="text-xs text-green-400">✅ Tabel {tableNum} berhasil dihafal!</p>
          )}

          <div className="flex flex-col gap-2 mt-2">
            {isSeq && passed && tableNum < 10 && (
              <Link
                href={`/drill/${moduleId}?table=${tableNum + 1}`}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-sm py-2.5 rounded-lg text-center transition-colors"
              >
                Lanjut ke Tabel {tableNum + 1}
              </Link>
            )}
            <button
              onClick={() => {
                setQuestions(generateQuestions(moduleId, isSeq ? 10 : 50, tableNum, rangeParam));
                setCurrentIndex(0);
                setCorrectCount(0);
                setDone(false);
                setFeedback("idle");
                setInputValue("");
              }}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm py-2.5 rounded-lg transition-colors"
            >
              Ulangi
            </button>
            <Link
              href={`/module/${moduleId}`}
              className="text-xs text-slate-500 hover:text-slate-300 text-center py-2 transition-colors"
            >
              Kembali ke Modul
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Quiz view
  return (
    <div className="max-w-md mx-auto flex flex-col gap-6 py-4">
      {/* Top bar */}
      <div className="flex justify-between items-center text-xs text-slate-500">
        <Link href={`/module/${moduleId}`} className="flex items-center gap-1 hover:text-slate-300 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Keluar
        </Link>
        <span>
          {tableNum !== undefined ? `Tabel ${tableNum}` : "Acak"} — Soal {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: `${(currentIndex / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-xl text-center flex flex-col items-center gap-6">
        <div className="font-mono font-bold text-4xl text-slate-100">
          {currentQ.questionText.replace(" = ?", "")}
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-[200px]">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="-?[0-9]*"
            value={inputValue}
            disabled={feedback !== "idle"}
            onChange={(e) => setInputValue(e.target.value)}
            className={`w-full bg-slate-950 font-mono text-center text-2xl font-bold px-4 py-3 rounded-lg border focus:outline-none transition-colors ${feedback === "correct"
                ? "border-green-500 text-green-400 bg-green-950/20"
                : feedback === "wrong"
                  ? "border-red-500 text-red-400 bg-red-950/20"
                  : "border-slate-700 text-slate-100 focus:border-blue-500"
              }`}
            placeholder="?"
            required
            autoComplete="off"
          />
        </form>

        {feedback === "correct" && (
          <div className="flex items-center gap-1 text-green-400 text-sm font-medium">
            <Check className="h-4 w-4" /> Benar!
          </div>
        )}
        {feedback === "wrong" && (
          <div className="flex items-center gap-1 text-red-400 text-sm font-medium">
            <XIcon className="h-4 w-4" /> Salah. Jawaban: {wrongAnswer}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DrillSession() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-slate-500">Memuat...</div>}>
      <DrillContent />
    </Suspense>
  );
}
