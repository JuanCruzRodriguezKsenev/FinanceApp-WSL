export const THEME_MODES = ["light", "dark"] as const;
export const THEME_COLORS = ["blue", "emerald", "purple", "orange"] as const;

export type ThemeMode = typeof THEME_MODES[number];
export type ThemeColor = typeof THEME_COLORS[number];

export interface ThemePreference {
  mode: ThemeMode;
  color: ThemeColor;
}

export const DEFAULT_THEME: ThemePreference = {
  mode: "light",
  color: "blue",
};
