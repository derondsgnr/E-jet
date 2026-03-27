/**
 * CC V2 WIRING PLAN
 * Route: /briefing/cc-v2/plan
 *
 * Visual before/after map for FIX 1 + FIX 2 approval.
 * What changes, what stays, what wires where.
 */

import { useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight, Check, Layers, Rocket,
  FileCode2, Replace, Plug, ShieldCheck,
} from "lucide-react";

const GREEN = "#1DB954";
const DARK = "#0B0B0D";

interface WiringItem {
  file: string;
  before: string;
  after: string;
  action: "replace" | "wire" | "delete" | "keep";
}

const FIX1_WIRING: WiringItem[] = [
  {
    file: "command-center-onboarding.tsx",
    before: "3 variations (A/B/C) with Design Lab toggle",
    after: "Removed — replaced by cc-v2-onboarding.tsx",
    action: "replace",
  },
  {
    file: "cc-v2-onboarding.tsx",
    before: "Standalone at /briefing/cc-v2",
    after: "Wired into command-center-composite.tsx as the onboarding flow",
    action: "wire",
  },
  {
    file: "command-center-composite.tsx",
    before: "Imports CommandCenterOnboarding with A/B/C picker",
    after: "Imports CCv2Onboarding — single unified flow, no variation toggle",
    action: "wire",
  },
];

const FIX2_WIRING: WiringItem[] = [
  {
    file: "command-center-composite.tsx → KPI section",
    before: "Inline KPI cards with mixed layout",
    after: "5-group KPI strip from cc-v2-active.tsx with health borders + click-to-scroll",
    action: "replace",
  },
  {
    file: "command-center-composite.tsx → Decision panel",
    before: "Single action queue list",
    after: 'Split panel: "Handle Now" (red) + "Handle Today" (amber/blue) with verb buttons',
    action: "replace",
  },
  {
    file: "cc-v2-active.tsx",
    before: "Standalone at /briefing/cc-v2",
    after: "Components extracted into command-center-composite.tsx",
    action: "wire",
  },
  {
    file: "Nav rail, map, ticker, breadcrumbs, zone bubbles",
    before: "Existing implementation",
    after: "Untouched — no changes",
    action: "keep",
  },
];

const VALIDATION_CHECKS = [
  "KPI strip renders same data sources (HEALTH_METRICS, ACTION_QUEUE)",
  "Decision panel uses same ACTION_QUEUE — no new mock data needed",
  "Onboarding completion still triggers transition to active CC",
  "Theme provider (AdminThemeProvider) already shared — no migration",
  "Nav rail, map canvas, live feed, zone bubbles — zero drift",
  "All existing /admin/* child routes unaffected",
];

function ActionBadge({ action }: { action: WiringItem["action"] }) {
  const config = {
    replace: { label: "REPLACE", bg: "#DC262620", color: "#DC2626" },
    wire: { label: "WIRE IN", bg: `${GREEN}18`, color: GREEN },
    delete: { label: "DELETE", bg: "#DC262620", color: "#DC2626" },
    keep: { label: "NO CHANGE", bg: "#73737318", color: "#737373" },
  }[action];

  return (
    <span
      className="px-2 py-0.5 rounded-md inline-flex items-center gap-1"
      style={{
        fontFamily: "Manrope, sans-serif",
        fontSize: "9px",
        fontWeight: 600,
        letterSpacing: "0.05em",
        color: config.color,
        background: config.bg,
      }}
    >
      {action === "replace" && <Replace size={8} />}
      {action === "wire" && <Plug size={8} />}
      {action === "keep" && <ShieldCheck size={8} />}
      {config.label}
    </span>
  );
}

export function CCv2WiringPlan() {
  const [approved, setApproved] = useState<{ fix1: boolean; fix2: boolean }>({
    fix1: false,
    fix2: false,
  });

  return (
    <div
      className="min-h-screen py-12 px-6"
      style={{
        background: "#09090B",
        fontFamily: "Manrope, sans-serif",
      }}
    >
      <div className="max-w-[720px] mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: GREEN }}
            />
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: "11px",
                letterSpacing: "0.08em",
                color: GREEN,
              }}
            >
              WIRING PLAN
            </span>
          </div>
          <h1
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: "24px",
              letterSpacing: "-0.03em",
              color: "#FAFAFA",
              lineHeight: 1.3,
            }}
          >
            Yes — both fixes wire into /admin
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#737373",
              lineHeight: 1.5,
              marginTop: 8,
              letterSpacing: "-0.02em",
            }}
          >
            Explorations at /briefing/cc-v2 get absorbed into the live system.
            The exploration route stays for reference.
          </p>
        </div>

        {/* ── FIX 1 ── */}
        <Section
          icon={<Rocket size={14} />}
          label="FIX 1"
          title="Unified Onboarding"
          items={FIX1_WIRING}
          approved={approved.fix1}
          onApprove={() => setApproved((s) => ({ ...s, fix1: true }))}
        />

        {/* ── FIX 2 ── */}
        <Section
          icon={<Layers size={14} />}
          label="FIX 2"
          title="KPI Strip + Decisions Panel"
          items={FIX2_WIRING}
          approved={approved.fix2}
          onApprove={() => setApproved((s) => ({ ...s, fix2: true }))}
        />

        {/* ── VALIDATION ── */}
        <div className="mt-10">
          <span
            style={{
              fontFamily: "Montserrat, sans-serif",
              fontWeight: 600,
              fontSize: "10px",
              letterSpacing: "0.08em",
              color: "#525252",
            }}
          >
            1:1 VALIDATION CHECKS
          </span>
          <div className="mt-3 space-y-1.5">
            {VALIDATION_CHECKS.map((check, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5 px-3 rounded-lg"
                style={{ background: "rgba(255,255,255,0.02)" }}
              >
                <Check
                  size={10}
                  className="mt-0.5 shrink-0"
                  style={{ color: GREEN }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    color: "#A3A3A3",
                    lineHeight: 1.4,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {check}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── SUMMARY ── */}
        <div
          className="mt-10 p-5 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.02)",
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <FileCode2 size={14} style={{ color: "#737373" }} />
            <span
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: "12px",
                color: "#FAFAFA",
                letterSpacing: "-0.03em",
              }}
            >
              Files touched on approval
            </span>
          </div>
          <div className="space-y-2">
            {[
              { file: "command-center-composite.tsx", change: "KPI + Decisions + Onboarding imports updated" },
              { file: "command-center-onboarding.tsx", change: "Deprecated — replaced by cc-v2-onboarding" },
              { file: "cc-v2-onboarding.tsx", change: "Stays as-is, gets imported into composite" },
              { file: "cc-v2-active.tsx", change: "Components extracted into composite, file kept for reference" },
            ].map((f) => (
              <div key={f.file} className="flex items-start gap-3">
                <span
                  className="shrink-0 px-2 py-0.5 rounded-md"
                  style={{
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "#A3A3A3",
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  {f.file}
                </span>
                <ArrowRight size={10} className="mt-1 shrink-0" style={{ color: "#525252" }} />
                <span style={{ fontSize: "11px", color: "#737373", letterSpacing: "-0.02em" }}>
                  {f.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Section Card ── */
function Section({
  icon,
  label,
  title,
  items,
  approved,
  onApprove,
}: {
  icon: React.ReactNode;
  label: string;
  title: string;
  items: WiringItem[];
  approved: boolean;
  onApprove: () => void;
}) {
  return (
    <div className="mb-8">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
        <div style={{ color: GREEN }}>{icon}</div>
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "10px",
            letterSpacing: "0.06em",
            color: GREEN,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "Montserrat, sans-serif",
            fontWeight: 600,
            fontSize: "14px",
            color: "#FAFAFA",
            letterSpacing: "-0.03em",
          }}
        >
          {title}
        </span>
      </div>

      {/* Before → After rows */}
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl p-3"
            style={{ background: "rgba(255,255,255,0.025)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="px-2 py-0.5 rounded-md"
                style={{
                  fontFamily: "monospace",
                  fontSize: "10px",
                  color: "#A3A3A3",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {item.file}
              </span>
              <ActionBadge action={item.action} />
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: "#525252",
                    display: "block",
                    marginBottom: 2,
                  }}
                >
                  BEFORE
                </span>
                <span style={{ fontSize: "11px", color: "#737373", lineHeight: 1.4, letterSpacing: "-0.02em" }}>
                  {item.before}
                </span>
              </div>
              <ArrowRight
                size={10}
                className="mt-3 shrink-0"
                style={{ color: "#525252" }}
              />
              <div className="flex-1">
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    letterSpacing: "0.05em",
                    color: "#525252",
                    display: "block",
                    marginBottom: 2,
                  }}
                >
                  AFTER
                </span>
                <span style={{ fontSize: "11px", color: "#E5E5E5", lineHeight: 1.4, letterSpacing: "-0.02em" }}>
                  {item.after}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default CCv2WiringPlan;
