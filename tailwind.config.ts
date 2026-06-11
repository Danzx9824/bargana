import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A", // Preto profundo
        surface: "#141414",    // Cinza escuro para superfícies
        border: "#2A2A2A",     // Cinza médio para divisões
        muted: "#888888",      // Texto secundário
        gold: "#D4AF37",       // Dourado elegante
        "gold-dark": "#B8962E" // Dourado hover
      },
    },
  },
  plugins: [],
};
export default config;