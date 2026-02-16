export interface ThemeConfig {
  name: string;
  displayName: string;
  description?: string;
  variables: Record<string, string>;
}

export const defaultTheme: ThemeConfig = {
  name: "default",
  displayName: "Default",
  description: "Clean and modern theme",
  variables: {
    "--sf-color-primary": "#3b82f6",
    "--sf-color-secondary": "#64748b",
    "--sf-color-accent": "#f59e0b",
    "--sf-color-background": "#ffffff",
    "--sf-color-surface": "#f8fafc",
    "--sf-color-text": "#1e293b",
    "--sf-color-text-muted": "#64748b",
    "--sf-color-border": "#e2e8f0",
    "--sf-font-heading": "'Inter', system-ui, sans-serif",
    "--sf-font-body": "'Inter', system-ui, sans-serif",
    "--sf-font-code": "'Fira Code', 'Consolas', monospace",
  },
};

export const darkTheme: ThemeConfig = {
  name: "dark",
  displayName: "Dark",
  description: "Dark tech theme",
  variables: {
    "--sf-color-primary": "#00f2ff",
    "--sf-color-secondary": "#7000ff",
    "--sf-color-accent": "#f59e0b",
    "--sf-color-background": "#05080a",
    "--sf-color-surface": "rgba(255,255,255,0.03)",
    "--sf-color-text": "#f0f4f8",
    "--sf-color-text-muted": "#7f8c9d",
    "--sf-color-border": "rgba(255,255,255,0.1)",
    "--sf-font-heading": "'Inter', system-ui, sans-serif",
    "--sf-font-body": "'Inter', system-ui, sans-serif",
    "--sf-font-code": "'Fira Code', 'Consolas', monospace",
  },
};

export const corporateTheme: ThemeConfig = {
  name: "corporate",
  displayName: "Corporate",
  description: "Professional business theme",
  variables: {
    "--sf-color-primary": "#1e40af",
    "--sf-color-secondary": "#475569",
    "--sf-color-accent": "#dc2626",
    "--sf-color-background": "#ffffff",
    "--sf-color-surface": "#f1f5f9",
    "--sf-color-text": "#0f172a",
    "--sf-color-text-muted": "#64748b",
    "--sf-color-border": "#cbd5e1",
    "--sf-font-heading": "'Inter', system-ui, sans-serif",
    "--sf-font-body": "'Inter', system-ui, sans-serif",
    "--sf-font-code": "'Fira Code', 'Consolas', monospace",
  },
};

export const creativeTheme: ThemeConfig = {
  name: "creative",
  displayName: "Creative",
  description: "Colorful and vibrant theme for product launches",
  variables: {
    "--sf-color-primary": "#8b5cf6",
    "--sf-color-secondary": "#ec4899",
    "--sf-color-accent": "#f59e0b",
    "--sf-color-background": "#faf5ff",
    "--sf-color-surface": "#ffffff",
    "--sf-color-text": "#1e1b4b",
    "--sf-color-text-muted": "#6b7280",
    "--sf-color-border": "#e9d5ff",
    "--sf-font-heading": "'Poppins', 'Inter', system-ui, sans-serif",
    "--sf-font-body": "'Inter', system-ui, sans-serif",
    "--sf-font-code": "'Fira Code', 'Consolas', monospace",
  },
};

export const academicTheme: ThemeConfig = {
  name: "academic",
  displayName: "Academic",
  description: "Formal theme for academic presentations",
  variables: {
    "--sf-color-primary": "#1e40af",
    "--sf-color-secondary": "#374151",
    "--sf-color-accent": "#059669",
    "--sf-color-background": "#ffffff",
    "--sf-color-surface": "#f9fafb",
    "--sf-color-text": "#111827",
    "--sf-color-text-muted": "#6b7280",
    "--sf-color-border": "#d1d5db",
    "--sf-font-heading": "'Georgia', 'Times New Roman', serif",
    "--sf-font-body": "'Inter', system-ui, sans-serif",
    "--sf-font-code": "'Fira Code', 'Consolas', monospace",
  },
};

export const minimalTheme: ThemeConfig = {
  name: "minimal",
  displayName: "Minimal",
  description: "Clean minimalist theme with lots of whitespace",
  variables: {
    "--sf-color-primary": "#000000",
    "--sf-color-secondary": "#525252",
    "--sf-color-accent": "#000000",
    "--sf-color-background": "#ffffff",
    "--sf-color-surface": "#fafafa",
    "--sf-color-text": "#171717",
    "--sf-color-text-muted": "#a3a3a3",
    "--sf-color-border": "#e5e5e5",
    "--sf-font-heading": "'Inter', system-ui, sans-serif",
    "--sf-font-body": "'Inter', system-ui, sans-serif",
    "--sf-font-code": "'SF Mono', 'Fira Code', monospace",
  },
};

export const themes: Record<string, ThemeConfig> = {
  default: defaultTheme,
  dark: darkTheme,
  corporate: corporateTheme,
  creative: creativeTheme,
  academic: academicTheme,
  minimal: minimalTheme,
};

export function getTheme(name: string): ThemeConfig | undefined {
  return themes[name];
}

export function getThemeCSS(theme: ThemeConfig): string {
  const vars = Object.entries(theme.variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");
  return `:root {\n${vars}\n}`;
}

export function getAllThemes(): ThemeConfig[] {
  return Object.values(themes);
}
