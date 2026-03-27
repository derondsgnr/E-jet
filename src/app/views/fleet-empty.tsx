/**
 * FLEET OWNER — EMPTY STATE DASHBOARD
 *
 * Shown after onboarding but before first ride completes.
 * Never a blank page — shows setup progress + next actions.
 *
 * AFFORDANCE AUDIT — every element is interactive, no dead ends:
 *   • Setup checklist: tap incomplete steps → expand with actions
 *   • What's Next cards: tap → inline action (invite form, resend toast)
 *   • KPI tiles: tap → navigate to section or show tooltip
 *   • Payout card: link to bank settings
 *   • Pending items: resend/cancel actions
 *   • Quick Actions: all wired to modals/sheets/toasts
 *   • Fleet Health: tap → navigate to relevant section
 *   • Help beacon: always accessible
 *   • Activity feed: shows real-time status of invited drivers
 *
 * Same split layout as Variation E but with zero-data content.
 */

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check, Circle, Car, UserPlus, Calendar, Wallet,
  ArrowRight, Copy, ChevronRight, ChevronDown, AlertTriangle,
  Building2, CreditCard, Route, Users, Plus, X,
  HelpCircle, ExternalLink, RotateCw, Mail, Clock,
  Settings, MessageCircle, Sparkles, Link2,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import { useFleetContext, type FleetNavId } from "./fleet-context";
import { StatusDot } from "../components/fleet/driver-card";
import { InviteDriverSheet } from "../components/fleet/invite-driver-sheet";
import { AddVehicleSheet } from "../components/fleet/add-vehicle-sheet";
import { Toast } from "../components/shared/toast";

const STAGGER = 0.04;


// ─── Clipboard helper ───────────────────────────────────────────────────────

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


// Toast → shared component (see imports above)


// ═══════════════════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════���═══════════════════

export function FleetEmpty() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const { setActiveNav } = useFleetContext();

  // ── Toast state ─────────────────────────────────────────────────────
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);
  const showToast = useCallback((message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Modal state ─────────────────────────────────────────────────────
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);

  // ── Expanded checklist step ─────────────────────────────────────────
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  // ── Setup steps ─────────────────────────────────────────────────────
  const SETUP_STEPS = [
    {
      id: "profile", label: "Business profile", detail: "Completed",
      done: true, icon: Building2,
      expandedContent: null,
      action: { label: "Edit profile", onClick: () => { setActiveNav("settings"); showToast("Opening settings...", "info"); } },
    },
    {
      id: "bank", label: "Bank account", detail: "GTBank · ••••4521",
      done: true, icon: CreditCard,
      expandedContent: null,
      action: { label: "Change bank", onClick: () => { setActiveNav("settings"); showToast("Opening payment settings...", "info"); } },
    },
    {
      id: "invite", label: "Driver invited", detail: "emeka@email.com · Awaiting signup",
      done: true, icon: Users,
      expandedContent: "Invite sent 2 hours ago. Driver hasn't signed up yet.",
      action: { label: "Resend invite", onClick: () => showToast("Invite resent to emeka@email.com", "success") },
    },
    {
      id: "driver_verified", label: "Driver verified",
      detail: "Waiting for driver to complete signup",
      done: false, icon: Car,
      expandedContent: "Once your driver signs up, they'll complete KYC verification and register their vehicle. This usually takes 24–48 hours.",
      action: { label: "Resend invite", onClick: () => showToast("Invite resent to emeka@email.com", "success") },
    },
    {
      id: "ride", label: "First ride completed",
      detail: "Happens automatically once a driver takes a trip",
      done: false, icon: Route,
      expandedContent: "This step completes on its own — once a verified driver finishes their first ride, your dashboard will switch to the active view with live earnings.",
      action: null,
    },
  ];

  const completedCount = SETUP_STEPS.filter(s => s.done).length;

  // ── What's Next ─────────────────────────────────────────────────────
  const WHATS_NEXT = [
    {
      id: "driver_signup",
      title: "Waiting for driver signup",
      detail: "Invite sent to emeka@email.com. They'll register their vehicle during signup.",
      action: "Resend invite",
      onClick: () => showToast("Invite resent to emeka@email.com", "success"),
      secondaryAction: "Copy invite link",
      onSecondaryClick: () => { copyToClipboard("https://jet.ng/invite/abc123"); showToast("Invite link copied", "info"); },
      icon: Users,
      color: STATUS.info,
    },
    {
      id: "vehicle",
      title: "Add a vehicle",
      detail: "Register a vehicle from your fleet. Assign it to a driver once they sign up.",
      action: "Add vehicle",
      onClick: () => setShowVehicleModal(true),
      icon: Car,
      color: t.textSecondary,
    },
    {
      id: "invite",
      title: "Invite more drivers",
      detail: "More drivers = more rides = more earnings. Each driver registers their own vehicle.",
      action: "Send invite",
      onClick: () => setShowInviteModal(true),
      icon: UserPlus,
      color: BRAND.green,
    },
  ];

  // ── Quick Actions ───────────────────────────────────────────────────
  const QUICK_ACTIONS = [
    { icon: UserPlus, label: "Invite Driver", onClick: () => setShowInviteModal(true) },
    { icon: Plus, label: "Add Vehicle", onClick: () => setShowVehicleModal(true) },
    { icon: Link2, label: "Copy Invite Link", onClick: () => { copyToClipboard("https://jet.ng/invite/abc123"); showToast("Invite link copied to clipboard", "info"); } },
    { icon: Settings, label: "Fleet Settings", onClick: () => setActiveNav("settings") },
  ];

  // ── KPI tiles navigation mapping ───────────────────────────────────
  const KPI_TILES: { label: string; value: string; icon: typeof Wallet; navTo: FleetNavId; tooltip: string }[] = [
    { label: "Earnings", value: "₦0", icon: Wallet, navTo: "earnings", tooltip: "Appears after first ride" },
    { label: "Rides", value: "0", icon: Route, navTo: "dashboard", tooltip: "Tracked per driver" },
    { label: "Vehicles", value: "0", icon: Car, navTo: "vehicles", tooltip: "Add or wait for drivers" },
    { label: "Drivers", value: "0", icon: Users, navTo: "drivers", tooltip: "Invite to grow" },
  ];

  // ── Activity feed ──────────────────────────────────────────────────
  const ACTIVITY = [
    { time: "2h ago", event: "Invite sent to emeka@email.com", icon: Mail, color: STATUS.info },
    { time: "2h ago", event: "Fleet setup completed", icon: Check, color: BRAND.green },
    { time: "2h ago", event: "Bank account verified", icon: CreditCard, color: BRAND.green },
  ];


  return (
    <div className="flex flex-col md:flex-row h-full relative">

      {/* ── LEFT: Main content ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-5">

        {/* ── Welcome header ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="block mb-1" style={{
            fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
            fontSize: "20px", letterSpacing: "-0.03em", color: t.text, lineHeight: "1.2",
          }}>
            Welcome, Chidi
          </span>
          <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted, lineHeight: "1.5" }}>
            Your fleet is almost ready. Complete the remaining steps to start earning.
          </span>
        </motion.div>


        {/* ── Estimated Timeline Banner ─────────────────���────────────── */}
        <motion.div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: isDark ? `${STATUS.info}06` : `${STATUS.info}04`,
            border: `1px solid ${isDark ? `${STATUS.info}12` : `${STATUS.info}08`}`,
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.35 }}
        >
          <Clock size={14} style={{ color: STATUS.info }} />
          <div className="flex-1">
            <span style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4" }}>
              Most fleets get their first ride within 48 hours
            </span>
            <span className="block" style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted, lineHeight: "1.5" }}>
              Once your driver completes signup and verification, they'll start receiving ride requests.
            </span>
          </div>
        </motion.div>


        {/* ── Setup Progress ───────────────────────────────────────────── */}
        <motion.div
          className="rounded-2xl overflow-hidden"
          style={{
            background: isDark
              ? "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.015) 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.88) 100%)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`,
            boxShadow: isDark
              ? "0 2px 12px rgba(0,0,0,0.2)"
              : "0 2px 12px rgba(0,0,0,0.04)",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.4 }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between"
            style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}>
            <span style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>
              Setup Progress
            </span>
            <span style={{
              ...TY.body, fontSize: "11px", color: BRAND.green, lineHeight: "1.4",
            }}>
              {completedCount}/{SETUP_STEPS.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="px-4 pt-3 pb-1">
            <div
              className="h-1 rounded-full overflow-hidden"
              style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: BRAND.green }}
                initial={{ width: 0 }}
                animate={{ width: `${(completedCount / SETUP_STEPS.length) * 100}%` }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* Steps — interactive */}
          <div className="px-4 py-2">
            {SETUP_STEPS.map((step, i) => {
              const isExpanded = expandedStep === step.id;

              return (
                <motion.div
                  key={step.id}
                  style={{
                    borderBottom: i < SETUP_STEPS.length - 1
                      ? `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`
                      : "none",
                  }}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                >
                  {/* Step row — clickable */}
                  <button
                    className="w-full flex items-center gap-3 py-2.5 cursor-pointer"
                    onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                  >
                    {step.done ? (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: `${BRAND.green}12` }}>
                        <Check size={11} style={{ color: BRAND.green }} />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                        style={{ border: `1.5px solid ${t.borderSubtle}` }}>
                        <Circle size={8} style={{ color: t.textFaint }} />
                      </div>
                    )}

                    <div className="flex-1 min-w-0 text-left">
                      <span className="block" style={{
                        ...TY.body, fontSize: "11px",
                        color: step.done ? t.textMuted : t.text,
                        lineHeight: "1.4",
                      }}>{step.label}</span>
                      <span style={{
                        ...TY.bodyR, fontSize: "9px",
                        color: step.done ? t.textFaint : t.textMuted,
                        lineHeight: "1.5",
                      }}>{step.detail}</span>
                    </div>

                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ChevronDown size={12} style={{ color: t.textFaint }} />
                    </motion.div>
                  </button>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="pl-8 pb-3"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: "hidden" }}
                      >
                        {step.expandedContent && (
                          <span className="block mb-2" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                            {step.expandedContent}
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          {step.action && (
                            <button
                              onClick={(e) => { e.stopPropagation(); step.action!.onClick(); }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg cursor-pointer"
                              style={{
                                background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                                border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                              }}
                            >
                              <span style={{ ...TY.body, fontSize: "9px", color: t.textSecondary, lineHeight: "1.4" }}>
                                {step.action.label}
                              </span>
                              <ArrowRight size={9} style={{ color: t.textFaint }} />
                            </button>
                          )}
                          {step.id === "ride" && (
                            <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
                              This step completes automatically.
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>


        {/* ── Separator ────────────────────────────────────────────────── */}
        <div className="h-px" style={{ background: `linear-gradient(90deg, ${t.borderSubtle}, transparent 80%)` }} />


        {/* ── What's Next ──────────────────────────────────────────────── */}
        <div>
          <span className="block px-1 mb-2.5" style={{
            ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4",
          }}>
            What's Next
          </span>

          <div className="space-y-3">
            {WHATS_NEXT.map((item, i) => (
              <motion.div
                key={item.id}
                className="flex items-start gap-3 p-4 rounded-2xl"
                style={{
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                  background: isDark ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.6)",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.06, duration: 0.35 }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: `${item.color}08`,
                    border: `1px solid ${item.color}10`,
                  }}
                >
                  <item.icon size={15} style={{ color: item.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block mb-0.5" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>
                    {item.title}
                  </span>
                  <span className="block mb-2.5" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                    {item.detail}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={item.onClick}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg cursor-pointer"
                      style={{
                        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                      }}
                    >
                      <span style={{ ...TY.body, fontSize: "10px", color: item.color, lineHeight: "1.4" }}>
                        {item.action}
                      </span>
                      <ArrowRight size={10} style={{ color: item.color }} />
                    </button>
                    {item.secondaryAction && (
                      <button
                        onClick={item.onSecondaryClick}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg cursor-pointer"
                        style={{
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                        }}
                      >
                        <Copy size={9} style={{ color: t.textFaint }} />
                        <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted, lineHeight: "1.4" }}>
                          {item.secondaryAction}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>


        {/* ── Separator ────────────────────────────────────────────────── */}
        <div className="h-px" style={{ background: `linear-gradient(90deg, ${t.borderSubtle}, transparent 80%)` }} />


        {/* ── KPI tiles — interactive, navigate to sections ─────────────── */}
        <div>
          <span className="block px-1 mb-2.5" style={{
            ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4",
          }}>
            Your Fleet
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {KPI_TILES.map((kpi, i) => (
              <motion.button
                key={kpi.label}
                className="px-3.5 py-3 rounded-xl text-left cursor-pointer group"
                style={{
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                  background: isDark ? "rgba(255,255,255,0.012)" : "rgba(255,255,255,0.5)",
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
                whileHover={{
                  borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                }}
                onClick={() => setActiveNav(kpi.navTo)}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <kpi.icon size={10} style={{ color: t.textFaint }} />
                    <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>{kpi.label}</span>
                  </div>
                  <ChevronRight size={9} style={{ color: t.textGhost }} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="block" style={{
                  fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                  fontSize: "20px", letterSpacing: "-0.03em",
                  color: t.textFaint, lineHeight: "1.2",
                }}>
                  {kpi.value}
                </span>
                <span style={{ ...TY.bodyR, fontSize: "8px", color: t.textGhost, lineHeight: "1.5" }}>
                  {kpi.tooltip}
                </span>
              </motion.button>
            ))}
          </div>
        </div>


        <div className="h-16" />
      </div>


      {/* ── RIGHT: Decision Panel ──────────────────────────────────────── */}
      {/* Gradient Separator (Linear/Vercel style) */}
      <div className="hidden md:block w-px self-stretch" style={{ background: `linear-gradient(to bottom, transparent, ${t.borderSubtle}, transparent)` }} />
      <div className="md:hidden h-px" style={{ background: `linear-gradient(to right, transparent, ${t.borderSubtle}, transparent)` }} />
      <div
        className="shrink-0 md:w-[300px] overflow-y-auto md:h-full"
        style={{
          background: isDark
            ? "linear-gradient(180deg, rgba(255,255,255,0.008) 0%, transparent 100%)"
            : "linear-gradient(180deg, rgba(0,0,0,0.006) 0%, transparent 100%)",
        }}
      >
        <div className="p-4 space-y-4">

          {/* ── Payout placeholder ──────────────────────────────────────── */}
          <motion.div
            className="rounded-2xl p-4"
            style={{
              border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
              background: isDark ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.6)",
            }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.35 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={12} style={{ color: t.textFaint }} />
              <span style={{ ...TY.body, fontSize: "10px", color: t.textFaint, lineHeight: "1.4" }}>First Payout</span>
            </div>
            <span className="block mb-1" style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "22px", letterSpacing: "-0.03em", color: t.textFaint, lineHeight: "1.2",
            }}>
              ₦0
            </span>
            <span className="block mb-3" style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, lineHeight: "1.5" }}>
              Your first payout will appear here once rides start coming in. Payouts are processed weekly.
            </span>
            <button
              onClick={() => setActiveNav("earnings")}
              className="flex items-center gap-1 cursor-pointer"
            >
              <span style={{ ...TY.body, fontSize: "9px", color: STATUS.info, lineHeight: "1.4" }}>
                View payout schedule
              </span>
              <ArrowRight size={9} style={{ color: STATUS.info }} />
            </button>
          </motion.div>


          {/* ── Separator ──────────────────────────────────────────────── */}
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.borderSubtle}, transparent)` }} />


          {/* ── Pending items — with actions ────────────────────────────── */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <AlertTriangle size={11} style={{ color: STATUS.warning }} />
              <span style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "10px", letterSpacing: "-0.02em", color: t.textSecondary, lineHeight: "1.2",
              }}>
                Pending
              </span>
            </div>

            <div className="space-y-1">
              <motion.div
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                style={{
                  border: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
                }}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.3 }}
              >
                <Users size={12} style={{ color: STATUS.info }} />
                <div className="flex-1 min-w-0">
                  <span className="block" style={{ ...TY.body, fontSize: "10px", color: t.text, lineHeight: "1.4" }}>
                    Driver invite sent
                  </span>
                  <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textMuted, lineHeight: "1.5" }}>
                    emeka@email.com · Awaiting signup
                  </span>
                </div>
                {/* Inline actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => showToast("Invite resent to emeka@email.com", "success")}
                    className="p-1.5 rounded-md cursor-pointer"
                    style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
                    title="Resend"
                  >
                    <RotateCw size={10} style={{ color: t.textFaint }} />
                  </button>
                  <button
                    onClick={() => { copyToClipboard("https://jet.ng/invite/abc123"); showToast("Invite link copied", "info"); }}
                    className="p-1.5 rounded-md cursor-pointer"
                    style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
                    title="Copy link"
                  >
                    <Copy size={10} style={{ color: t.textFaint }} />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>


          {/* ── Separator ──────────────────────────────────────────────── */}
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.borderSubtle}, transparent)` }} />


          {/* ── Quick Actions — all wired ───────────────────────────────── */}
          <div>
            <span className="block mb-2" style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "10px", letterSpacing: "-0.02em", color: t.textFaint, lineHeight: "1.2",
            }}>
              Quick Actions
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {QUICK_ACTIONS.map((action) => (
                <motion.button
                  key={action.label}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl cursor-pointer"
                  style={{
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
                    background: "transparent",
                    minHeight: 36,
                  }}
                  whileHover={{
                    backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                    borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                  }}
                  onClick={action.onClick}
                >
                  <action.icon size={11} style={{ color: t.textFaint }} />
                  <span style={{ ...TY.body, fontSize: "9px", color: t.textSecondary, lineHeight: "1.4" }}>{action.label}</span>
                </motion.button>
              ))}
            </div>
          </div>


          {/* ── Separator ──────────────────────────────────────────────── */}
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.borderSubtle}, transparent)` }} />


          {/* ── Activity Feed ──────────────────────────────────────────── */}
          <div>
            <span className="block mb-2.5" style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "10px", letterSpacing: "-0.02em", color: t.textFaint, lineHeight: "1.2",
            }}>
              Recent Activity
            </span>
            <div className="space-y-0">
              {ACTIVITY.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-2.5 py-2"
                  style={{
                    borderBottom: i < ACTIVITY.length - 1
                      ? `1px solid ${isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"}`
                      : "none",
                  }}
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.04, duration: 0.25 }}
                >
                  <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: `${item.color}08` }}>
                    <item.icon size={9} style={{ color: item.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                      {item.event}
                    </span>
                    <span style={{ ...TY.bodyR, fontSize: "8px", color: t.textFaint, lineHeight: "1.5" }}>
                      {item.time}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>


          {/* ── Separator ──────────────────────────────────────────────── */}
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.borderSubtle}, transparent)` }} />


          {/* ── Fleet Health — interactive ──────────────────────────────── */}
          <div>
            <span className="block mb-2.5" style={{
              fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
              fontSize: "10px", letterSpacing: "-0.02em", color: t.textFaint, lineHeight: "1.2",
            }}>
              Fleet Health
            </span>
            <div className="space-y-1">
              {[
                { label: "Vehicles", value: "0 registered", dot: t.textFaint, navTo: "vehicles" as FleetNavId, action: "Add vehicle" },
                { label: "Drivers", value: "0 active", dot: t.textFaint, navTo: "drivers" as FleetNavId, action: "Invite driver" },
                { label: "Rating", value: "No data yet", dot: t.textFaint, navTo: "dashboard" as FleetNavId, action: null },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between py-1.5 rounded-lg cursor-pointer px-1.5 -mx-1.5"
                  onClick={() => {
                    if (item.action === "Add vehicle") setShowVehicleModal(true);
                    else if (item.action === "Invite driver") setShowInviteModal(true);
                    else setActiveNav(item.navTo);
                  }}
                  style={{ minHeight: 28 }}
                >
                  <div className="flex items-center gap-1.5">
                    <StatusDot color={item.dot} size={5} />
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.4" }}>
                      {item.value}
                    </span>
                    {item.action && (
                      <Plus size={9} style={{ color: t.textGhost }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>


          {/* ── Separator ──────────────────────────────────────────────── */}
          <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${t.borderSubtle}, transparent)` }} />


          {/* ── Help & Support ─────────────────────────────────────────── */}
          <motion.div
            className="rounded-xl p-3.5"
            style={{
              background: isDark ? "rgba(255,255,255,0.015)" : "rgba(0,0,0,0.012)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle size={12} style={{ color: t.textFaint }} />
              <span style={{
                fontFamily: "'Montserrat', sans-serif", fontWeight: 600,
                fontSize: "10px", letterSpacing: "-0.02em", color: t.textSecondary, lineHeight: "1.2",
              }}>Need Help?</span>
            </div>
            <div className="space-y-1.5">
              <button
                onClick={() => showToast("Opening fleet owner guide...", "info")}
                className="w-full flex items-center gap-2 py-1.5 cursor-pointer"
              >
                <Sparkles size={10} style={{ color: t.textFaint }} />
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                  Fleet owner quick start guide
                </span>
                <ExternalLink size={8} style={{ color: t.textGhost, marginLeft: "auto" }} />
              </button>
              <button
                onClick={() => showToast("Opening chat support...", "info")}
                className="w-full flex items-center gap-2 py-1.5 cursor-pointer"
              >
                <MessageCircle size={10} style={{ color: t.textFaint }} />
                <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                  Chat with support
                </span>
                <ExternalLink size={8} style={{ color: t.textGhost, marginLeft: "auto" }} />
              </button>
            </div>
          </motion.div>


          <div className="h-16" />
        </div>
      </div>


      {/* ── Modals ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showInviteModal && (
          <InviteDriverSheet
            onClose={() => setShowInviteModal(false)}
            onSend={(name, email) => {
              setShowInviteModal(false);
              showToast(`Invite sent to ${email}`, "success");
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showVehicleModal && (
          <AddVehicleSheet
            onClose={() => setShowVehicleModal(false)}
            onAdd={(make, plate) => {
              setShowVehicleModal(false);
              showToast(`${make} (${plate}) added — pending inspection`, "success");
            }}
          />
        )}
      </AnimatePresence>

      {/* ── Toast ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}