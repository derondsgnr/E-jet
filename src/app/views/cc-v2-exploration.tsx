/**
 * CC V2 EXPLORATION
 * Route: /briefing/cc-v2
 *
 * Contains both FIX 1 (Onboarding) and FIX 2 (Active CC) as toggleable explorations.
 * Does NOT touch existing components. Standalone exploration path.
 *
 * Spec source: /src/app/docs/collab.md
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Sun, Moon, Layers, Rocket } from "lucide-react";
import { AdminThemeProvider, useAdminTheme, TY, BRAND } from "../config/admin-theme";
import { CCv2Onboarding } from "../components/admin/cc-v2-onboarding";
import { CCv2Active } from "../components/admin/cc-v2-active";

type View = "onboarding" | "active";

function ExplorationContent() {
  const { t, theme, toggle } = useAdminTheme();
  const isDark = theme === "dark";
  const [view, setView] = useState<View>("active");

  const views: { id: View; label: string; icon: typeof Layers; desc: string }[] = [
    { id: "onboarding", label: "FIX 1 · Setup", icon: Rocket, desc: "Unified onboarding" },
    { id: "active", label: "FIX 2 · Active CC", icon: Layers, desc: "KPI strip + Decisions" },
  ];

  return (
    <div className="h-screen flex flex-col" style={{ background: t.bg }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-5 h-12 shrink-0"
        style={{
          background: t.overlay,
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full" style={{ background: BRAND.green }} />
          <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>
            CC Exploration
          </span>
          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>
            collab.md fixes
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div
            className="flex items-center gap-0.5 p-0.5 rounded-lg"
            style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)",
            }}
          >
            {views.map((v) => (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all"
                style={{
                  background:
                    view === v.id
                      ? isDark
                        ? "rgba(255,255,255,0.06)"
                        : "#FFFFFF"
                      : "transparent",
                  boxShadow: view === v.id ? t.shadow : "none",
                }}
              >
                <v.icon
                  size={10}
                  style={{
                    color: view === v.id ? BRAND.green : t.textMuted,
                  }}
                />
                <span
                  style={{
                    ...TY.body,
                    fontSize: "10px",
                    color: view === v.id ? t.text : t.textMuted,
                  }}
                >
                  {v.label}
                </span>
              </button>
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.04)"
                : "rgba(0,0,0,0.03)",
            }}
          >
            {isDark ? (
              <Sun size={13} style={{ color: t.icon }} />
            ) : (
              <Moon size={13} style={{ color: t.icon }} />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {view === "onboarding" ? <CCv2Onboarding /> : <CCv2Active />}
      </div>
    </div>
  );
}

export function CCv2Exploration() {
  return (
    <AdminThemeProvider>
      <ExplorationContent />
    </AdminThemeProvider>
  );
}
