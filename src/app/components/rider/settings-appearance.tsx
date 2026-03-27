 /**
 * Appearance Settings — Theme, display, map preferences.
 *
 * NORTHSTAR: Apple Display Settings + Linear appearance.
 * Live preview — theme changes reflect instantly.
 */

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Sun, Moon, Monitor, Map, Type, Contrast } from "lucide-react";
import { GLASS_COLORS, GLASS_TYPE, MOTION, type GlassColorMode } from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { RIDER_TYPE as RT } from "../../config/rider-type";
import type { ToastConfig } from "./jet-toast";

type ThemeOption = "dark" | "light" | "system";
type MapStyle = "default" | "satellite" | "minimal";

const THEME_OPTIONS: { key: ThemeOption; icon: typeof Sun; label: string }[] = [
  { key: "dark", icon: Moon, label: "Dark" },
  { key: "light", icon: Sun, label: "Light" },
  { key: "system", icon: Monitor, label: "System" },
];

const MAP_STYLES: { key: MapStyle; label: string; desc: string }[] = [
  { key: "default", label: "Default", desc: "Standard map with building outlines" },
  { key: "satellite", label: "Satellite", desc: "Aerial imagery with road overlay" },
  { key: "minimal", label: "Minimal", desc: "Simplified map, less visual noise" },
];

interface Props {
  colorMode: GlassColorMode;
  onBack: () => void;
  showToast: (config: ToastConfig) => void;
  onThemeChange?: (mode: GlassColorMode) => void;
}

export function AppearanceSettings({ colorMode, onBack, showToast, onThemeChange }: Props) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [theme, setTheme] = useState<ThemeOption>(colorMode);
  const [mapStyle, setMapStyle] = useState<MapStyle>("default");
  const [largeText, setLargeText] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleThemeChange = (opt: ThemeOption) => {
    setTheme(opt);
    const resolved = opt === "system" ? "dark" : opt;
    onThemeChange?.(resolved);
    showToast({ message: `Theme set to ${opt}`, variant: "success", duration: 1500 });
  };

  const handleMapChange = (style: MapStyle) => {
    setMapStyle(style);
    showToast({ message: `Map style: ${style}`, variant: "info", duration: 1500 });
  };

  return (
    <div className="h-full flex flex-col" style={{ background: c.bg }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-3">
        <motion.button
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: c.surface.subtle }}
          onClick={onBack}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowLeft className="w-4 h-4" style={{ color: c.icon.secondary }} />
        </motion.button>
        <span style={{ ...RT.body, fontWeight: 600, color: c.text.primary }}>
          Appearance
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-24 scrollbar-hide">
        {/* Theme selector */}
        <span className="block mt-4 mb-3" style={{ ...RT.label, color: c.text.faint }}>
          Theme
        </span>
        <div className="flex gap-2 mb-6">
          {THEME_OPTIONS.map((opt, i) => {
            const active = theme === opt.key;
            return (
              <motion.button
                key={opt.key}
                className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl"
                style={{
                  background: active
                    ? (d ? "rgba(29,185,84,0.1)" : "rgba(29,185,84,0.06)")
                    : c.surface.subtle,
                  border: `1.5px solid ${active ? BRAND_COLORS.green : "transparent"}`,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleThemeChange(opt.key)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * MOTION.stagger }}
              >
                <opt.icon
                  className="w-5 h-5"
                  style={{ color: active ? BRAND_COLORS.green : c.icon.muted }}
                />
                <span
                  style={{
                    ...RT.meta,
                    fontWeight: active ? 600 : 500,
                    color: active ? BRAND_COLORS.green : c.text.muted,
                  }}
                >
                  {opt.label}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Map style */}
        <span className="block mb-3" style={{ ...RT.label, color: c.text.faint }}>
          Map style
        </span>
        <div className="rounded-2xl overflow-hidden mb-6" style={{ background: c.surface.subtle }}>
          {MAP_STYLES.map((style, i) => {
            const active = mapStyle === style.key;
            return (
              <motion.button
                key={style.key}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                style={{
                  borderBottom: i < MAP_STYLES.length - 1
                    ? `1px solid ${c.surface.hover}`
                    : "none",
                  background: active ? (d ? "rgba(29,185,84,0.06)" : "rgba(29,185,84,0.03)") : "transparent",
                }}
                onClick={() => handleMapChange(style.key)}
                whileTap={{ scale: 0.98 }}
              >
                <Map
                  className="w-[18px] h-[18px] shrink-0"
                  style={{ color: active ? BRAND_COLORS.green : c.icon.muted }}
                />
                <div className="flex-1">
                  <span style={{ ...RT.bodySmall, color: c.text.primary }}>
                    {style.label}
                  </span>
                  <div style={{ ...RT.meta, color: c.text.muted }}>{style.desc}</div>
                </div>
                {active && (
                  <motion.div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: BRAND_COLORS.green }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Accessibility */}
        <span className="block mb-3" style={{ ...RT.label, color: c.text.faint }}>
          Accessibility
        </span>
        <div className="rounded-2xl overflow-hidden" style={{ background: c.surface.subtle }}>
          {/* Large text */}
          <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: `1px solid ${c.surface.hover}` }}>
            <Type className="w-[18px] h-[18px] shrink-0" style={{ color: largeText ? BRAND_COLORS.green : c.icon.muted }} />
            <div className="flex-1">
              <span style={{ ...RT.bodySmall, color: c.text.primary }}>Larger text</span>
              <div style={{ ...RT.meta, color: c.text.muted }}>Increase text size across the app</div>
            </div>
            <motion.button
              className="relative shrink-0"
              style={{
                width: 44, height: 26, borderRadius: 13,
                background: largeText ? BRAND_COLORS.green : (d ? "rgba(255,255,255,0.12)" : "rgba(11,11,13,0.1)"),
                transition: "background 0.2s ease",
              }}
              onClick={() => {
                setLargeText(!largeText);
                showToast({ message: `Large text ${!largeText ? "on" : "off"}`, variant: "info", duration: 1500 });
              }}
              whileTap={{ scale: 0.92 }}
            >
              <motion.div
                className="absolute top-[3px] rounded-full"
                style={{ width: 20, height: 20, background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
                animate={{ left: largeText ? 21 : 3 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>

          {/* Reduced motion */}
          <div className="flex items-center gap-3 px-4 py-4">
            <Contrast className="w-[18px] h-[18px] shrink-0" style={{ color: reducedMotion ? BRAND_COLORS.green : c.icon.muted }} />
            <div className="flex-1">
              <span style={{ ...RT.bodySmall, color: c.text.primary }}>Reduce motion</span>
              <div style={{ ...RT.meta, color: c.text.muted }}>Minimise animations and transitions</div>
            </div>
            <motion.button
              className="relative shrink-0"
              style={{
                width: 44, height: 26, borderRadius: 13,
                background: reducedMotion ? BRAND_COLORS.green : (d ? "rgba(255,255,255,0.12)" : "rgba(11,11,13,0.1)"),
                transition: "background 0.2s ease",
              }}
              onClick={() => {
                setReducedMotion(!reducedMotion);
                showToast({ message: `Reduced motion ${!reducedMotion ? "on" : "off"}`, variant: "info", duration: 1500 });
              }}
              whileTap={{ scale: 0.92 }}
            >
              <motion.div
                className="absolute top-[3px] rounded-full"
                style={{ width: 20, height: 20, background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
                animate={{ left: reducedMotion ? 21 : 3 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}