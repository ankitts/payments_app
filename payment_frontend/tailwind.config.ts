import type { Config } from "tailwindcss";

/**
 * Design tokens from `stitch_merchant_payments_dashboard` (Kinetic Enterprise / Google Stitch).
 * Spec: stitch_merchant_payments_dashboard/kinetic_enterprise/DESIGN.md
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#0A0A0A",
        background: "#131313",
        surface: "#131313",
        "surface-dim": "#131313",
        "surface-bright": "#3a3939",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1c1b1b",
        "surface-container": "#201f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353534",
        "surface-variant": "#353534",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#c2c6d6",
        "on-background": "#e5e2e1",
        outline: "#8c909f",
        "outline-variant": "#424754",
        primary: "#adc6ff",
        "primary-container": "#4d8eff",
        "on-primary": "#002e6a",
        "on-primary-container": "#00285d",
        "primary-fixed": "#d8e2ff",
        secondary: "#c8c6c5",
        "secondary-container": "#474746",
        "on-secondary-container": "#b7b5b4",
        /** Accent (charts / tertiary UI); `/opacity` works unlike `tertiary-container` alone */
        tertiary: "#ffb74d",
        "tertiary-container": "#df7412",
        error: "#ffb4ab",
        "on-error": "#690005",
        /** Legacy aliases used across pages — mapped to Stitch palette */
        shell: {
          bg: "#0A0A0A",
          card: "#1c1b1b",
          border: "#424754",
          muted: "#c2c6d6",
          accent: "#4d8eff",
        },
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
        "2xl": "48px",
        "3xl": "64px",
        gutter: "16px",
        "container-margin": "24px",
      },
      borderRadius: {
        stitch: "12px",
        "stitch-lg": "16px",
      },
      boxShadow: {
        "stitch-card": "0px 10px 30px rgba(0,0,0,0.5)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-geist)", "Geist", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-lg": [
          "48px",
          { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "600" },
        ],
        "headline-lg": [
          "32px",
          { lineHeight: "40px", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "500" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-mono": [
          "13px",
          { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" },
        ],
      },
    },
  },
  plugins: [],
};

export default config;
