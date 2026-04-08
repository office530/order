import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Royal blue — primary CTAs, selected borders, links
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          400: "#60A5FA",
          500: "#2563EB",
          600: "#1D4ED8",
          700: "#1E40AF",
        },
        // Gold — premium accents, badges, savings
        gold: {
          400: "#DFC48F",
          500: "#C8A96E",
          600: "#B8944E",
        },
        // Warm off-white "paper" + cool surface
        paper: "#FAF9F6",
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F4F2EC",
        },
        // Ink (text) — slightly warmer than the previous near-black
        ink: {
          DEFAULT: "#1A1A1F",
          primary: "#1A1A1F",
          secondary: "#6B6B73",
        },
        // Borders — a touch warmer to harmonize with paper
        line: {
          DEFAULT: "#E5E2D9",
          strong: "#D2CEC2",
        },
        // Status
        success: "#10B981",
        danger: "#B91C1C",
      },
      fontFamily: {
        sans: ["var(--font-assistant)", "system-ui", "sans-serif"],
        // Renamed from "display" → "serif" to avoid collision with Tailwind's
        // built-in `font-display` utility (which maps to the CSS font-display
        // property used in @font-face). Apply with `font-serif`.
        serif: [
          "var(--font-display)",
          "Frank Ruhl Libre",
          "Georgia",
          "serif",
        ],
      },
      fontSize: {
        "display-sm": [
          "2.25rem",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "800" },
        ],
        display: [
          "3rem",
          { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "800" },
        ],
        "display-lg": [
          "3.5rem",
          { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "800" },
        ],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(26, 31, 54, 0.04), 0 2px 8px rgba(26, 31, 54, 0.04)",
        card: "0 2px 12px rgba(26, 31, 54, 0.06)",
        sticky: "0 -4px 12px rgba(26, 31, 54, 0.05)",
        "ring-blue": "0 0 0 4px rgba(37, 99, 235, 0.12)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "fade-up": "fadeUp 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
