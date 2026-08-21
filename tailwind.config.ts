import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Text + button color only (spec: phase3 §2) — never a full-page background.
        navy: "#1F2B45",
        "navy-light": "#374970",
        "navy-deep": "#141C2E",
        // Warm palette — the actual page background system.
        ivory: "#F7F1E8",
        cream: "#F4EBDD",
        sand: "#E5D7C3",
        gold: "#C8A66A",
        "gold-light": "#DFC79A",
        terracotta: "#B97858",
        bronze: "#9C7A46",
        whatsapp: "#25D366",
      },
      fontFamily: {
        // Instrument Serif for large editorial headings.
        serif: ["var(--font-heading)", "Georgia", "'Iowan Old Style'", "serif"],
        // Manrope (or Noto Kufi Arabic in RTL) for prices/buttons/nav/categories.
        ui: ["var(--font-ui)", "system-ui", "sans-serif"],
        // Manrope (or Noto Sans Arabic in RTL) for body copy/descriptions.
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #DFC79A 0%, #C8A66A 45%, #A9814F 100%)",
        "gold-gradient-hover": "linear-gradient(135deg, #E8D5AE 0%, #D4B583 45%, #A9854F 100%)",
        "paper-grain":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        card: "0 10px 24px rgba(31,43,69,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
