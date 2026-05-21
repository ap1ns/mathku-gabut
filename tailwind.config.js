/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0F172A",     // Background slate dark
          darkBlue: "#1E293B", // Card background
          primary: "#2563EB",  // Vibrant blue for primary buttons
          lightBlue: "#3B82F6",// Lighter blue accent
          accent: "#60A5FA",   // Soft blue accent for glows and text
        },
        math: {
          correct: "#10B981",  // Emerald green for correct
          wrong: "#EF4444",    // Rose red for wrong
          warning: "#F59E0B",  // Amber for warnings/hints
          xp: "#FBBF24",       // Gold for XP / Levels
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Nunito", "sans-serif"],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'wiggle': 'wiggle 0.3s ease-in-out',
        'flip-front': 'flipFront 0.6s forwards',
        'flip-back': 'flipBack 0.6s forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 10px rgba(59, 130, 246, 0.2)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        }
      }
    },
  },
  plugins: [],
}
