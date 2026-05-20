import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ModuleProgress {
  moduleId: string;
  completedTables: number[];
}

interface MathStore {
  progress: Record<string, ModuleProgress>;

  // Actions
  completeTable: (moduleId: string, tableNum: number) => void;
  resetProgress: () => void;
}

export const useMathStore = create<MathStore>()(
  persist(
    (set, get) => ({
      progress: {
        'penjumlahan': { moduleId: 'penjumlahan', completedTables: [] },
        'pengurangan': { moduleId: 'pengurangan', completedTables: [] },
        'perkalian': { moduleId: 'perkalian', completedTables: [] },
        'pembagian': { moduleId: 'pembagian', completedTables: [] },
      },

      completeTable: (moduleId, tableNum) => {
        const currentModProgress = get().progress[moduleId] || { moduleId, completedTables: [] };
        const currentCompleted = currentModProgress.completedTables || [];

        if (currentCompleted.includes(tableNum)) {
          return;
        }

        const newCompleted = [...currentCompleted, tableNum].sort((a, b) => a - b);

        set({
          progress: {
            ...get().progress,
            [moduleId]: {
              ...currentModProgress,
              completedTables: newCompleted,
            }
          }
        });
      },

      resetProgress: () => set({
        progress: {
          'penjumlahan': { moduleId: 'penjumlahan', completedTables: [] },
          'pengurangan': { moduleId: 'pengurangan', completedTables: [] },
          'perkalian': { moduleId: 'perkalian', completedTables: [] },
          'pembagian': { moduleId: 'pembagian', completedTables: [] },
        }
      }),
    }),
    {
      name: 'mathku-user-progress-simplified',
    }
  )
);
