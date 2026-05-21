export interface Question {
  id: string;
  moduleId: string;
  questionText: string;
  correctAnswer: string;
  meta?: any;
}

// Simple shuffle
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function generateQuestions(moduleId: string, count: number = 50, tableNum?: number, range?: string): Question[] {
  const questions: Question[] = [];

  // Helper: return a random integer in [min, max]
  const randBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Map range label to a random value generator. For addition/subtraction we support
  // 'satuan', 'puluhan', 'ratus', 'ribuan', 'ratus-ribuan' and 'all' (mixed).
  function randForRange(label?: string, moduleLimit?: "muldiv") {
    const ranges = [
      { key: 'satuan', min: 1, max: 10 },
      { key: 'puluhan', min: 10, max: 99 },
      { key: 'ratus', min: 100, max: 999 },
      { key: 'ribuan', min: 1000, max: 9999 },
      { key: 'ratus-ribuan', min: 100000, max: 999999 },
    ];

    // For multiplication/division cap to hundreds (1..100)
    if (moduleLimit === 'muldiv') {
      return randBetween(1, 100);
    }

    if (!label || label === 'satuan') return randBetween(1, 10);
    if (label === 'puluhan') return randBetween(10, 99);
    if (label === 'ratus') return randBetween(100, 999);
    if (label === 'ribuan') return randBetween(1000, 9999);
    if (label === 'ratus-ribuan') return randBetween(100000, 999999);
    if (label === 'all') {
      const pick = ranges[Math.floor(Math.random() * ranges.length)];
      return randBetween(pick.min, pick.max);
    }

    // fallback: try parse numeric upper bound
    const n = parseInt(label || '10');
    if (!isNaN(n) && n > 0) return randBetween(1, n);
    return randBetween(1, 10);
  }

  switch (moduleId) {
    case "penjumlahan": {
      if (tableNum !== undefined) {
        // Sequential addition table: tableNum + 1 to tableNum + 10
        for (let i = 1; i <= 10; i++) {
          questions.push({
            id: `penjumlahan-seq-${tableNum}-${i}`,
            moduleId,
            questionText: `${tableNum} + ${i} = ?`,
            correctAnswer: (tableNum + i).toString(),
            meta: { a: tableNum, b: i, op: "+" }
          });
        }
      } else {
        // Random mixed addition with range support
        for (let i = 0; i < count; i++) {
          const a = randForRange(range);
          const b = randForRange(range);
          questions.push({
            id: `penjumlahan-random-${range || 's'}-${i}`,
            moduleId,
            questionText: `${a} + ${b} = ?`,
            correctAnswer: (a + b).toString(),
            meta: { a, b, op: "+", range }
          });
        }
      }
      break;
    }

    case "pengurangan": {
      if (tableNum !== undefined) {
        // Sequential subtraction table: (tableNum + i) - tableNum = i
        // e.g. Table 5: 6 - 5 = 1, 7 - 5 = 2, ..., 15 - 5 = 10
        for (let i = 1; i <= 10; i++) {
          const start = tableNum + i;
          questions.push({
            id: `pengurangan-seq-${tableNum}-${i}`,
            moduleId,
            questionText: `${start} - ${tableNum} = ?`,
            correctAnswer: i.toString(),
            meta: { a: start, b: tableNum, op: "-" }
          });
        }
      } else {
        // Random mixed subtraction with range support
        for (let i = 0; i < count; i++) {
          // pick the subtrahend and the result, then compute minuend = subtrahend + result
          const b = randForRange(range);
          const offset = randForRange(range);
          const a = b + offset;
          questions.push({
            id: `pengurangan-random-${range || 's'}-${i}`,
            moduleId,
            questionText: `${a} - ${b} = ?`,
            correctAnswer: offset.toString(),
            meta: { a, b, op: "-", range }
          });
        }
      }
      break;
    }

    case "perkalian": {
      if (tableNum !== undefined) {
        // Sequential multiplication table: tableNum x 1 to tableNum x 10
        for (let i = 1; i <= 10; i++) {
          questions.push({
            id: `perkalian-seq-${tableNum}-${i}`,
            moduleId,
            questionText: `${tableNum} x ${i} = ?`,
            correctAnswer: (tableNum * i).toString(),
            meta: { a: tableNum, b: i, op: "x" }
          });
        }
      } else {
        // Random mixed multiplication. Limit values to hundreds.
        const maxVal = 100;
        const pairs: [number, number][] = [];
        // build a reasonable sample space (1..maxVal but avoid huge Cartesian product)
        const sample = Math.min(maxVal, 50);
        for (let i = 1; i <= sample; i++) {
          for (let j = 1; j <= sample; j++) {
            pairs.push([i, j]);
          }
        }
        const shuffledPairs = shuffle(pairs);
        const limit = Math.min(count, shuffledPairs.length);
        for (let idx = 0; idx < limit; idx++) {
          const [a, b] = shuffledPairs[idx];
          questions.push({
            id: `perkalian-random-${range || 'h'}-${idx}`,
            moduleId,
            questionText: `${a} x ${b} = ?`,
            correctAnswer: (a * b).toString(),
            meta: { a, b, op: "x", range: 'ratusan' }
          });
        }
        // Fill remaining if needed
        while (questions.length < count) {
          const a = randForRange(undefined, 'muldiv');
          const b = randForRange(undefined, 'muldiv');
          questions.push({
            id: `perkalian-random-extra-${questions.length}`,
            moduleId,
            questionText: `${a} x ${b} = ?`,
            correctAnswer: (a * b).toString(),
            meta: { a, b, op: "x", range: 'ratusan' }
          });
        }
      }
      break;
    }

    case "pembagian": {
      if (tableNum !== undefined) {
        // Sequential division table: (tableNum * i) : tableNum = i
        for (let i = 1; i <= 10; i++) {
          const prod = tableNum * i;
          questions.push({
            id: `pembagian-seq-${tableNum}-${i}`,
            moduleId,
            questionText: `${prod} : ${tableNum} = ?`,
            correctAnswer: i.toString(),
            meta: { a: prod, b: tableNum, op: ":" }
          });
        }
      } else {
        // Random mixed division. Limit divisors/quotients to hundreds.
        for (let i = 0; i < count; i++) {
          const divisor = randForRange(undefined, 'muldiv');
          const quotient = randForRange(undefined, 'muldiv');
          const prod = divisor * quotient;
          questions.push({
            id: `pembagian-random-${range || 'h'}-${i}`,
            moduleId,
            questionText: `${prod} : ${divisor} = ?`,
            correctAnswer: quotient.toString(),
            meta: { a: prod, b: divisor, op: ":", range: 'ratusan' }
          });
        }
      }
      break;
    }

    default:
      break;
  }

  return questions;
}
