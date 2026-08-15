import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#090A0F",
          subtle: "#0D0F17",
          elevated: "#12131A",
          surface: "#181A24",
          card: "#1A1C26",
          hover: "#222533",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.06)",
          light: "rgba(255, 255, 255, 0.12)",
          focus: "rgba(255, 255, 255, 0.24)",
        },
        merit: {
          emerald: "#10B981",
          emeraldDark: "#064E3B",
          cyan: "#06B6D4",
          cyanDark: "#164E63",
          amber: "#F59E0B",
          amberDark: "#78350F",
          purple: "#8B5CF6",
          rose: "#F43F5E",
          mono: "#E2E8F0",
          muted: "#94A3B8",
          dim: "#475569",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Geist Mono", "Fira Code", "monospace"],
      },
      boxShadow: {
        tactile: "0 1px 2px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        glowVerified: "0 0 25px -5px rgba(16, 185, 129, 0.3)",
        glowCyan: "0 0 25px -5px rgba(6, 182, 212, 0.3)",
        modal: "0 20px 50px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "flow-dash": "flowDash 20s linear infinite",
        "scan-line": "scanline 3s ease-in-out infinite",
      },
      keyframes: {
        flowDash: {
          to: { strokeDashoffset: "-100" },
        },
        scanline: {
          "0%, 100%": { transform: "translateY(0%)" },
          "50%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
