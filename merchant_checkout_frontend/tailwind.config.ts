import type { Config } from "tailwindcss";

/** Lumina Commerce tokens — see design/lumina_commerce/DESIGN.md */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        container: "1100px",
      },
      colors: {
        canvas: "#07080c",
        surface: "#121318",
        "surface-elevated": "#141824",
        "surface-container": "#1e1f24",
        "surface-container-high": "#292a2e",
        "surface-container-highest": "#343439",
        border: "#252a3a",
        "outline-variant": "#434653",
        "secondary-container": "#434654",
        muted: "#c3c6d6",
        foreground: "#e3e2e8",
        "primary-soft": "#b2c5ff",
        accent: "#5b8cff",
        "accent-soft": "rgba(91, 140, 255, 0.12)",
        "on-accent": "#ffffff",
        "banner-cream": "#ffdcbf",
        "banner-cream-fg": "#2d1600",
        tertiary: "#ffb874",
        "on-tertiary": "#4b2800",
        "tertiary-container": "#d47b00",
        success: "#34d399",
        danger: "#f87171",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card: "0 20px 40px rgba(0, 0, 0, 0.4)",
        glow: "0 0 40px -10px rgba(91, 140, 255, 0.2)",
        "cta-glow": "0 8px 16px rgba(91, 140, 255, 0.2)",
      },
      animation: {
        shimmer: "shimmer 2.2s ease-in-out infinite",
        spin: "spin 0.9s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
