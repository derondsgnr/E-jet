/**
 * FLEET OWNER — DRIVERS TAB
 *
 * Master-detail layout: driver list (left) + inline side drawer (right).
 * Desktop: drawer animates width 0→380px (admin rides pattern).
 * Mobile: slide-over drawer from right (not bottom sheet — web pattern).
 *
 * Architecture: Linear filter bar + Stripe/Linear data table + Apple master-detail.
 */

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, UserPlus, Search, SlidersHorizontal,
  Star, Car, Phone, MessageCircle, History,
  AlertTriangle, ChevronDown, X, Copy, Mail,
  MapPin, Timer, ArrowUpRight, Check, Shield,
  FileSearch, ClipboardCheck, ChevronRight, Zap,
  ArrowUp, ArrowDown,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import {
  MOCK_DRIVERS, MOCK_VEHICLES,
  type FleetDriver, type FleetVehicle,
} from "../config/fleet-mock-data";
import { DetailDrawer } from "../components/detail-drawer";
import {
  DriverAvatar, Sparkline, StatusDot,
  driverStatusColor, driverStatusLabel,
} from "../components/fleet/driver-card";
import { InviteDriverSheet } from "../components/fleet/invite-driver-sheet";
import { useFleetContext } from "./fleet-context";
import { Toast } from "../components/shared/toast";
import { ConfirmModal } from "../components/shared/confirm-modal";
import { DriverHistoryModal } from "../components/fleet/driver-history-modal";
import { TableSkeleton } from "../components/shared/view-skeleton";
import { ErrorState } from "../components/shared/error-state";

const STAGGER = 0.04;

// ─── Types ──────────────────────────────────────────────────────────────────

type FilterId = "all" | "online" | "on_trip" | "offline" | "suspended" | "pending";
type SortId = "earnings" | "rating" | "rides" | "name";

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  if (n >= 1000000) return "₦" + (n / 1000000).toFixed(1) + "M";
  if (n >= 100000) return "₦" + (n / 1000).toFixed(0) + "K";
  return "₦" + n.toLocaleString();
}

function copyToClipboard(text: string): boolean {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return true;
  } catch {
    return false;
  }
}

function verificationLabel(s: FleetDriver["verificationStatus"]): string {
  switch (s) {
    case "docs_submitted": return "Docs Submitted";
    case "under_review": return "Under Review";
    case "approved": return "Approved";
    case "rejected": return "Rejected";
  }
}

function verificationProgress(s: FleetDriver["verificationStatus"]): number {
  switch (s) {
    case "docs_submitted": return 30;
    case "under_review": return 60;
    case "approved": return 100;
    case "rejected": return 0;
  }
}

function verificationIcon(s: FleetDriver["verificationStatus"]) {
  switch (s) {
    case "docs_submitted": return FileSearch;
    case "under_review": return Shield;
    case "approved": return ClipboardCheck;
    case "rejected": return AlertTriangle;
  }
}

// Toast + ConfirmModal → shared components (see imports above)

// ─── Reassign Vehicle Modal ─────────────────────────────────────────────────

function ReassignVehicleModal({ driver, vehicles, onAssign, onClose }: {
  driver: FleetDriver;
  vehicles: FleetVehicle[];
  onAssign: (vehicleId: string) => void;
  onClose: () => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const available = vehicles.filter(v => v.status === "approved" && (!v.assignedDriverId || v.assignedDriverId === driver.assignedVehicleId));

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0" style={{ background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)" }} onClick={onClose} />
      <motion.div
        className="relative w-full max-w-sm rounded-2xl p-6 max-h-[70vh] overflow-y-auto"
        style={{
          background: isDark ? "rgba(22,22,24,0.97)" : "#fff",
          border: `1px solid ${t.borderSubtle}`,
          boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.5)" : "0 24px 64px rgba(0,0,0,0.15)",
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ ...TY.sub, fontSize: "15px", color: t.text, lineHeight: "1.3" }}>Reassign Vehicle</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" style={{ background: t.surface }}>
            <X size={14} style={{ color: t.iconMuted }} />
          </button>
        </div>
        <p style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, lineHeight: "1.5", marginBottom: 16 }}>
          Select a vehicle for {driver.name}
        </p>
        <div className="space-y-2">
          {available.length === 0 && (
            <div className="py-6 text-center">
              <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, lineHeight: "1.5" }}>No available vehicles</span>
            </div>
          )}
          {available.map(v => {
            const isCurrentlyAssigned = v.assignedDriverId === driver.assignedVehicleId;
            return (
              <button
                key={v.id}
                className="w-full p-3.5 rounded-xl text-left flex items-center gap-3 transition-colors"
                style={{
                  background: isCurrentlyAssigned ? t.greenBg : t.surface,
                  border: `1px solid ${isCurrentlyAssigned ? t.greenBorder : t.borderSubtle}`,
                }}
                onClick={() => onAssign(v.id)}
                onMouseEnter={e => { if (!isCurrentlyAssigned) e.currentTarget.style.borderColor = `${BRAND.green}30`; }}
                onMouseLeave={e => { if (!isCurrentlyAssigned) e.currentTarget.style.borderColor = t.borderSubtle; }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.surfaceRaised }}>
                  <Car size={14} style={{ color: v.type === "EV" ? BRAND.green : t.iconMuted }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block truncate" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    {v.make} {v.model} {v.year}
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                    {v.plate} {v.type === "EV" ? "· EV" : ""}
                  </span>
                </div>
                {isCurrentlyAssigned && (
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: BRAND.green, lineHeight: "1.5" }}>Current</span>
                )}
              </button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── KPI Tile ───────────────────────────────────────────────────────────────

function KPITile({ label, value, color, active, onClick, delay = 0 }: {
  label: string; value: number; color: string; active: boolean; onClick: () => void; delay?: number;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <motion.button
      className="flex-1 min-w-[80px] p-3 rounded-xl text-left transition-all"
      style={{
        background: active
          ? (isDark ? `${color}12` : `${color}08`)
          : t.surface,
        border: `1px solid ${active ? `${color}25` : t.borderSubtle}`,
        boxShadow: active ? `0 0 16px ${color}08` : "none",
      }}
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <span className="block" style={{ ...TY.h, fontSize: "20px", color: active ? color : t.text, lineHeight: "1.2" }}>{value}</span>
      <span style={{ ...TY.bodyR, fontSize: "10px", color: active ? color : t.textMuted, lineHeight: "1.5", letterSpacing: "-0.02em" }}>{label}</span>
    </motion.button>
  );
}

// ─── Filter Pill ────────────────────────────────────────────────────────────

function FilterPill({ label, count, active, onClick }: {
  label: string; count: number; active: boolean; onClick: () => void;
}) {
  const { t } = useAdminTheme();

  return (
    <button
      className="px-3 py-1.5 rounded-lg shrink-0 transition-all"
      style={{
        background: active ? `${BRAND.green}12` : "transparent",
        border: `1px solid ${active ? `${BRAND.green}25` : "transparent"}`,
        ...TY.body,
        fontSize: "11px",
        color: active ? BRAND.green : t.textMuted,
        lineHeight: "1.4",
        letterSpacing: "-0.02em",
      }}
      onClick={onClick}
    >
      {label} <span style={{ opacity: 0.7 }}>· {count}</span>
    </button>
  );
}

// ─── Sortable Column Header ─────────────────────────────────────────────────

function ColHeader({ label, sortKey, currentSort, onSort, align = "left" }: {
  label: string; sortKey: SortId; currentSort: SortId; onSort: (s: SortId) => void; align?: "left" | "right";
}) {
  const { t } = useAdminTheme();
  const active = currentSort === sortKey;
  return (
    <button
      className="flex items-center gap-1 transition-colors"
      style={{ justifyContent: align === "right" ? "flex-end" : "flex-start" }}
      onClick={() => onSort(sortKey)}
    >
      <span style={{
        ...TY.label, fontSize: "10px", letterSpacing: "0.04em", lineHeight: "1.4",
        color: active ? BRAND.green : t.textFaint,
      }}>
        {label}
      </span>
      {active && <ArrowDown size={9} style={{ color: BRAND.green }} />}
    </button>
  );
}

// ─── Status Badge (inline, compact) ─────────────────────────────────────────

function StatusBadge({ status, lastSeen }: { status: FleetDriver["status"]; lastSeen?: string }) {
  const { t } = useAdminTheme();
  const color = driverStatusColor(status);
  const label = driverStatusLabel(status);
  const showLastSeen = (status === "offline" || status === "suspended") && lastSeen;
  return (
    <div>
      <div className="flex items-center gap-1.5">
        <StatusDot color={color} size={6} pulse={status === "on_trip" || status === "online"} />
        <span style={{ ...TY.bodyR, fontSize: "11px", color, lineHeight: "1.4" }}>{label}</span>
      </div>
      {showLastSeen && (
        <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.4", marginLeft: 14, display: "block" }}>
          Last seen {lastSeen}
        </span>
      )}
    </div>
  );
}

// ─── Verification Badge (inline, compact) ───────────────────────────────────

function VerifBadge({ status }: { status: FleetDriver["verificationStatus"] }) {
  const color = status === "rejected" ? STATUS.error : STATUS.warning;
  return (
    <span className="px-2 py-0.5 rounded-md" style={{
      ...TY.bodyR, fontSize: "10px", color,
      background: `${color}10`, border: `1px solid ${color}15`,
      lineHeight: "1.4", letterSpacing: "0.01em",
    }}>
      {verificationLabel(status)}
    </span>
  );
}

// ─── Driver Data Table (Linear/Stripe pattern) ─────────────────────────────

function DriverTable({ drivers, selectedId, onSelect, sortBy, onSort }: {
  drivers: FleetDriver[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  sortBy: SortId;
  onSort: (s: SortId) => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  const thStyle: React.CSSProperties = {
    position: "sticky", top: 0, zIndex: 2,
    background: isDark ? "rgba(17,17,19,0.97)" : "rgba(255,255,255,0.97)",
    backdropFilter: "blur(8px)",
    padding: "8px 12px",
    borderBottom: `1px solid ${t.borderSubtle}`,
  };

  return (
    <table className="w-full" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
      <thead>
        <tr>
          <th style={{ ...thStyle, textAlign: "left" }}>
            <ColHeader label="DRIVER" sortKey="name" currentSort={sortBy} onSort={onSort} />
          </th>
          <th className="hidden sm:table-cell" style={{ ...thStyle, textAlign: "left" }}>
            <span style={{ ...TY.label, fontSize: "10px", letterSpacing: "0.04em", lineHeight: "1.4", color: t.textFaint }}>STATUS</span>
          </th>
          <th className="hidden lg:table-cell" style={{ ...thStyle, textAlign: "left" }}>
            <span style={{ ...TY.label, fontSize: "10px", letterSpacing: "0.04em", lineHeight: "1.4", color: t.textFaint }}>VEHICLE</span>
          </th>
          <th className="hidden md:table-cell" style={{ ...thStyle, textAlign: "right" }}>
            <ColHeader label="RATING" sortKey="rating" currentSort={sortBy} onSort={onSort} align="right" />
          </th>
          <th className="hidden md:table-cell" style={{ ...thStyle, textAlign: "right" }}>
            <ColHeader label="RIDES" sortKey="rides" currentSort={sortBy} onSort={onSort} align="right" />
          </th>
          <th style={{ ...thStyle, textAlign: "right" }}>
            <ColHeader label="EARNINGS" sortKey="earnings" currentSort={sortBy} onSort={onSort} align="right" />
          </th>
        </tr>
      </thead>
      <tbody>
        {drivers.map((d) => {
          const selected = selectedId === d.id;
          const statusColor = driverStatusColor(d.status);
          const isApproved = d.verificationStatus === "approved";

          return (
            <tr
              key={d.id}
              className="transition-colors cursor-pointer"
              style={{
                background: selected
                  ? (isDark ? `${BRAND.green}08` : `${BRAND.green}04`)
                  : "transparent",
              }}
              onClick={() => onSelect(d.id)}
              onMouseEnter={e => { if (!selected) (e.currentTarget).style.background = t.surfaceHover; }}
              onMouseLeave={e => { if (!selected) (e.currentTarget).style.background = "transparent"; }}
            >
              <td style={{ padding: "8px 12px", borderBottom: `1px solid ${t.borderSubtle}` }}>
                <div className="flex items-center gap-2.5">
                  <DriverAvatar driver={d} size={28} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                        {d.name}
                      </span>
                      {d.status === "on_trip" && (
                        <span className="px-1 py-px rounded shrink-0" style={{
                          fontSize: "8px", background: `${BRAND.green}12`, color: BRAND.green,
                          border: `1px solid ${BRAND.green}15`, lineHeight: "1.2", letterSpacing: "0.02em",
                          fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                        }}>LIVE</span>
                      )}
                      {d.status === "suspended" && (
                        <span className="px-1 py-px rounded shrink-0" style={{
                          fontSize: "8px", background: `${STATUS.error}12`, color: STATUS.error,
                          border: `1px solid ${STATUS.error}15`, lineHeight: "1.2", letterSpacing: "0.02em",
                          fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                        }}>SUSPENDED</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 sm:hidden mt-0.5">
                      <StatusDot color={statusColor} size={5} pulse={d.status === "on_trip" || d.status === "online"} />
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: statusColor, lineHeight: "1.4" }}>
                        {driverStatusLabel(d.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="hidden sm:table-cell" style={{ padding: "8px 12px", borderBottom: `1px solid ${t.borderSubtle}` }}>
                {isApproved ? <StatusBadge status={d.status} lastSeen={d.lastSeen} /> : <VerifBadge status={d.verificationStatus} />}
              </td>
              <td className="hidden lg:table-cell" style={{ padding: "8px 12px", borderBottom: `1px solid ${t.borderSubtle}` }}>
                <span className="truncate block" style={{ ...TY.bodyR, fontSize: "11px", color: d.assignedVehicle ? t.textSecondary : t.textFaint, lineHeight: "1.4", maxWidth: 200 }}>
                  {d.assignedVehicle || "—"}
                </span>
              </td>
              <td className="hidden md:table-cell" style={{ padding: "8px 12px", borderBottom: `1px solid ${t.borderSubtle}`, textAlign: "right" }}>
                {d.rating > 0 ? (
                  <div className="flex items-center gap-1 justify-end">
                    <Star size={10} style={{ color: STATUS.warning }} />
                    <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{d.rating.toFixed(1)}</span>
                  </div>
                ) : (
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint, lineHeight: "1.4" }}>—</span>
                )}
              </td>
              <td className="hidden md:table-cell" style={{ padding: "8px 12px", borderBottom: `1px solid ${t.borderSubtle}`, textAlign: "right" }}>
                <span style={{ ...TY.body, fontSize: "11px", color: d.totalRides > 0 ? t.text : t.textFaint, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  {d.totalRides > 0 ? d.totalRides : "—"}
                </span>
              </td>
              <td style={{ padding: "8px 12px", borderBottom: `1px solid ${t.borderSubtle}`, textAlign: "right" }}>
                <span style={{ ...TY.body, fontSize: "11px", color: d.earningsThisWeek > 0 ? BRAND.green : t.textFaint, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  {d.earningsThisWeek > 0 ? fmt(d.earningsThisWeek) : "—"}
                </span>
                {d.earningsThisWeek > 0 && (
                  <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.4" }}>/week</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

// ─── Detail Panel: Driver Profile ───────────────────────────────────────────

function DriverDetailPanel({ driver, onClose, onReassign, onSuspend, onReactivate, onViewHistory, showToast }: {
  driver: FleetDriver;
  onClose: () => void;
  onReassign: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
  onViewHistory: () => void;
  showToast: (msg: string, type?: "success" | "info" | "error") => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const statusColor = driverStatusColor(driver.status);
  const isApproved = driver.verificationStatus === "approved";
  const progress = verificationProgress(driver.verificationStatus);

  const sectionStyle: React.CSSProperties = {
    borderTop: `1px solid ${t.borderSubtle}`,
    paddingTop: 16,
    marginTop: 16,
  };

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Drawer header with close */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
        <span style={{ ...TY.sub, fontSize: "14px", color: t.text, lineHeight: "1.3" }}>Driver Details</span>
        <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <X size={14} style={{ color: t.iconMuted }} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {/* Profile Header */}
        <div className="flex items-start gap-3.5 mb-1">
          <DriverAvatar driver={driver} size={48} />
          <div className="flex-1 min-w-0">
            <span className="block" style={{ ...TY.sub, fontSize: "16px", color: t.text, lineHeight: "1.3", letterSpacing: "-0.02em" }}>
              {driver.name}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <StatusDot color={statusColor} size={7} pulse={driver.status === "on_trip" || driver.status === "online"} />
              <span style={{ ...TY.bodyR, fontSize: "11px", color: statusColor, lineHeight: "1.5" }}>
                {driverStatusLabel(driver.status)}
              </span>
            </div>
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>
              Joined {driver.joinedDate}
              {driver.lastSeen && (driver.status === "offline" || driver.status === "suspended") && (
                <> · Last seen {driver.lastSeen}</>
              )}
            </span>
          </div>
        </div>

        {/* Quick Contact */}
        <div className="flex gap-2 mt-4">
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-colors"
            style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}
            onClick={() => {
              window.open(`tel:${driver.phone}`);
              showToast("Opening dialer…", "info");
            }}
          >
            <Phone size={12} /> Call
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-colors"
            style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}
            onClick={() => showToast("In-app messaging — requires backend integration", "info")}
          >
            <MessageCircle size={12} /> Message
          </button>
        </div>

        {/* Performance */}
        {isApproved && (
          <div style={sectionStyle}>
            <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
              PERFORMANCE
            </span>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>Rating</span>
                <div className="flex items-center gap-1">
                  <Star size={10} style={{ color: STATUS.warning }} />
                  <span style={{ ...TY.h, fontSize: "16px", color: t.text, lineHeight: "1.2" }}>
                    {driver.rating > 0 ? driver.rating.toFixed(2) : "—"}
                  </span>
                </div>
              </div>
              <div>
                <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>Total Rides</span>
                <span style={{ ...TY.h, fontSize: "16px", color: t.text, lineHeight: "1.2" }}>{driver.totalRides}</span>
              </div>
              <div>
                <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>This Week</span>
                <span style={{ ...TY.h, fontSize: "16px", color: BRAND.green, lineHeight: "1.2" }}>{fmt(driver.earningsThisWeek)}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}` }}>
              <span className="block mb-2" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                Weekly Trend
              </span>
              <Sparkline data={driver.sparkline} color={BRAND.green} width={220} height={32} />
            </div>
          </div>
        )}

        {/* Verification (pipeline drivers) */}
        {!isApproved && (
          <div style={sectionStyle}>
            <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
              VERIFICATION STATUS
            </span>
            <div className="p-4 rounded-xl" style={{ background: `${STATUS.warning}06`, border: `1px solid ${STATUS.warning}12` }}>
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} style={{ color: STATUS.warning }} />
                <span style={{ ...TY.body, fontSize: "12px", color: STATUS.warning, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  {verificationLabel(driver.verificationStatus)}
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full overflow-hidden mb-2" style={{ background: t.surfaceRaised }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: STATUS.warning }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                {progress}% complete
              </span>
            </div>
            <button
              className="mt-3 w-full py-2.5 rounded-xl flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
              style={{ background: `${STATUS.warning}12`, border: `1px solid ${STATUS.warning}18`, ...TY.body, fontSize: "12px", color: STATUS.warning, lineHeight: "1.4", letterSpacing: "-0.02em" }}
              onClick={() => showToast("Verification reminder preview — requires backend integration", "info")}
            >
              <Mail size={12} />
              Send Reminder
            </button>
          </div>
        )}

        {/* Current Ride */}
        {driver.currentRide && (
          <div style={sectionStyle}>
            <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
              CURRENT RIDE
            </span>
            <div className="p-3.5 rounded-xl" style={{ background: `${BRAND.green}06`, border: `1px solid ${BRAND.green}10` }}>
              <div className="flex items-start gap-2.5">
                <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: BRAND.green }} />
                  <div className="w-px h-5" style={{ background: `${t.textFaint}30` }} />
                  <div className="w-2 h-2 rounded-full" style={{ background: STATUS.error }} />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div>
                    <span className="block truncate" style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                      {driver.currentRide.pickup}
                    </span>
                  </div>
                  <div>
                    <span className="block truncate" style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                      {driver.currentRide.dropoff}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2.5" style={{ borderTop: `1px solid ${BRAND.green}10` }}>
                <div className="flex items-center gap-1.5">
                  <Timer size={11} style={{ color: BRAND.green }} />
                  <span style={{ ...TY.body, fontSize: "11px", color: BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    ETA {driver.currentRide.eta}
                  </span>
                </div>
                <span style={{ ...TY.h, fontSize: "14px", color: t.text, lineHeight: "1.2" }}>
                  {fmt(driver.currentRide.fare)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Contact & Info */}
        {isApproved && (
          <div style={sectionStyle}>
            <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
              DETAILS
            </span>
            <div className="space-y-2.5">
              {[
                { label: "Phone", value: driver.phone },
                { label: "ID", value: driver.id.toUpperCase() },
                { label: "Joined", value: driver.joinedDate },
                ...(driver.lastSeen ? [{ label: "Last Seen", value: driver.lastSeen }] : []),
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between">
                  <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.4" }}>{row.label}</span>
                  <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vehicle Assignment */}
        <div style={sectionStyle}>
          <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
            VEHICLE
          </span>
          {driver.assignedVehicle ? (
            <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.surfaceRaised }}>
                <Car size={14} style={{ color: t.iconMuted }} />
              </div>
              <span className="flex-1 truncate" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                {driver.assignedVehicle}
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl flex items-center gap-2" style={{ background: `${STATUS.warning}06`, border: `1px solid ${STATUS.warning}10` }}>
              <Car size={14} style={{ color: STATUS.warning }} />
              <span style={{ ...TY.bodyR, fontSize: "11px", color: STATUS.warning, lineHeight: "1.5" }}>No vehicle assigned</span>
            </div>
          )}
          <button
            className="mt-2.5 w-full py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
            style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}
            onClick={onReassign}
          >
            <ArrowUpRight size={11} />
            {driver.assignedVehicle ? "Reassign Vehicle" : "Assign Vehicle"}
          </button>
        </div>

        {/* Actions */}
        <div style={sectionStyle}>
          <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
            ACTIONS
          </span>
          <div className="space-y-2">
            <button
              className="w-full p-3 rounded-xl flex items-center gap-3 transition-colors text-left"
              style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
              onClick={onViewHistory}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${BRAND.green}20`}
              onMouseLeave={e => e.currentTarget.style.borderColor = t.borderSubtle}
            >
              <History size={14} style={{ color: t.iconSecondary }} />
              <div>
                <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  View Full History
                </span>
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                  All trips, earnings, ratings
                </span>
              </div>
            </button>
            {driver.status === "suspended" ? (
              <button
                className="w-full p-3 rounded-xl flex items-center gap-3 transition-colors text-left"
                style={{ background: `${BRAND.green}06`, border: `1px solid ${BRAND.green}10` }}
                onClick={onReactivate}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${BRAND.green}25`}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${BRAND.green}10`}
              >
                <Check size={14} style={{ color: BRAND.green }} />
                <div>
                  <span className="block" style={{ ...TY.body, fontSize: "12px", color: BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    Reactivate Driver
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                    Restore to active dispatch pool
                  </span>
                </div>
              </button>
            ) : (
              <button
                className="w-full p-3 rounded-xl flex items-center gap-3 transition-colors text-left"
                style={{ background: `${STATUS.error}04`, border: `1px solid ${STATUS.error}08` }}
                onClick={onSuspend}
                onMouseEnter={e => e.currentTarget.style.borderColor = `${STATUS.error}25`}
                onMouseLeave={e => e.currentTarget.style.borderColor = `${STATUS.error}08`}
              >
                <AlertTriangle size={14} style={{ color: STATUS.error }} />
                <div>
                  <span className="block" style={{ ...TY.body, fontSize: "12px", color: STATUS.error, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                    Suspend Driver
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                    Temporarily remove from dispatch
                  </span>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        {isApproved && driver.totalRides > 0 && (
          <div style={sectionStyle}>
            <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
              RECENT ACTIVITY
            </span>
            <div className="space-y-0">
              {[
                { time: "Today, 2:14 PM", text: "Completed ride · Lekki → VI", color: BRAND.green },
                { time: "Today, 11:30 AM", text: "Completed ride · Ikeja → Maryland", color: BRAND.green },
                { time: "Yesterday, 6:45 PM", text: "Went offline", color: t.textMuted },
                { time: "Yesterday, 9:02 AM", text: "Came online", color: STATUS.info },
              ].map((evt, i) => (
                <div key={i} className="flex gap-3 py-2.5" style={i > 0 ? { borderTop: `1px solid ${t.borderSubtle}` } : undefined}>
                  <div className="flex flex-col items-center shrink-0 pt-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: evt.color }} />
                  </div>
                  <div className="min-w-0">
                    <span className="block truncate" style={{ ...TY.body, fontSize: "11px", color: t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                      {evt.text}
                    </span>
                    <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                      {evt.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// MAIN: FLEET DRIVERS VIEW
// ═══════════════════════════════════════════════════════════════════════════

export function FleetDrivers() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const { deepLink, consumeDeepLink } = useFleetContext();

  // State
  const [filter, setFilter] = useState<FilterId>("all");
  const [sortBy, setSortBy] = useState<SortId>("earnings");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showInviteSheet, setShowInviteSheet] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "info" | "error" } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const searchRef = useRef<HTMLInputElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  const drivers = MOCK_DRIVERS;
  const vehicles = MOCK_VEHICLES;

  // Deep-link: auto-select driver from dashboard navigation
  useEffect(() => {
    if (deepLink && deepLink.entityType === "driver") {
      const exists = drivers.some(d => d.id === deepLink.entityId);
      if (exists) {
        setSelectedDriverId(deepLink.entityId);
        setFilter("all");
      }
      consumeDeepLink();
    }
  }, [deepLink, consumeDeepLink, drivers]);

  // Derived counts
  const counts = useMemo(() => ({
    all: drivers.length,
    online: drivers.filter(d => d.status === "online").length,
    on_trip: drivers.filter(d => d.status === "on_trip").length,
    offline: drivers.filter(d => d.status === "offline" && d.verificationStatus === "approved").length,
    suspended: drivers.filter(d => d.status === "suspended").length,
    pending: drivers.filter(d => d.verificationStatus !== "approved").length,
  }), [drivers]);

  // Filter + search + sort
  const filteredDrivers = useMemo(() => {
    let list = [...drivers];

    // Filter
    if (filter === "online") list = list.filter(d => d.status === "online");
    else if (filter === "on_trip") list = list.filter(d => d.status === "on_trip");
    else if (filter === "offline") list = list.filter(d => d.status === "offline" && d.verificationStatus === "approved");
    else if (filter === "suspended") list = list.filter(d => d.status === "suspended");
    else if (filter === "pending") list = list.filter(d => d.verificationStatus !== "approved");

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || (d.assignedVehicle?.toLowerCase().includes(q)));
    }

    // Sort
    list.sort((a, b) => {
      switch (sortBy) {
        case "earnings": return b.earningsThisWeek - a.earningsThisWeek;
        case "rating": return b.rating - a.rating;
        case "rides": return b.totalRides - a.totalRides;
        case "name": return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

    return list;
  }, [drivers, filter, searchQuery, sortBy]);

  const selectedDriver = drivers.find(d => d.id === selectedDriverId) ?? null;

  // Handlers
  const showToastFn = useCallback((msg: string, type: "success" | "info" | "error" = "success") => {
    setToast({ msg, type });
  }, []);

  const handleSelectDriver = useCallback((id: string) => {
    setSelectedDriverId(prev => prev === id ? null : id);
  }, []);

  const handleFilterFromKPI = useCallback((f: FilterId) => {
    setFilter(prev => prev === f ? "all" : f);
  }, []);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus search on open
  useEffect(() => {
    if (showSearch) searchRef.current?.focus();
  }, [showSearch]);

  const sortOptions: { id: SortId; label: string }[] = [
    { id: "earnings", label: "Earnings ↓" },
    { id: "rating", label: "Rating ↓" },
    { id: "rides", label: "Rides ↓" },
    { id: "name", label: "Name A–Z" },
  ];

  // ─── Empty state (0 drivers) ────────────────────────────────────────────

  if (isLoading) return <TableSkeleton />;
  if (isError) return <ErrorState onRetry={() => { setIsError(false); setIsLoading(true); setTimeout(() => setIsLoading(false), 500); }} />;

  if (drivers.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
          <Users size={28} style={{ color: t.iconMuted }} />
        </div>
        <span className="block mb-2" style={{ ...TY.sub, fontSize: "16px", color: t.text, lineHeight: "1.3" }}>
          No drivers yet
        </span>
        <span className="block text-center mb-6" style={{ ...TY.bodyR, fontSize: "13px", color: t.textMuted, lineHeight: "1.5", maxWidth: 280 }}>
          Invite your first driver to start building your fleet
        </span>
        <button
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl transition-opacity hover:opacity-90"
          style={{ background: BRAND.green, ...TY.body, fontSize: "13px", color: "#fff", lineHeight: "1.4", letterSpacing: "-0.02em" }}
          onClick={() => setShowInviteSheet(true)}
        >
          <UserPlus size={14} />
          Invite Driver
        </button>
      </div>
    );
  }

  // ─── Main Layout ────────────────────────────────────────────────────────

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      {/* Top Section: KPIs + Filters */}
      <div className="shrink-0 px-4 pt-4 pb-0 sm:px-5 sm:pt-5">
        {/* KPI Strip */}
        <div className="flex gap-2.5 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          <KPITile label="Total Drivers" value={counts.all} color={t.textSecondary} active={filter === "all"} onClick={() => handleFilterFromKPI("all")} delay={0} />
          <KPITile label="Online" value={counts.online} color={STATUS.info} active={filter === "online"} onClick={() => handleFilterFromKPI("online")} delay={STAGGER} />
          <KPITile label="On Trip" value={counts.on_trip} color={BRAND.green} active={filter === "on_trip"} onClick={() => handleFilterFromKPI("on_trip")} delay={STAGGER * 2} />
          <KPITile label="Pending" value={counts.pending} color={STATUS.warning} active={filter === "pending"} onClick={() => handleFilterFromKPI("pending")} delay={STAGGER * 3} />
          {counts.suspended > 0 && (
            <KPITile label="Suspended" value={counts.suspended} color={STATUS.error} active={filter === "suspended"} onClick={() => handleFilterFromKPI("suspended")} delay={STAGGER * 4} />
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex-1 flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {(["all", "online", "on_trip", "offline", "suspended", "pending"] as FilterId[]).map(f => (
              <FilterPill
                key={f}
                label={f === "all" ? "All" : f === "on_trip" ? "On Trip" : f.charAt(0).toUpperCase() + f.slice(1)}
                count={counts[f]}
                active={filter === f}
                onClick={() => setFilter(f)}
              />
            ))}
          </div>

          {/* Search toggle */}
          <button
            className="p-2 rounded-lg shrink-0 transition-colors"
            style={{ background: showSearch ? `${BRAND.green}12` : "transparent", border: `1px solid ${showSearch ? `${BRAND.green}20` : "transparent"}` }}
            onClick={() => { setShowSearch(!showSearch); if (showSearch) setSearchQuery(""); }}
          >
            <Search size={14} style={{ color: showSearch ? BRAND.green : t.iconMuted }} />
          </button>

          {/* Sort */}
          <div className="relative" ref={sortRef}>
            <button
              className="p-2 rounded-lg shrink-0 transition-colors"
              style={{ background: showSortDropdown ? `${BRAND.green}12` : "transparent", border: `1px solid ${showSortDropdown ? `${BRAND.green}20` : "transparent"}` }}
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <SlidersHorizontal size={14} style={{ color: showSortDropdown ? BRAND.green : t.iconMuted }} />
            </button>
            <AnimatePresence>
              {showSortDropdown && (
                <motion.div
                  className="absolute right-0 top-full mt-1 w-40 rounded-xl py-1 z-30"
                  style={{
                    background: isDark ? "rgba(22,22,24,0.97)" : "#fff",
                    border: `1px solid ${t.borderSubtle}`,
                    boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.5)" : "0 8px 32px rgba(0,0,0,0.12)",
                  }}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                >
                  {sortOptions.map(opt => (
                    <button
                      key={opt.id}
                      className="w-full px-3.5 py-2 text-left flex items-center gap-2 transition-colors"
                      style={{ background: sortBy === opt.id ? t.greenBg : "transparent" }}
                      onClick={() => { setSortBy(opt.id); setShowSortDropdown(false); }}
                      onMouseEnter={e => { if (sortBy !== opt.id) e.currentTarget.style.background = t.surfaceHover; }}
                      onMouseLeave={e => { if (sortBy !== opt.id) e.currentTarget.style.background = "transparent"; }}
                    >
                      {sortBy === opt.id && <Check size={11} style={{ color: BRAND.green }} />}
                      <span style={{ ...TY.body, fontSize: "12px", color: sortBy === opt.id ? BRAND.green : t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Invite — compact labeled button (Linear "New Issue" pattern) */}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg shrink-0 transition-all"
            style={{
              background: BRAND.green,
              border: `1px solid ${BRAND.green}`,
              ...TY.body, fontSize: "11px", color: "#fff", lineHeight: "1.4", letterSpacing: "-0.02em",
            }}
            onClick={() => setShowInviteSheet(true)}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            <UserPlus size={12} />
            <span className="hidden sm:inline">Invite</span>
          </button>
        </div>

        {/* Search Input (animated) */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              className="mb-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: t.iconMuted }} />
                <input
                  ref={searchRef}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl outline-none"
                  style={{
                    background: t.surface,
                    border: `1px solid ${t.borderSubtle}`,
                    ...TY.body,
                    fontSize: "12px",
                    color: t.text,
                    lineHeight: "1.4",
                    letterSpacing: "-0.02em",
                  }}
                  placeholder="Search by name or vehicle…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md"
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={12} style={{ color: t.iconMuted }} />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content: Table + footer */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
            {filteredDrivers.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center py-16 px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                  <Search size={18} style={{ color: t.iconMuted }} />
                </div>
                <span className="block mb-1" style={{ ...TY.body, fontSize: "13px", color: t.textSecondary, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                  No drivers match
                </span>
                <span className="block text-center mb-4" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
                  Try a different filter or search term
                </span>
                <button
                  className="px-4 py-2 rounded-xl transition-colors"
                  style={{ background: t.surface, border: `1px solid ${t.borderSubtle}`, ...TY.body, fontSize: "12px", color: BRAND.green, lineHeight: "1.4", letterSpacing: "-0.02em" }}
                  onClick={() => { setFilter("all"); setSearchQuery(""); }}
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <DriverTable
                drivers={filteredDrivers}
                selectedId={selectedDriverId}
                onSelect={handleSelectDriver}
                sortBy={sortBy}
                onSort={setSortBy}
              />
            )}
          </div>

          {/* Row count footer (Linear/Stripe pattern) */}
          <div className="shrink-0 px-4 pb-3 sm:px-5 sm:pb-4 pt-2" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
            <div className="flex items-center justify-between px-1">
              <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint, lineHeight: "1.4" }}>
                {filteredDrivers.length === drivers.length
                  ? `${drivers.length} drivers`
                  : `Showing ${filteredDrivers.length} of ${drivers.length}`}
              </span>
              {filter !== "all" || searchQuery ? (
                <button
                  className="transition-colors"
                  style={{ ...TY.bodyR, fontSize: "11px", color: BRAND.green, lineHeight: "1.4" }}
                  onClick={() => { setFilter("all"); setSearchQuery(""); }}
                >
                  Clear filters
                </button>
              ) : null}
            </div>
          </div>
      </div>

      {/* Detail Drawer — absolute overlay, not in flex flow */}
      <DetailDrawer open={!!selectedDriver} onClose={() => setSelectedDriverId(null)}>
        {selectedDriver && (
          <DriverDetailPanel
            driver={selectedDriver}
            onClose={() => setSelectedDriverId(null)}
            onReassign={() => setShowReassignModal(true)}
            onSuspend={() => setShowSuspendModal(true)}
            onReactivate={() => setShowReactivateModal(true)}
            onViewHistory={() => setShowHistoryModal(true)}
            showToast={showToastFn}
          />
        )}
      </DetailDrawer>

      {/* Modals */}
      <AnimatePresence>
        {showInviteSheet && (
          <InviteDriverSheet
            onClose={() => setShowInviteSheet(false)}
            onSend={(name, phone) => {
              setShowInviteSheet(false);
              showToastFn(`Invite sent to ${name}`, "success");
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReassignModal && selectedDriver && (
          <ReassignVehicleModal
            driver={selectedDriver}
            vehicles={vehicles}
            onAssign={(vehicleId) => {
              setShowReassignModal(false);
              const v = vehicles.find(veh => veh.id === vehicleId);
              showToastFn(`Assigned ${v?.make} ${v?.model} to ${selectedDriver.name}`, "success");
            }}
            onClose={() => setShowReassignModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuspendModal && selectedDriver && (
          <ConfirmModal
            title="Suspend Driver"
            message={`${selectedDriver.name} will be immediately removed from dispatch and won't receive new trip requests. You can reactivate them later.`}
            confirmLabel="Suspend"
            destructive
            onConfirm={() => {
              setShowSuspendModal(false);
              showToastFn(`${selectedDriver.name} has been suspended`, "error");
            }}
            onCancel={() => setShowSuspendModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReactivateModal && selectedDriver && (
          <ConfirmModal
            title="Reactivate Driver"
            message={`${selectedDriver.name} will be restored to the active dispatch pool and can start receiving trip requests again.`}
            confirmLabel="Reactivate"
            onConfirm={() => {
              setShowReactivateModal(false);
              showToastFn(`${selectedDriver.name} has been reactivated`, "success");
            }}
            onCancel={() => setShowReactivateModal(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHistoryModal && selectedDriver && (
          <DriverHistoryModal
            driver={selectedDriver}
            onClose={() => setShowHistoryModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.msg}
            type={toast.type}
            onDismiss={() => setToast(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}