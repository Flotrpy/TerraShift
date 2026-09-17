import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light editorial theme.
        paper: "#f5f4ef",
        ink: "#12181a",
        brand: {
          600: "#1f6b4a",
          500: "#2a8562",
          400: "#3fae7c",
        },
        clay: "#d9663f",
        dark: {
          900: "#0d1a16",
          800: "#132420",
          700: "#1b332c",
        },
        // Kept for anything still referencing the old dark palette.
        earth: {
          950: "#05130f",
          900: "#0a1f18",
          800: "#0f2e22",
          700: "#17402f",
          600: "#1f5540",
          400: "#4f9e7c",
          200: "#a8dfc7",
          100: "#e3f5ec",
        },
        sand: "#f4efe6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
