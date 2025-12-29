import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--sf-color-primary)",
        secondary: "var(--sf-color-secondary)",
        accent: "var(--sf-color-accent)",
        background: "var(--sf-color-background)",
        surface: "var(--sf-color-surface)",
        border: "var(--sf-color-border)",
      },
      fontFamily: {
        heading: "var(--sf-font-heading)",
        body: "var(--sf-font-body)",
        code: "var(--sf-font-code)",
      },
    },
  },
  plugins: [],
};

export default config;
