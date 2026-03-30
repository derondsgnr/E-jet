/**
 * FIX 2 — ACTIVE COMMAND CENTER EXPLORATION
 *
 * 2A. KPI Strip — 5 metric groups: Drivers Online, Active Rides, Match Time, Issues, Revenue Today
 *     Health colors on group container (amber/red left border). Green = no border (default).
 *     Clicking non-green KPI scrolls decision panel to related item + 300ms highlight.
 *
 * 2B. Decisions Panel — Two sections:
 *     "Handle Now" (red items) + "Handle Today" (orange + blue items).
 *     Action buttons with verb labels: Investigate, Review, Approve, Resolve.
 *     Empty state for Handle Now: "Platform running smoothly" with green dot.
 *     Each action opens a right drawer overlay.
 *
 * 2C. KPI → Panel Connection — click amber/red KPI → scroll + highlight related item (300ms).
 *
 * DOES NOT TOUCH: nav rail, map, ticker, breadcrumbs, zone bubbles, rides surface.
 */

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, MapPin, Clock, AlertCircle, Wallet,
  X, ChevronRight, AlertTriangle,
  Building2, Car, Shield, Zap,
  Scale, CreditCard, Globe,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../config/admin-theme";
import { HEALTH_METRICS, ACTION_QUEUE } from "../../config/admin-mock-data";
import type { ActionItem } from "../../config/admin-mock-data";

/* ═══════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

type HealthLevel = "green" | "amber" | "red";

interface KPIGroup {
  id: string;
  label: string;
  value: string;
  detail: string;
  health: HealthLevel;
  healthLabel?: string;
  icon: typeof Users;
  /** IDs of action queue items this KPI relates to */
  relatedActions: string[];
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI DATA — 5 groups exactly as specified
   ═══════════════════════════════════════════════════════════════════════════ */

const m = HEALTH_METRICS;

function buildKPIGroups(): KPIGroup[] {
  const driversOnlinePercent = Math.round((m.activeDrivers / m.totalDrivers) * 100);
  const driverHealth: HealthLevel = driversOnlinePercent < 75 ? "amber" : "green";

  const matchHealth: HealthLevel = m.avgMatchTime > 90 ? "red" : m.avgMatchTime > 60 ? "amber" : "green";

  // Count urgent + total issues
  const criticalItems = ACTION_QUEUE.filter((a) => a.priority === "critical");
  const allIssues = ACTION_QUEUE.filter(
    (a) => a.priority === "critical" || a.priority === "high"
  );

  const revDelta = ((m.revenueToday - m.revenueYesterday) / m.revenueYesterday * 100).toFixed(0);

  return [
    {
      id: "drivers",
      label: "Drivers Online",
      value: `${m.activeDrivers} of ${m.totalDrivers}`,
      detail: `${driversOnlinePercent}% online`,
      health: driverHealth,
      healthLabel: driverHealth === "amber" ? "Below target" : undefined,
      icon: Users,
      relatedActions: ACTION_QUEUE.filter(
        (a) => a.type === "verification" || a.meta === "Supply pipeline"
      ).map((a) => a.id),
    },
    {
      id: "rides",
      label: "Active Rides",
      value: m.ridesToday.toLocaleString(),
      detail: "",
      health: "green",
      healthLabel: "Normal",
      icon: MapPin,
      relatedActions: [],
    },
    {
      id: "match",
      label: "Match Time",
      value: `${m.avgMatchTime}s`,
      detail: "",
      health: matchHealth,
      healthLabel: matchHealth === "green" ? "Healthy" : matchHealth === "amber" ? "Slow" : "Critical",
      icon: Clock,
      relatedActions: [],
    },
    {
      id: "issues",
      label: "Issues",
      value: `${criticalItems.length} urgent of ${allIssues.length}`,
      detail: "",
      health: criticalItems.length > 0 ? "red" : "green",
      icon: AlertCircle,
      relatedActions: criticalItems.map((a) => a.id),
    },
    {
      id: "revenue",
      label: "Revenue Today",
      value: `₦${(m.revenueToday / 1e6).toFixed(1)}M`,
      detail: `+${revDelta}%`,
      health: "green",
      healthLabel: "On target",
      icon: Wallet,
      relatedActions: ACTION_QUEUE.filter(
        (a) => a.type === "payout" || a.meta?.includes("finance") || a.meta?.includes("Finance")
      ).map((a) => a.id),
    },
  ];
}

/* ═══════════════════════════════════════════════════════════════════════════
   HEALTH HELPERS
   ═══════════════════════════════════════════════════════════════════════════ */

function healthColor(level: HealthLevel): string {
  switch (level) {
    case "red": return STATUS.error;
    case "amber": return STATUS.warning;
    default: return BRAND.green;
  }
}

function healthBorderStyle(level: HealthLevel): string {
  if (level === "amber") return STATUS.warning;
  if (level === "red") return STATUS.error;
  return "transparent";
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION ITEM MAPPING — priority → section, verb label
   ═══════════════════════════════════════════════════════════════════════════ */

function getActionVerb(item: ActionItem): string {
  switch (item.type) {
    case "dispute": return "Investigate";
    case "verification": return "Review";
    case "payout": return "Approve";
    case "alert": return "Investigate";
    case "escalation": return "Investigate";
    case "hotel": return item.priority === "high" ? "Resolve" : "Review";
    case "fleet": return item.priority === "high" ? "Resolve" : "Review";
    default: return "Review";
  }
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "critical": return STATUS.error;
    case "high": return STATUS.warning;
    case "medium": return STATUS.info;
    default: return STATUS.neutral;
  }
}

function getCategoryTag(item: ActionItem): string {
  return item.meta || item.type.charAt(0).toUpperCase() + item.type.slice(1);
}

function getCategoryIcon(item: ActionItem): typeof Users {
  switch (item.type) {
    case "hotel": return Building2;
    case "fleet": return Car;
    case "dispute": return Scale;
    case "payout": return CreditCard;
    case "verification": return Users;
    case "alert": return AlertTriangle;
    case "escalation": return Shield;
    default: return AlertCircle;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   KPI STRIP
   ═══════════════════════════════════════════════════════════════════════════ */

function KPIStrip({
  groups,
  onKPIClick,
}: {
  groups: KPIGroup[];
  onKPIClick: (group: KPIGroup) => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="flex items-stretch gap-2 px-4 py-3 overflow-x-auto scrollbar-hide shrink-0"
      style={{
        borderBottom: `1px solid ${t.border}`,
        background: t.overlay,
      }}
    >
      {groups.map((g, i) => {
        const borderLeft = healthBorderStyle(g.health);
        const clickable = g.health !== "green" && g.relatedActions.length > 0;

        return (
          <motion.button
            key={g.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => clickable && onKPIClick(g)}
            className={`flex-1 min-w-[140px] rounded-lg px-3 py-2.5 text-left transition-all ${
              clickable ? "cursor-pointer" : "cursor-default"
            }`}
            style={{
              background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
              boxShadow: borderLeft !== "transparent"
                ? `inset 0 0 0 1px ${borderLeft}18, 0 0 8px ${borderLeft}08`
                : "none",
            }}
            whileHover={clickable ? { scale: 1.01 } : {}}
            whileTap={clickable ? { scale: 0.99 } : {}}
          >
            {/* Label row */}
            <div className="flex items-center gap-1.5 mb-1">
              <g.icon size={11} style={{ color: t.iconMuted }} />
              <span
                style={{
                  ...TY.body,
                  fontSize: "10px",
                  color: t.textMuted,
                }}
              >
                {g.label}
              </span>
            </div>

            {/* Value row */}
            <div className="flex items-baseline gap-2">
              <span
                style={{
                  ...TY.sub,
                  fontSize: "16px",
                  color: t.text,
                }}
              >
                {g.id === "issues" ? (
                  <>
                    <span style={{ color: STATUS.error }}>{g.value.split(" ")[0]}</span>
                    <span style={{ color: t.textMuted, fontSize: "11px", fontWeight: 400 }}>
                      {" "}
                      {g.value.split(" ").slice(1).join(" ")}
                    </span>
                  </>
                ) : (
                  g.value
                )}
              </span>
              {g.detail && (
                <span
                  style={{
                    ...TY.bodyR,
                    fontSize: "10px",
                    color: t.textMuted,
                  }}
                >
                  · {g.detail}
                </span>
              )}
            </div>

            {/* Health tag */}
            {g.healthLabel && (
              <div className="mt-1.5">
                <span
                  className="px-1.5 py-0.5 rounded-md inline-flex items-center gap-1"
                  style={{
                    ...TY.cap,
                    fontSize: "9px",
                    color: healthColor(g.health),
                    background: `${healthColor(g.health)}10`,
                  }}
                >
                  {g.health === "red" && (
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{ background: STATUS.error }}
                    />
                  )}
                  {g.healthLabel}
                </span>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION ITEM ROW
   ═══════════════════════════════════════════════════════════════════════════ */

function ActionItemRow({
  item,
  highlighted,
  onAction,
  itemRef,
}: {
  item: ActionItem;
  highlighted: boolean;
  onAction: (item: ActionItem) => void;
  itemRef?: (el: HTMLDivElement | null) => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const color = getPriorityColor(item.priority);
  const Icon = getCategoryIcon(item);
  const verb = getActionVerb(item);
  const tag = getCategoryTag(item);

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, backgroundColor: "rgba(0,0,0,0)" }}
      animate={{
        opacity: 1,
        backgroundColor: highlighted
          ? isDark
            ? "rgba(29,185,84,0.06)"
            : "rgba(29,185,84,0.04)"
          : "rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 px-3 py-3 rounded-lg transition-colors"
      style={{
        border: highlighted ? `1px solid ${BRAND.green}20` : "1px solid transparent",
      }}
    >
      {/* Priority dot */}
      <div
        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
        style={{ background: color }}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span
            style={{
              ...TY.body,
              fontSize: "12px",
              color: t.text,
            }}
          >
            {item.title}
          </span>
        </div>
        <p
          className="truncate"
          style={{
            ...TY.bodyR,
            fontSize: "11px",
            color: t.textMuted,
          }}
        >
          {item.subtitle}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            style={{
              ...TY.cap,
              fontSize: "9px",
              color: t.textFaint,
            }}
          >
            {item.timestamp}
          </span>
          <span
            className="px-1.5 py-0.5 rounded-md flex items-center gap-1"
            style={{
              ...TY.cap,
              fontSize: "8px",
              color: t.textMuted,
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.025)",
            }}
          >
            <Icon size={8} />
            {tag}
          </span>
        </div>
      </div>

      {/* Action button — verb label */}
      <button
        onClick={() => onAction(item)}
        className="shrink-0 px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors mt-0.5"
        style={{
          ...TY.body,
          fontSize: "10px",
          color: isDark ? t.text : t.textSecondary,
          background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
          border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = isDark
            ? "rgba(255,255,255,0.04)"
            : "rgba(0,0,0,0.03)";
        }}
      >
        {verb}
        <ChevronRight size={9} />
      </button>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   DECISION PANEL
   ═══════════════════════════════════════════════════════════════════════════ */

function DecisionsPanel({
  highlightedIds,
  onAction,
  panelRef,
  itemRefs,
}: {
  highlightedIds: string[];
  onAction: (item: ActionItem) => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
  itemRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  // Split into sections
  const handleNow = ACTION_QUEUE.filter(
    (a) => a.priority === "critical"
  );
  // "Handle Today" = high (orange) + medium (blue). Orange first.
  const handleToday = [
    ...ACTION_QUEUE.filter((a) => a.priority === "high"),
    ...ACTION_QUEUE.filter((a) => a.priority === "medium"),
  ];

  return (
    <div
      ref={panelRef}
      className="flex-1 overflow-y-auto px-1 py-3"
      style={{ scrollBehavior: "smooth" }}
    >
      {/* ── HANDLE NOW ── */}
      <div className="flex items-center gap-2 px-3 mb-2">
        <div
          className="h-px flex-1"
          style={{ background: t.borderSubtle }}
        />
        <span
          style={{
            ...TY.label,
            fontSize: "8px",
            color: handleNow.length > 0 ? STATUS.error : t.textFaint,
            letterSpacing: "0.1em",
          }}
        >
          HANDLE NOW
        </span>
        <div
          className="h-px flex-1"
          style={{ background: t.borderSubtle }}
        />
      </div>

      {handleNow.length === 0 ? (
        // Empty state
        <div className="flex items-center gap-2 px-4 py-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: BRAND.green }}
          />
          <span
            style={{
              ...TY.bodyR,
              fontSize: "11px",
              color: t.textMuted,
            }}
          >
            Platform running smoothly
          </span>
        </div>
      ) : (
        <div className="space-y-0.5">
          {handleNow.map((item) => (
            <ActionItemRow
              key={item.id}
              item={item}
              highlighted={highlightedIds.includes(item.id)}
              onAction={onAction}
              itemRef={(el) => {
                itemRefs.current[item.id] = el;
              }}
            />
          ))}
        </div>
      )}

      {/* ── HANDLE TODAY ── */}
      <div className="flex items-center gap-2 px-3 mt-4 mb-2">
        <div
          className="h-px flex-1"
          style={{ background: t.borderSubtle }}
        />
        <span
          style={{
            ...TY.label,
            fontSize: "8px",
            color: t.textFaint,
            letterSpacing: "0.1em",
          }}
        >
          HANDLE TODAY
        </span>
        <div
          className="h-px flex-1"
          style={{ background: t.borderSubtle }}
        />
      </div>

      <div className="space-y-0.5">
        {handleToday.map((item) => (
          <ActionItemRow
            key={item.id}
            item={item}
            highlighted={highlightedIds.includes(item.id)}
            onAction={onAction}
            itemRef={(el) => {
              itemRefs.current[item.id] = el;
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACTION DRAWER — right overlay
   ═══════════════════════════════════════════════════════════════════════════ */

function ActionDrawer({
  item,
  onClose,
}: {
  item: ActionItem;
  onClose: () => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const color = getPriorityColor(item.priority);
  const Icon = getCategoryIcon(item);
  const verb = getActionVerb(item);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 300 }}
      className="absolute top-0 right-0 bottom-0 w-[380px] z-50 flex flex-col"
      style={{
        background: isDark ? "rgba(12,12,14,0.97)" : "rgba(255,255,255,0.98)",
        borderLeft: `1px solid ${t.border}`,
        backdropFilter: "blur(20px)",
        boxShadow: isDark
          ? "-8px 0 32px rgba(0,0,0,0.4)"
          : "-4px 0 16px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{ borderBottom: `1px solid ${t.border}` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: color }}
          />
          <span
            style={{
              ...TY.body,
              fontSize: "12px",
              color: t.text,
            }}
          >
            {verb}
          </span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
          style={{
            background: isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.03)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.03)";
          }}
        >
          <X size={13} style={{ color: t.icon }} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${color}12` }}
          >
            <Icon size={14} style={{ color }} />
          </div>
          <div>
            <span
              className="px-1.5 py-0.5 rounded-md"
              style={{
                ...TY.cap,
                fontSize: "9px",
                color,
                background: `${color}10`,
              }}
            >
              {item.priority.toUpperCase()}
            </span>
          </div>
        </div>

        <h3
          style={{
            ...TY.sub,
            fontSize: "16px",
            color: t.text,
            marginBottom: 8,
          }}
        >
          {item.title}
        </h3>

        <p
          style={{
            ...TY.bodyR,
            fontSize: "12px",
            color: t.textSecondary,
            lineHeight: "1.5",
            marginBottom: 16,
          }}
        >
          {item.subtitle}
        </p>

        {/* Meta details */}
        <div className="space-y-3">
          <div
            className="flex items-center justify-between py-2 px-3 rounded-lg"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.02)"
                : "rgba(0,0,0,0.015)",
              border: `1px solid ${t.borderSubtle}`,
            }}
          >
            <span
              style={{ ...TY.body, fontSize: "11px", color: t.textMuted }}
            >
              Category
            </span>
            <span
              style={{ ...TY.body, fontSize: "11px", color: t.textSecondary }}
            >
              {item.meta || item.type}
            </span>
          </div>
          <div
            className="flex items-center justify-between py-2 px-3 rounded-lg"
            style={{
              background: isDark
                ? "rgba(255,255,255,0.02)"
                : "rgba(0,0,0,0.015)",
              border: `1px solid ${t.borderSubtle}`,
            }}
          >
            <span
              style={{ ...TY.body, fontSize: "11px", color: t.textMuted }}
            >
              Reported
            </span>
            <span
              style={{ ...TY.body, fontSize: "11px", color: t.textSecondary }}
            >
              {item.timestamp}
            </span>
          </div>
        </div>

        {/* Placeholder for detailed investigation view */}
        <div
          className="mt-6 py-8 rounded-lg flex items-center justify-center"
          style={{
            background: isDark
              ? "rgba(255,255,255,0.015)"
              : "rgba(0,0,0,0.01)",
            border: `1px dashed ${t.borderSubtle}`,
          }}
        >
          <span
            style={{
              ...TY.bodyR,
              fontSize: "11px",
              color: t.textFaint,
            }}
          >
            Detailed investigation view — not wired yet
          </span>
        </div>
      </div>

      {/* Footer action */}
      <div
        className="shrink-0 px-5 py-4"
        style={{ borderTop: `1px solid ${t.border}` }}
      >
        <button
          onClick={onClose}
          className="w-full py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          style={{
            background: BRAND.green,
            color: "#FFFFFF",
            ...TY.body,
            fontSize: "12px",
          }}
        >
          {verb}
          <ChevronRight size={12} />
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GHOST MAP — atmospheric background placeholder
   ═══════════════════════════════════════════════════════════════════════════ */

function GhostMapArea() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="flex-1 relative flex items-center justify-center"
      style={{
        background: t.mapBg,
      }}
    >
      {/* Grid overlay */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {Array.from({ length: 15 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={`${(i + 1) * 6.66}%`}
            x2="100%"
            y2={`${(i + 1) * 6.66}%`}
            stroke={t.mapGrid}
            strokeWidth="0.5"
          />
        ))}
        {Array.from({ length: 15 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={`${(i + 1) * 6.66}%`}
            y1="0"
            x2={`${(i + 1) * 6.66}%`}
            y2="100%"
            stroke={t.mapGrid}
            strokeWidth="0.5"
          />
        ))}
      </svg>

      {/* Green ambient glow */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full pointer-events-none"
        style={{
          background: `radial-gradient(ellipse, ${BRAND.green}06 0%, transparent 70%)`,
        }}
      />

      {/* Ghost zone bubbles */}
      {[
        { x: 30, y: 40, r: 24, label: "VI" },
        { x: 55, y: 30, r: 18, label: "Ikeja" },
        { x: 70, y: 55, r: 16, label: "Lekki" },
        { x: 40, y: 65, r: 12, label: "Yaba" },
        { x: 20, y: 58, r: 14, label: "Surulere" },
      ].map((z) => (
        <div
          key={z.label}
          className="absolute rounded-full flex items-center justify-center"
          style={{
            left: `${z.x}%`,
            top: `${z.y}%`,
            width: z.r * 2,
            height: z.r * 2,
            transform: "translate(-50%, -50%)",
            background: `${BRAND.green}08`,
            border: `1px solid ${BRAND.green}15`,
          }}
        >
          <span
            style={{
              ...TY.cap,
              fontSize: "8px",
              color: t.textFaint,
            }}
          >
            {z.label}
          </span>
        </div>
      ))}

      {/* Center label */}
      <div className="relative z-10 text-center">
        <Globe
          size={20}
          style={{ color: t.textGhost, marginBottom: 8, margin: "0 auto 8px" }}
        />
        <span
          style={{
            ...TY.bodyR,
            fontSize: "11px",
            color: t.textFaint,
            display: "block",
          }}
        >
          Map area — not part of this exploration
        </span>
        <span
          style={{
            ...TY.bodyR,
            fontSize: "10px",
            color: t.textGhost,
            display: "block",
            marginTop: 2,
          }}
        >
          Focus: KPI strip + Decisions panel
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export function CCv2Active() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const [highlightedIds, setHighlightedIds] = useState<string[]>([]);
  const [drawerItem, setDrawerItem] = useState<ActionItem | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const kpiGroups = buildKPIGroups();

  // 2C. KPI → Panel connection: scroll to related items + 300ms highlight
  const handleKPIClick = useCallback(
    (group: KPIGroup) => {
      if (group.relatedActions.length === 0) return;

      const firstId = group.relatedActions[0];
      const el = itemRefs.current[firstId];

      if (el && panelRef.current) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      setHighlightedIds(group.relatedActions);
      setTimeout(() => setHighlightedIds([]), 300);
    },
    []
  );

  const handleAction = useCallback((item: ActionItem) => {
    setDrawerItem(item);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerItem(null);
  }, []);

  // Escape key to close drawer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeDrawer]);

  return (
    <div
      className="flex-1 flex flex-col overflow-hidden relative"
      style={{ background: t.bg }}
    >
      {/* KPI Strip */}
      <KPIStrip groups={kpiGroups} onKPIClick={handleKPIClick} />

      {/* Main area — map (ghost) + decisions panel */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Map area (ghost placeholder) */}
        <GhostMapArea />

        {/* Decisions panel — right side */}
        <div
          className="w-[320px] shrink-0 flex flex-col"
          style={{
            borderLeft: `1px solid ${t.border}`,
            background: t.overlay,
          }}
        >
          {/* Panel header */}
          <div
            className="px-4 py-3 shrink-0"
            style={{ borderBottom: `1px solid ${t.border}` }}
          >
            <span
              style={{
                ...TY.sub,
                fontSize: "13px",
                color: t.text,
              }}
            >
              Decisions
            </span>
          </div>

          <DecisionsPanel
            highlightedIds={highlightedIds}
            onAction={handleAction}
            panelRef={panelRef}
            itemRefs={itemRefs}
          />
        </div>

        {/* Action drawer overlay */}
        <AnimatePresence>
          {drawerItem && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40"
                style={{
                  background: isDark
                    ? "rgba(0,0,0,0.3)"
                    : "rgba(0,0,0,0.1)",
                }}
                onClick={closeDrawer}
              />
              <ActionDrawer item={drawerItem} onClose={closeDrawer} />
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export type { KPIGroup };
export { buildKPIGroups, KPIStrip, DecisionsPanel, ActionDrawer, ActionItemRow, healthColor, healthBorderStyle, getPriorityColor, getActionVerb, getCategoryIcon, getCategoryTag };