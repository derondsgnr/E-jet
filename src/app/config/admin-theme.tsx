/**
 * JET ADMIN — DESIGN SYSTEM TOKENS & THEME
 *
 * Semantic token system for the admin dashboard.
 * Supports light + dark mode with distinct visual identities:
 *   Dark  → atmospheric, glass, ambient glows (mission control)
 *   Light → clean, spatial, micro-shadows (briefing room)
 *
 * Inspired by: Linear (density), Apple (spatial clarity),
 * Vercel (monochrome confidence), Airbnb (trust through transparency)
 */

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

// ─── Brand constants (never change with theme) ──────────────────────────────
export const BRAND = {
  green: "#1DB954",
  greenDark: "#046538",
  black: "#0B0B0D",
  white: "#FFFFFF",
  light: "#F5F5F5",
} as const;

export const STATUS = {
  success: "#1DB954",
  warning: "#F59E0B",
  error: "#D4183D",
  info: "#3B82F6",
} as const;

// ─── Theme type ─────────────────────────────────────────────────────────────
export type AdminTheme = "dark" | "light";

// ─── Semantic token sets ────────────────────────────────────────────────────
export interface ThemeTokens {
  // Surfaces
  bg: string;
  bgSubtle: string;
  surface: string;
  surfaceRaised: string;
  surfaceHover: string;
  surfaceActive: string;
  overlay: string;
  // Borders
  border: string;
  borderSubtle: string;
  borderStrong: string;
  // Text
  text: string;
  textSecondary: string;
  textTertiary: string;
  textMuted: string;
  textFaint: string;
  textGhost: string;
  // Icons
  icon: string;
  iconSecondary: string;
  iconMuted: string;
  // Accents
  green: string;
  greenBg: string;
  greenBorder: string;
  greenText: string;
  // Status
  errorBg: string;
  errorBorder: string;
  errorText: string;
  warningBg: string;
  warningBorder: string;
  warningText: string;
  infoBg: string;
  infoBorder: string;
  infoText: string;
  // Map
  mapBg: string;
  mapGrid: string;
  mapGlow1: string;
  mapGlow2: string;
  mapOutline: string;
  mapOutlineFill: string;
  mapWatermark: string;
  mapLabel: string;
  mapRoute: string;
  mapWater: string;
  // Special
  glass: string;
  glassBlur: string;
  shadow: string;
  shadowLg: string;
  noise: string;
}

const darkTokens: ThemeTokens = {
  bg: "#08080A",
  bgSubtle: "#0B0B0D",
  surface: "rgba(255,255,255,0.03)",
  surfaceRaised: "rgba(255,255,255,0.05)",
  surfaceHover: "rgba(255,255,255,0.06)",
  surfaceActive: "rgba(255,255,255,0.08)",
  overlay: "rgba(12,12,14,0.95)",
  border: "rgba(255,255,255,0.06)",
  borderSubtle: "rgba(255,255,255,0.04)",
  borderStrong: "rgba(255,255,255,0.1)",
  text: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.78)",
  textTertiary: "rgba(255,255,255,0.58)",
  textMuted: "rgba(255,255,255,0.45)",
  textFaint: "rgba(255,255,255,0.35)",
  textGhost: "rgba(255,255,255,0.22)",
  icon: "rgba(255,255,255,0.65)",
  iconSecondary: "rgba(255,255,255,0.45)",
  iconMuted: "rgba(255,255,255,0.3)",
  green: BRAND.green,
  greenBg: "rgba(29,185,84,0.1)",
  greenBorder: "rgba(29,185,84,0.18)",
  greenText: BRAND.green,
  errorBg: "rgba(212,24,61,0.08)",
  errorBorder: "rgba(212,24,61,0.15)",
  errorText: "#D4183D",
  warningBg: "rgba(245,158,11,0.08)",
  warningBorder: "rgba(245,158,11,0.15)",
  warningText: "#F59E0B",
  infoBg: "rgba(59,130,246,0.08)",
  infoBorder: "rgba(59,130,246,0.15)",
  infoText: "#3B82F6",
  mapBg: "#08080A",
  mapGrid: "rgba(255,255,255,0.02)",
  mapGlow1: `${BRAND.green}06`,
  mapGlow2: "rgba(59,130,246,0.03)",
  mapOutline: "rgba(255,255,255,0.04)",
  mapOutlineFill: "rgba(255,255,255,0.012)",
  mapWatermark: "rgba(255,255,255,0.04)",
  mapLabel: "rgba(255,255,255,0.025)",
  mapRoute: "rgba(255,255,255,0.06)",
  mapWater: "rgba(59,130,246,0.04)",
  glass: "rgba(12,12,14,0.72)",
  glassBlur: "blur(20px)",
  shadow: "0 2px 8px rgba(0,0,0,0.3)",
  shadowLg: "0 8px 32px rgba(0,0,0,0.4)",
  noise: "3%",
};

const lightTokens: ThemeTokens = {
  bg: "#F7F8FA",
  bgSubtle: "#FFFFFF",
  surface: "rgba(0,0,0,0.025)",
  surfaceRaised: "#FFFFFF",
  surfaceHover: "rgba(0,0,0,0.04)",
  surfaceActive: "rgba(0,0,0,0.06)",
  overlay: "rgba(255,255,255,0.97)",
  border: "rgba(0,0,0,0.08)",
  borderSubtle: "rgba(0,0,0,0.05)",
  borderStrong: "rgba(0,0,0,0.12)",
  text: "#0B0B0D",
  textSecondary: "rgba(11,11,13,0.7)",
  textTertiary: "rgba(11,11,13,0.5)",
  textMuted: "rgba(11,11,13,0.35)",
  textFaint: "rgba(11,11,13,0.25)",
  textGhost: "rgba(11,11,13,0.12)",
  icon: "rgba(11,11,13,0.55)",
  iconSecondary: "rgba(11,11,13,0.35)",
  iconMuted: "rgba(11,11,13,0.2)",
  green: BRAND.green,
  greenBg: "rgba(29,185,84,0.06)",
  greenBorder: "rgba(29,185,84,0.15)",
  greenText: "#0D9942",
  errorBg: "rgba(212,24,61,0.05)",
  errorBorder: "rgba(212,24,61,0.12)",
  errorText: "#C41235",
  warningBg: "rgba(245,158,11,0.06)",
  warningBorder: "rgba(245,158,11,0.12)",
  warningText: "#B97A0A",
  infoBg: "rgba(59,130,246,0.05)",
  infoBorder: "rgba(59,130,246,0.12)",
  infoText: "#2563EB",
  mapBg: "#EEF0F4",
  mapGrid: "rgba(0,0,0,0.03)",
  mapGlow1: "rgba(29,185,84,0.04)",
  mapGlow2: "rgba(59,130,246,0.03)",
  mapOutline: "rgba(0,0,0,0.06)",
  mapOutlineFill: "rgba(0,0,0,0.02)",
  mapWatermark: "rgba(0,0,0,0.04)",
  mapLabel: "rgba(0,0,0,0.06)",
  mapRoute: "rgba(0,0,0,0.06)",
  mapWater: "rgba(59,130,246,0.06)",
  glass: "rgba(255,255,255,0.85)",
  glassBlur: "blur(20px)",
  shadow: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
  shadowLg: "0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
  noise: "0%",
};

export function getTokens(theme: AdminTheme): ThemeTokens {
  return theme === "dark" ? darkTokens : lightTokens;
}

// ─── Typography system ──────────────────────────────────────────────────────
export const TY = {
  h: { fontFamily: "var(--font-heading)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: "1.2" } as React.CSSProperties,
  sub: { fontFamily: "var(--font-heading)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: "1.3" } as React.CSSProperties,
  body: { fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: "1.4" } as React.CSSProperties,
  bodyR: { fontFamily: "var(--font-body)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: "1.5" } as React.CSSProperties,
  cap: { fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: "1.4" } as React.CSSProperties,
  label: { fontFamily: "var(--font-body)", fontWeight: 500, letterSpacing: "0.06em", lineHeight: "1.4", textTransform: "uppercase" } as React.CSSProperties,
};

// ─── Theme context ──────────────────────────────────────────────────────────
interface ThemeCtx {
  theme: AdminTheme;
  t: ThemeTokens;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeCtx>({
  theme: "dark",
  t: darkTokens,
  toggle: () => {},
});

export function useAdminTheme() {
  return useContext(ThemeContext);
}

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<AdminTheme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("jet-admin-theme") as AdminTheme) || "dark";
    }
    return "dark";
  });

  useEffect(() => {
    localStorage.setItem("jet-admin-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme(prev => prev === "dark" ? "light" : "dark");
  }, []);

  const t = getTokens(theme);

  return (
    <ThemeContext.Provider value={{ theme, t, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Color helpers ──────────────────────────────────────────────────────────
export function demandColor(level: string, theme: AdminTheme): string {
  switch (level) {
    case "surge": return STATUS.warning;
    case "high": return BRAND.green;
    case "normal": return theme === "dark" ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.25)";
    case "low": return theme === "dark" ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)";
    default: return theme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  }
}

export function stateStatusColor(status: string): string {
  switch (status) {
    case "live": return BRAND.green;
    case "launching": return STATUS.warning;
    default: return "#737373";
  }
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case "critical": return STATUS.error;
    case "high": return STATUS.warning;
    case "medium": return STATUS.info;
    default: return "#737373";
  }
}