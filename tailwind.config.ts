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
        // Surfaces
        surface: {
          DEFAULT: "#FFFFFF",
          secondary: "#F8F9FC",
        },
        // Ink (text)
        ink: {
          DEFAULT: "#1A1F36",
          primary: "#1A1F36",
          secondary: "#6B7294",
        },
        // Borders
        line: {
          DEFAULT: "#E8ECF2",
          strong: "#D5DBE6",
        },
        // Status
        success: "#10B981",
        danger: "#EF4444",
      },
      fontFamily: {
        sans: ["var(--font-assistant)", "system-ui", "sans-serif"],
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
