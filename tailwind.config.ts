import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
