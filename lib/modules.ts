export interface Module {
  id: string; // 'penjumlahan' | 'pengurangan' | 'perkalian' | 'pembagian'
  title: string;
  description: string;
  topics: string[];
}

export const MODULES: Module[] = [
  {
    id: "penjumlahan",
    title: "Penjumlahan",
    description: "Kuasai operasi penjumlahan dari tingkat satuan, puluhan, hingga ratusan ribu.",
    topics: ["Level Satuan", "Level Puluhan", "Level Ratusan", "Level Ribuan", "Level Ratus Ribuan", "Latihan Campuran Acak"]
  },
  {
    id: "pengurangan",
    title: "Pengurangan",
    description: "Kuasai operasi pengurangan dari tingkat satuan, puluhan, hingga ratusan ribu.",
    topics: ["Level Satuan", "Level Puluhan", "Level Ratusan", "Level Ribuan", "Level Ratus Ribuan", "Latihan Campuran Acak"]
  },
  {
    id: "perkalian",
    title: "Perkalian Dasar (1 - 10)",
    description: "Kuasai operasi perkalian angka 1 sampai 10 secara teratur dan acak.",
    topics: ["Tabel Perkalian 1-10", "Latihan Berurutan", "Latihan Campuran Acak"]
  },
  {
    id: "pembagian",
    title: "Pembagian Dasar (1 - 10)",
    description: "Kuasai operasi pembagian angka 1 sampai 10 secara teratur dan acak.",
    topics: ["Tabel Pembagian 1-10", "Latihan Berurutan", "Latihan Campuran Acak"]
  }
];
