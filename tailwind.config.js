/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{ts,tsx}",
    "./contexts/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
    "./*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        outfit: ["Outfit", "sans-serif"],
        chewy: ["Chewy", "cursive"],
        marker: ["Permanent Marker", "cursive"],
      },
      colors: {
        dark: {
          bg: "#0f172a", // slate-900
          surface: "#1e293b", // slate-800
          border: "#334155", // slate-700
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin 60s linear infinite",
      },
      keyframes: {
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
    },
  },
  plugins: [],
};
