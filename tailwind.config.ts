import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        espresso: "#2B1B12",
        "espresso-light": "#4A362A",
        cream: "#F3ECDC",
        gold: "#B8862E",
        "gold-light": "#D9AE5C",
        olive: "#6B7B4A",
      },
      fontFamily: {
        serif: ["Georgia", "'Iowan Old Style'", "serif"],
      },
      boxShadow: {
        card: "0 10px 24px rgba(43,27,18,0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
