/**
 * DASHBOARD — EMPTY STATE
 * Empty dashboard with Setup Thread (persistent onboarding guide)
 * Three states: A (just arrived), B (pricing done), C (driver verified)
 */

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import {
  Activity, Users, DollarSign, TrendingUp, CheckCircle2,
  Circle, ArrowRight, Zap, Building2, Car, ChevronRight
} from "lucide-react";
import { AdminThemeProvider, useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { KPICard } from "../components/admin/ui/primitives";

type SetupState = "A" | "B" | "C";

function DashboardEmptyInner() {
  const navigate = useNavigate();
  const { t, theme } = useAdminTheme();
  const [searchParams] = useSearchParams();
  const state = (searchParams.get("state") || "A") as SetupState;

  const setupSteps = [
    {
      id: "zones",
      label: "Service zones",
      meta: "3 configured",
      completed: true,
    },
    {
      id: "pricing",
      label: "Pricing",
      meta: "confirmed",
      completed: state === "B" || state === "C",
      active: state === "A",
      action: state === "A" ? "Go" : undefined,
      route: "/settings-pricing",
    },
    {
      id: "drivers",
      label: "Drivers",
      meta: "4 registered · awaiting verification",
      completed: state === "C",
      active: state === "B",
      action: state === "B" ? "Review" : undefined,
      route: "/drivers-verification",
    },
    {
      id: "hotels",
      label: "Hotel partners",
      meta: "Optional — corporate bookings",
      completed: false,
      optional: true,
      action: "Add",
      route: "/hotels-empty",
    },
    {
      id: "fleet",
      label: "Fleet partners",
      meta: "Optional — grow driver supply",
      completed: false,
      optional: true,
      action: "Add",
      route: "/fleet-empty",
    },
  ];

  const completedCount = setupSteps.filter(s => s.completed).length;
  const totalCount = 5;

  const bottomNote = state === "C"
    ? "Your platform can accept rides. Hotels and fleet partners can be added anytime."
    : "Once a driver is verified, your platform is ready to take rides.";

  return (
    <div
      className="w-full h-screen flex overflow-hidden"
      style={{ background: t.bg }}
    >
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <div
          className="h-14 px-6 flex items-center shrink-0"
          style={{
            borderBottom: `1px solid ${t.borderSubtle}`,
          }}
        >
          <span
            style={{
              ...TY.h,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              letterSpacing: "-0.03em",
              color: t.text,
            }}
          >
            Command Center
          </span>
        </div>

        {/* Content scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* KPI strip — empty state */}
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
            <KPICard label="Active rides" value="—" icon={Activity} />
            <KPICard label="Online drivers" value="—" icon={Users} />
            <KPICard label="Today's revenue" value="—" icon={DollarSign} />
            <KPICard label="Avg wait time" value="—" icon={TrendingUp} />
          </div>

          {/* Map area */}
          <div
            className="h-80 rounded-2xl mb-6 overflow-hidden relative"
            style={{
              background: t.mapBg,
              border: `1px solid ${t.borderSubtle}`,
            }}
          >
            {/* Zone outlines — static, no activity */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <div
                className="w-48 h-64 rounded-3xl"
                style={{
                  border: `2px solid ${BRAND.green}`,
                  background: `${BRAND.green}05`,
                }}
              />
            </div>

            <div className="absolute bottom-4 right-4">
              <span
                style={{
                  ...TY.cap,
                  fontSize: "9px",
                  color: t.mapWatermark,
                }}
              >
                JET MAP · ZONES CONFIGURED
              </span>
            </div>
          </div>

          {/* Decisions panel */}
          <div
            className="p-5 rounded-2xl"
            style={{
              background: t.surface,
              border: `1px solid ${t.borderSubtle}`,
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
              DECISIONS
            </span>

            <div className="flex items-start gap-2">
              <div
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{ background: BRAND.green }}
              />
              <div>
                <span
                  className="block"
                  style={{
                    ...TY.body,
                    fontSize: "12px",
                    letterSpacing: "-0.02em",
                    color: t.textSecondary,
                  }}
                >
                  Platform is setting up
                </span>
                <span
                  style={{
                    ...TY.bodyR,
                    fontSize: "11px",
                    color: t.textMuted,
                  }}
                >
                  No issues to handle yet.
                </span>
              </div>
            </div>
          </div>

          {/* Bottom ticker */}
          <div
            className="mt-6 px-4 py-3 rounded-xl text-center"
            style={{
              background: t.surface,
              border: `1px solid ${t.borderSubtle}`,
            }}
          >
            <span
              style={{
                ...TY.bodyR,
                fontSize: "11px",
                color: t.textMuted,
              }}
            >
              Waiting for first activity...
            </span>
          </div>
        </div>
      </div>

      {/* Setup Thread — right panel */}
      <div
        className="w-96 flex flex-col overflow-hidden shrink-0"
        style={{
          borderLeft: `1px solid ${t.borderSubtle}`,
          background: t.bgSubtle,
        }}
      >
        {/* Header */}
        <div className="px-5 py-4 shrink-0" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          <div className="flex items-center justify-between mb-1">
            <span
              style={{
                ...TY.sub,
                fontSize: "13px",
                letterSpacing: "-0.02em",
                color: t.text,
              }}
            >
              GETTING STARTED
            </span>
            <span
              style={{
                ...TY.cap,
                fontSize: "10px",
                color: t.textMuted,
              }}
            >
              {completedCount} of {totalCount} complete
            </span>
          </div>
        </div>

        {/* Steps */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-4">
            {setupSteps.map((step, i) => {
              const Icon = step.completed
                ? CheckCircle2
                : step.active
                ? ArrowRight
                : Circle;

              return (
                <motion.div
                  key={step.id}
                  className="relative"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div className="flex items-start gap-3">
                    {step.completed ? (
                      <CheckCircle2
                        size={16}
                        className="shrink-0 mt-0.5"
                        style={{ color: BRAND.green }}
                      />
                    ) : step.active ? (
                      <ArrowRight
                        size={16}
                        className="shrink-0 mt-0.5"
                        style={{ color: BRAND.green }}
                      />
                    ) : (
                      <Circle
                        size={16}
                        className="shrink-0 mt-0.5"
                        style={{ color: t.iconMuted }}
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <span
                          style={{
                            ...TY.body,
                            fontSize: "13px",
                            letterSpacing: "-0.02em",
                            color: step.active
                              ? BRAND.green
                              : step.completed
                              ? t.textSecondary
                              : t.textTertiary,
                          }}
                        >
                          {step.label}
                        </span>

                        {step.action && step.route && (
                          <button
                            className="px-2.5 py-1 rounded-lg flex items-center gap-1 shrink-0 transition-opacity hover:opacity-80"
                            style={{
                              background: step.active ? t.greenBg : t.surface,
                              border: `1px solid ${step.active ? t.greenBorder : t.borderSubtle}`,
                            }}
                            onClick={() => navigate(step.route!)}
                          >
                            <span
                              style={{
                                ...TY.body,
                                fontSize: "10px",
                                letterSpacing: "-0.02em",
                                color: step.active ? BRAND.green : t.textMuted,
                              }}
                            >
                              {step.action}
                            </span>
                            <ChevronRight
                              size={10}
                              style={{ color: step.active ? BRAND.green : t.textMuted }}
                            />
                          </button>
                        )}
                      </div>

                      {step.meta && (
                        <span
                          className="block"
                          style={{
                            ...TY.bodyR,
                            fontSize: "11px",
                            color: t.textMuted,
                          }}
                        >
                          {step.meta}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom note */}
          <div
            className="mt-6 pt-4"
            style={{
              borderTop: `1px solid ${t.borderSubtle}`,
            }}
          >
            <p
              style={{
                ...TY.bodyR,
                fontSize: "11px",
                color: t.textMuted,
                lineHeight: 1.5,
              }}
            >
              {bottomNote}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardEmpty() {
  return (
    <AdminThemeProvider>
      <DashboardEmptyInner />
    </AdminThemeProvider>
  );
}
