/**
 * ONBOARDING — ZONES
 * Zone configuration with map + pre-suggested zones
 */

import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Plus, X, Pencil, ArrowRight } from "lucide-react";
import { AdminThemeProvider, useAdminTheme, BRAND, TY } from "../config/admin-theme";

const PRE_SUGGESTED_ZONES = [
  "Lagos Island",
  "Lekki",
  "Victoria Island",
  "Ikeja",
  "Abuja Central",
  "Port Harcourt",
];

interface Zone {
  id: string;
  name: string;
}

function ZonesInner() {
  const navigate = useNavigate();
  const { t, theme } = useAdminTheme();
  const [zones, setZones] = useState<Zone[]>([]);

  const addZone = (name: string) => {
    if (zones.find(z => z.name === name)) return;
    setZones([...zones, { id: Math.random().toString(), name }]);
  };

  const removeZone = (id: string) => {
    setZones(zones.filter(z => z.id !== id));
  };

  const canContinue = zones.length > 0;

  return (
    <div
      className="w-full h-screen flex flex-col"
      style={{ background: t.bg }}
    >
      {/* Top header */}
      <div
        className="h-14 px-6 flex items-center shrink-0"
        style={{
          borderBottom: `1px solid ${t.borderSubtle}`,
        }}
      >
        <span
          style={{
            ...TY.bodyR,
            fontSize: "11px",
            letterSpacing: "-0.02em",
            color: t.textMuted,
          }}
        >
          Setup · Step 1 of 1
        </span>
      </div>

      {/* Main content — two columns */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left column — map + chips */}
        <div className="flex-1 flex flex-col p-6 overflow-y-auto">
          {/* Pre-suggested zone chips */}
          <div className="mb-4 flex flex-wrap gap-2">
            {PRE_SUGGESTED_ZONES.map(name => {
              const added = zones.find(z => z.name === name);
              return (
                <button
                  key={name}
                  className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                  style={{
                    background: added ? t.greenBg : t.surface,
                    border: `1px solid ${added ? t.greenBorder : t.borderSubtle}`,
                  }}
                  onClick={() => !added && addZone(name)}
                >
                  <Plus size={12} style={{ color: added ? BRAND.green : t.iconMuted }} />
                  <span
                    style={{
                      ...TY.body,
                      fontSize: "11px",
                      letterSpacing: "-0.02em",
                      color: added ? BRAND.green : t.textSecondary,
                    }}
                  >
                    {name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Map placeholder */}
          <div
            className="flex-1 rounded-2xl overflow-hidden relative"
            style={{
              background: t.mapBg,
              border: `1px solid ${t.borderSubtle}`,
              minHeight: 400,
            }}
          >
            {/* Simple Nigeria outline visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-64 h-80 rounded-3xl opacity-20"
                style={{
                  border: `2px solid ${t.mapOutline}`,
                  background: t.mapOutlineFill,
                }}
              />
            </div>

            {/* Zone overlays — green outlines for added zones */}
            {zones.map((zone, i) => (
              <motion.div
                key={zone.id}
                className="absolute rounded-2xl"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${25 + i * 10}%`,
                  width: 120,
                  height: 80,
                  border: `2px solid ${BRAND.green}`,
                  background: `${BRAND.green}08`,
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
            ))}

            {/* Watermark */}
            <div className="absolute bottom-4 right-4">
              <span
                style={{
                  ...TY.cap,
                  fontSize: "9px",
                  color: t.mapWatermark,
                }}
              >
                JET MAP
              </span>
            </div>
          </div>

          <button
            className="mt-4 h-10 px-4 rounded-xl flex items-center gap-2"
            style={{
              background: t.surface,
              border: `1px solid ${t.borderSubtle}`,
            }}
          >
            <Plus size={14} style={{ color: t.iconSecondary }} />
            <span
              style={{
                ...TY.body,
                fontSize: "12px",
                letterSpacing: "-0.02em",
                color: t.textTertiary,
              }}
            >
              Draw zone
            </span>
          </button>
        </div>

        {/* Right column — configured zones */}
        <div
          className="w-96 p-6 flex flex-col overflow-hidden"
          style={{
            borderLeft: `1px solid ${t.borderSubtle}`,
          }}
        >
          <span
            className="block mb-3"
            style={{
              ...TY.label,
              fontSize: "9px",
              letterSpacing: "0.04em",
              color: t.textFaint,
            }}
          >
            CONFIGURED ZONES
          </span>

          <div
            className="mb-4"
            style={{
              height: 1,
              background: t.borderSubtle,
            }}
          />

          {/* Empty state */}
          {zones.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-center px-6">
              <p
                style={{
                  ...TY.bodyR,
                  fontSize: "12px",
                  color: t.textMuted,
                  lineHeight: 1.5,
                }}
              >
                Click a suggested zone or draw your own on the map
              </p>
            </div>
          )}

          {/* Zone list */}
          {zones.length > 0 && (
            <div className="flex-1 overflow-y-auto space-y-2">
              {zones.map((zone, i) => (
                <motion.div
                  key={zone.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{
                    background: t.surface,
                    border: `1px solid ${t.borderSubtle}`,
                  }}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ background: BRAND.green }}
                  />
                  <span
                    className="flex-1"
                    style={{
                      ...TY.body,
                      fontSize: "12px",
                      letterSpacing: "-0.02em",
                      color: t.text,
                    }}
                  >
                    {zone.name}
                  </span>
                  <button
                    className="p-1 rounded hover:bg-opacity-80"
                    style={{ background: t.surfaceHover }}
                  >
                    <Pencil size={12} style={{ color: t.iconMuted }} />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-opacity-80"
                    onClick={() => removeZone(zone.id)}
                    style={{ background: t.surfaceHover }}
                  >
                    <X size={12} style={{ color: t.iconMuted }} />
                  </button>
                </motion.div>
              ))}

              <button
                className="w-full h-10 px-3 rounded-xl flex items-center gap-2 mt-3"
                style={{
                  border: `1px dashed ${t.borderSubtle}`,
                }}
              >
                <Plus size={14} style={{ color: t.iconMuted }} />
                <span
                  style={{
                    ...TY.body,
                    fontSize: "11px",
                    letterSpacing: "-0.02em",
                    color: t.textMuted,
                  }}
                >
                  Add another zone
                </span>
              </button>

              {zones.length > 10 && (
                <p
                  className="mt-3"
                  style={{
                    ...TY.bodyR,
                    fontSize: "10px",
                    color: t.textFaint,
                  }}
                >
                  You can add more zones after launch from Settings.
                </p>
              )}
            </div>
          )}

          {/* Bottom actions */}
          <div className="mt-6 pt-4 shrink-0" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
            <div className="flex items-center justify-between mb-3">
              <span
                style={{
                  ...TY.bodyR,
                  fontSize: "11px",
                  color: t.textMuted,
                }}
              >
                Zones added: {zones.length}
              </span>
            </div>

            <button
              className="w-full h-12 px-4 rounded-xl flex items-center justify-center gap-2 transition-opacity"
              style={{
                background: canContinue ? BRAND.green : t.surface,
                border: `1px solid ${canContinue ? BRAND.green : t.borderSubtle}`,
                opacity: canContinue ? 1 : 0.5,
                cursor: canContinue ? "pointer" : "not-allowed",
                minHeight: 44,
              }}
              onClick={() => canContinue && navigate("/dashboard-empty")}
              title={!canContinue ? "Add at least one zone to continue" : ""}
            >
              <span
                style={{
                  ...TY.body,
                  fontSize: "13px",
                  letterSpacing: "-0.02em",
                  color: canContinue ? "#FFFFFF" : t.textMuted,
                }}
              >
                Continue to dashboard
              </span>
              <ArrowRight size={14} style={{ color: canContinue ? "#FFFFFF" : t.textMuted }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminOnboardingZones() {
  return (
    <AdminThemeProvider>
      <ZonesInner />
    </AdminThemeProvider>
  );
}
