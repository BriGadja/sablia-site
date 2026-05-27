import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        pill: "9999px",
      },
      colors: {
        // ─── shadcn/ui HSL tokens (preserved — Toaster, Card, not-found) ───
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
        "shadcn-primary": {
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
        // ─── New design system tokens (space-separated RGB for alpha support) ───
        canvas: {
          DEFAULT: "rgb(var(--color-canvas) / <alpha-value>)",
          soft: "rgb(var(--color-canvas-soft) / <alpha-value>)",
        },
        "surface-card": {
          DEFAULT: "rgb(var(--color-surface-card) / <alpha-value>)",
          elevated: "rgb(var(--color-surface-card-elevated) / <alpha-value>)",
        },
        "surface-light": {
          DEFAULT: "rgb(var(--color-surface-light) / <alpha-value>)",
          card: "rgb(var(--color-surface-light-card) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "rgb(var(--color-primary) / <alpha-value>)",
          active: "rgb(var(--color-primary-active) / <alpha-value>)",
          disabled: "rgb(var(--color-primary-disabled) / <alpha-value>)",
        },
        "accent-teal": "rgb(var(--color-accent-teal) / <alpha-value>)",
        "accent-amber": "rgb(var(--color-accent-amber) / <alpha-value>)",
        hairline: {
          DEFAULT: "rgb(var(--color-hairline) / <alpha-value>)",
          light: "rgb(var(--color-hairline-light) / <alpha-value>)",
        },
        "on-dark": {
          DEFAULT: "rgb(var(--color-on-dark) / <alpha-value>)",
          strong: "rgb(var(--color-on-dark-strong) / <alpha-value>)",
          body: "rgb(var(--color-on-dark-body) / <alpha-value>)",
          muted: "rgb(var(--color-on-dark-muted) / <alpha-value>)",
          soft: "rgb(var(--color-on-dark-soft) / <alpha-value>)",
        },
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        body: "rgb(var(--color-body) / <alpha-value>)",
        "muted-text": "rgb(var(--color-muted-text) / <alpha-value>)",
        "on-primary": "rgb(var(--color-on-primary) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.9s cubic-bezier(0.2, 0, 0, 1) forwards",
      },
      fontFamily: {
        display: ["'Cormorant Garamond Variable'", "Garamond", "'Times New Roman'", "serif"],
        sans: ["'Inter Variable'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        mono: ["'JetBrains Mono Variable'", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      spacing: {
        section: "96px",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.2, 0, 0, 1)",
      },
      boxShadow: {
        "glow-coral": "0 0 20px rgba(204, 120, 92, 0.2)",
        "ring-coral": "0 0 0 3px rgba(204, 120, 92, 0.18)",
      },
      maxWidth: {
        editorial: "1200px",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
