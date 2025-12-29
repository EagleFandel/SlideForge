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

export const themes: Record<string, ThemeConfig> = {
  default: defaultTheme,
  dark: darkTheme,
  corporate: corporateTheme,
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
