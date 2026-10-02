/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        panelStrong: "rgb(var(--color-panel-strong) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        accent: "#2563eb",
        cobalt: "#2563eb",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#fb7185",
      },
      boxShadow: {
        panel: "var(--shadow-panel)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
