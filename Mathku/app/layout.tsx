import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "MathKu - Belajar Matematika Dasar Sederhana",
  description: "Latihan matematika dasar penjumlahan, pengurangan, perkalian, dan pembagian.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased font-sans">
        <Navbar />
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
