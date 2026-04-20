import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "2px",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // ─── Sablia palette v2 — "Sable & Terre cuite" (sablia-io port) ───
        sable: {
          DEFAULT: "#F4EEDF",
          "50": "#FBF8F2",
          "100": "#F4EEDF",
          "200": "#E9E0CB",
          "300": "#D5C8A8",
          "400": "#B7A780",
        },
        encre: {
          DEFAULT: "#1A1613",
          "30": "#9C948B",
          "50": "#6F665F",
          "70": "#4C4540",
          "90": "#2A2420",
        },
        tuile: {
          DEFAULT: "#B84A1E",
          dark: "#953A14",
          soft: "#D97A4F",
        },
        foret: "#3B4A3A",
        ocre: "#C9A461",
        // ─── Shim layer — legacy sablia-* tokens remapped to new palette ───
        // Active Phases 2-4 so LPs, /tarifs, /gap, legal pages keep compiling.
        // Removed Phase 5 after manual propagation (see plan §risks).
        "sablia-bg": "#F4EEDF",
        "sablia-surface": "#FBF8F2",
        "sablia-text": "#1A1613",
        "sablia-text-secondary": "#4C4540",
        "sablia-text-tertiary": "#9C948B",
        "sablia-accent": "#B84A1E",
        "sablia-accent-hover": "#953A14",
        "sablia-sienna": "#B84A1E",
        "sablia-alba": "#C9A461",
        "sablia-border": "rgba(26, 22, 19, 0.12)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.9s cubic-bezier(0.22, 0.61, 0.36, 1) forwards",
      },
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        display: ["Fraunces Variable", "EB Garamond", "Georgia", "serif"],
        mono: ["JetBrains Mono", "SF Mono", "monospace"],
        "legacy-sans": ["Inter Tight", "Inter", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      },
      boxShadow: {
        "warm-sm": "0 1px 3px rgba(26, 46, 78, 0.05), 0 1px 2px rgba(139, 115, 80, 0.04)",
        warm: "0 4px 12px rgba(26, 46, 78, 0.06), 0 2px 4px rgba(139, 115, 80, 0.04)",
        "warm-lg": "0 12px 32px rgba(26, 46, 78, 0.08), 0 4px 8px rgba(139, 115, 80, 0.04)",
        paper: "0 1px 0 rgba(26, 22, 19, 0.04), 0 2px 8px -4px rgba(26, 22, 19, 0.08)",
        elev: "0 2px 1px rgba(26, 22, 19, 0.03), 0 10px 30px -12px rgba(26, 22, 19, 0.18)",
      },
      maxWidth: {
        editorial: "1280px",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/container-queries")],
} satisfies Config;
