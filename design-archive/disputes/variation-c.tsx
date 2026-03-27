 /**
 * DISPUTE VARIATION C — "SPLIT COURT"
 *
 * Mental model: Balanced scales / courtroom proceedings.
 * Rider's perspective vs Driver's perspective, side by side.
 * Shared truth (system evidence) in the center.
 *
 * Layout: SLA bar │ Rider (left) │ Truth (center) │ Driver (right)
 *
 * Why this works: Every dispute has two sides. Seeing them
 * simultaneously creates the fastest path to a fair decision.
 * The "shared truth" column is the impartial judge — system data
 * that neither party can dispute.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Clock, AlertTriangle, ChevronRight, ArrowLeft,
  MessageSquare, FileText, Route, Camera, Star,
  Shield, CheckCircle2, XCircle, RefreshCcw, ArrowUpRight,
  Eye, Phone, User, Timer, Hash, Scale, ChevronDown,
  Zap, TrendingDown, TrendingUp,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";
import {
  DISPUTES, DISPUTE_STATS, CATEGORY_META, STATUS_META,
  formatNaira, type Dispute, type DisputeCategory,
} from "../../../config/dispute-mock-data";

const PRIORITY_COLOR: Record<string, string> = {
  critical: STATUS.error,
  high: "#F97316",
  medium: STATUS.warning,
  low: "#737373",
};

export function DisputeVariationC() {
  const { t } = useAdminTheme();
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [activeVerdict, setActiveVerdict] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AnimatePresence mode="wait">
        {!selected ? (
          /* ═══ QUEUE — DENSE GRID WITH URGENCY MAPPING ═══ */
          <motion.div
            key="grid"
            className="flex-1 overflow-y-auto scrollbar-hide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Urgency-mapped header */}
            <div className="p-5">
              <div className="max-w-[1200px] mx-auto">
                {/* Severity lanes */}
                {(["critical", "high", "medium", "low"] as const).map(severity => {
                  const items = DISPUTES.filter(d => d.priority === severity);
                  if (items.length === 0) return null;
                  const color = PRIORITY_COLOR[severity];

                  return (
                    <div key={severity} className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                        <span style={{ ...TY.label, fontSize: "9px", color, letterSpacing: "0.06em" }}>
                          {severity.toUpperCase()}
                        </span>
                        <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>
                          {items.length} dispute{items.length > 1 ? "s" : ""}
                        </span>
                        <div className="flex-1 h-px" style={{ background: `${color}15` }} />
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        {items.map((dispute, i) => {
                          const cm = CATEGORY_META[dispute.category];
                          const sm = STATUS_META[dispute.status];

                          return (
                            <motion.button
                              key={dispute.id}
                              className="rounded-2xl p-4 text-left transition-all group"
                              style={{
                                background: t.surfaceRaised,
                                border: `1px solid ${t.borderSubtle}`,
                                boxShadow: t.shadow,
                              }}
                              onClick={() => setSelected(dispute)}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.03 }}
                              onMouseEnter={e => (e.currentTarget.style.borderColor = `${color}30`)}
                              onMouseLeave={e => (e.currentTarget.style.borderColor = t.borderSubtle)}
                            >
                              {/* Top row: category + SLA */}
                              <div className="flex items-center justify-between mb-2">
                                <span className="px-2 py-0.5 rounded-md" style={{ ...TY.cap, fontSize: "9px", color: cm.color, background: `${cm.color}10` }}>
                                  {cm.label}
                                </span>
                                <div className="flex items-center gap-1">
                                  <Timer size={9} style={{ color: dispute.slaHoursLeft <= 4 ? STATUS.error : t.textFaint }} />
                                  <span style={{ ...TY.cap, fontSize: "9px", color: dispute.slaHoursLeft <= 4 ? STATUS.error : t.textFaint }}>
                                    {dispute.slaHoursLeft}h
                                  </span>
                                </div>
                              </div>

                              {/* Title */}
                              <span className="block mb-2" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                {dispute.title}
                              </span>

                              {/* Parties face-off mini */}
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${STATUS.info}12` }}>
                                    <span style={{ ...TY.cap, fontSize: "7px", color: STATUS.info }}>{dispute.rider.avatar}</span>
                                  </div>
                                  <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>{dispute.rider.rating}★</span>
                                </div>
                                <Scale size={10} style={{ color: t.textGhost }} />
                                <div className="flex items-center gap-1">
                                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${BRAND.green}12` }}>
                                    <span style={{ ...TY.cap, fontSize: "7px", color: BRAND.green }}>{dispute.driver.avatar}</span>
                                  </div>
                                  <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>{dispute.driver.rating}★</span>
                                </div>
                              </div>

                              {/* Footer */}
                              <div className="flex items-center gap-2">
                                <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{dispute.id}</span>
                                <span style={{ ...TY.cap, fontSize: "9px", color: sm.color }}>{sm.label}</span>
                                <span className="ml-auto" style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{dispute.evidence.length} evidence</span>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ═══ DETAIL — SPLIT COURT VIEW ═══ */
          <motion.div
            key={`court-${selected.id}`}
            className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* SLA + Context Bar */}
            <div className="flex items-center gap-4 px-5 py-3 shrink-0" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
              <button onClick={() => { setSelected(null); setActiveVerdict(null); }} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}>
                <ArrowLeft size={14} style={{ color: t.iconSecondary }} />
              </button>

              <div className="flex-1 flex items-center gap-3">
                <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>{selected.id}</span>
                <span className="px-2 py-0.5 rounded-md" style={{ ...TY.cap, fontSize: "9px", color: CATEGORY_META[selected.category].color, background: `${CATEGORY_META[selected.category].color}10` }}>
                  {CATEGORY_META[selected.category].label}
                </span>
                <div className="h-3.5 w-px" style={{ background: t.borderSubtle }} />
                <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{selected.title}</span>
              </div>

              {/* SLA countdown — prominent */}
              <div
                className="px-4 py-2 rounded-xl flex items-center gap-2"
                style={{
                  background: selected.slaHoursLeft <= 2 ? `${STATUS.error}10` : selected.slaHoursLeft <= 6 ? `${STATUS.warning}08` : t.surface,
                  border: `1px solid ${selected.slaHoursLeft <= 2 ? `${STATUS.error}20` : selected.slaHoursLeft <= 6 ? `${STATUS.warning}15` : t.borderSubtle}`,
                }}
              >
                <Timer size={14} style={{ color: selected.slaHoursLeft <= 2 ? STATUS.error : selected.slaHoursLeft <= 6 ? STATUS.warning : BRAND.green }} />
                <div>
                  <span className="block" style={{ ...TY.body, fontSize: "14px", color: selected.slaHoursLeft <= 2 ? STATUS.error : selected.slaHoursLeft <= 6 ? STATUS.warning : t.text }}>
                    {selected.slaHoursLeft}h
                  </span>
                  <span style={{ ...TY.cap, fontSize: "8px", color: t.textFaint }}>to SLA deadline</span>
                </div>
              </div>
            </div>

            {/* Trip context strip */}
            <div className="flex items-center gap-6 px-5 py-2.5 shrink-0" style={{ background: t.surface, borderBottom: `1px solid ${t.borderSubtle}` }}>
              <div className="flex items-center gap-2">
                <MapPin size={11} style={{ color: BRAND.green }} />
                <span style={{ ...TY.body, fontSize: "11px", color: t.textSecondary }}>{selected.trip.pickup} → {selected.trip.dropoff}</span>
              </div>
              <span style={{ ...TY.cap, fontSize: "10px", color: t.textMuted }}>{selected.trip.distance} · {selected.trip.duration}</span>
              <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{formatNaira(selected.trip.fare)}</span>
              {selected.trip.surgeMultiplier > 1 && <span style={{ ...TY.cap, fontSize: "10px", color: STATUS.warning }}>{selected.trip.surgeMultiplier}x surge</span>}
              <span style={{ ...TY.cap, fontSize: "10px", color: t.textMuted }}>{selected.trip.vehicleType} · {selected.trip.date}</span>
            </div>

            {/* ═══ THREE-COLUMN SPLIT ═══ */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
              {/* RIDER SIDE */}
              <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide p-5" style={{ borderRight: `1px solid ${t.borderSubtle}` }}>
                {/* Rider profile */}
                <motion.div
                  className="rounded-2xl p-4 mb-4"
                  style={{ background: `${STATUS.info}05`, border: `1px solid ${STATUS.info}12` }}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${STATUS.info}12` }}>
                      <span style={{ ...TY.body, fontSize: "14px", color: STATUS.info }}>{selected.rider.avatar}</span>
                    </div>
                    <div>
                      <span className="block" style={{ ...TY.sub, fontSize: "14px", color: t.text }}>{selected.rider.name}</span>
                      <span style={{ ...TY.cap, fontSize: "10px", color: STATUS.info }}>RIDER · Since {selected.rider.joinDate}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2 rounded-lg text-center" style={{ background: t.surface }}>
                      <span className="block" style={{ ...TY.body, fontSize: "16px", color: t.text }}>{selected.rider.rating}</span>
                      <span style={{ ...TY.cap, fontSize: "8px", color: t.textFaint }}>Rating</span>
                    </div>
                    <div className="p-2 rounded-lg text-center" style={{ background: t.surface }}>
                      <span className="block" style={{ ...TY.body, fontSize: "16px", color: t.text }}>{selected.rider.totalTrips}</span>
                      <span style={{ ...TY.cap, fontSize: "8px", color: t.textFaint }}>Trips</span>
                    </div>
                    <div className="p-2 rounded-lg text-center" style={{ background: t.surface }}>
                      <span className="block" style={{ ...TY.body, fontSize: "16px", color: selected.rider.disputeHistory === 0 ? BRAND.green : t.text }}>{selected.rider.disputeHistory}</span>
                      <span style={{ ...TY.cap, fontSize: "8px", color: t.textFaint }}>Disputes</span>
                    </div>
                  </div>
                </motion.div>

                {/* Rider's statement */}
                <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: STATUS.info, letterSpacing: "0.06em" }}>RIDER'S STATEMENT</span>
                <div className="rounded-xl p-3 mb-4" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}` }}>
                  <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textSecondary, lineHeight: "1.6" }}>
                    "{selected.description}"
                  </span>
                </div>

                {/* Rider's evidence */}
                <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: STATUS.info, letterSpacing: "0.06em" }}>RIDER'S EVIDENCE</span>
                <div className="space-y-2">
                  {selected.evidence.filter(e => e.source === "rider").map((ev, i) => (
                    <motion.div
                      key={ev.id}
                      className="rounded-xl p-3"
                      style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}` }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      <span className="block mb-0.5" style={{ ...TY.body, fontSize: "11px", color: STATUS.info }}>{ev.label}</span>
                      <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{ev.summary}</span>
                    </motion.div>
                  ))}
                  {selected.evidence.filter(e => e.source === "rider").length === 0 && (
                    <div className="rounded-xl p-4 text-center" style={{ background: t.surface }}>
                      <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint }}>No rider-submitted evidence</span>
                    </div>
                  )}
                </div>

                {/* Rider's timeline entries */}
                <span className="block mt-4 mb-2" style={{ ...TY.label, fontSize: "9px", color: STATUS.info, letterSpacing: "0.06em" }}>RIDER'S ACTIONS</span>
                {selected.timeline.filter(e => e.type === "rider").map(event => (
                  <div key={event.id} className="flex items-start gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: STATUS.info }} />
                    <div>
                      <span className="block" style={{ ...TY.body, fontSize: "11px", color: t.textSecondary }}>{event.title}</span>
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{event.detail}</span>
                      <span className="block" style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{event.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CENTER: SHARED TRUTH */}
              <div className="w-[320px] shrink-0 flex flex-col overflow-y-auto scrollbar-hide p-5" style={{ background: t.bgSubtle }}>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Scale size={14} style={{ color: t.textMuted }} />
                  <span style={{ ...TY.label, fontSize: "9px", color: t.textMuted, letterSpacing: "0.06em" }}>SHARED TRUTH</span>
                </div>

                {/* System evidence */}
                <div className="space-y-3 mb-5">
                  {selected.evidence.filter(e => e.source === "system").map((ev, i) => (
                    <motion.div
                      key={ev.id}
                      className="rounded-xl p-4"
                      style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15 + i * 0.06 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={12} style={{ color: t.iconSecondary }} />
                        <span style={{ ...TY.body, fontSize: "11px", color: t.text }}>{ev.label}</span>
                      </div>
                      <span className="block" style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: "1.6" }}>
                        {ev.summary}
                      </span>
                      {ev.timestamp && (
                        <span className="block mt-1" style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{ev.timestamp}</span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Verdict section */}
                <div className="mt-auto">
                  <span className="block mb-3 text-center" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>VERDICT</span>

                  <div className="space-y-2 mb-4">
                    {[
                      { id: "rider", label: "Favor Rider", desc: `Refund ${formatNaira(selected.trip.fare)}`, color: STATUS.info, icon: TrendingDown },
                      { id: "driver", label: "Favor Driver", desc: "Dismiss complaint", color: BRAND.green, icon: TrendingUp },
                      { id: "split", label: "Split Resolution", desc: "Partial adjustment", color: STATUS.warning, icon: Scale },
                      { id: "escalate", label: "Escalate", desc: "Senior ops review", color: STATUS.error, icon: AlertTriangle },
                    ].map(v => (
                      <motion.button
                        key={v.id}
                        className="w-full p-3.5 rounded-xl flex items-center gap-3 text-left transition-all"
                        style={{
                          background: activeVerdict === v.id ? `${v.color}12` : t.surfaceRaised,
                          border: `1px solid ${activeVerdict === v.id ? `${v.color}30` : t.borderSubtle}`,
                          boxShadow: activeVerdict === v.id ? `0 0 20px ${v.color}10` : "none",
                        }}
                        onClick={() => setActiveVerdict(activeVerdict === v.id ? null : v.id)}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${v.color}12` }}>
                          <v.icon size={16} style={{ color: v.color }} />
                        </div>
                        <div>
                          <span className="block" style={{ ...TY.body, fontSize: "12px", color: activeVerdict === v.id ? v.color : t.text }}>{v.label}</span>
                          <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>{v.desc}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Confirm button */}
                  {activeVerdict && (
                    <motion.button
                      className="w-full h-11 rounded-xl flex items-center justify-center gap-2"
                      style={{ background: `${BRAND.green}15`, border: `1px solid ${BRAND.green}25` }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <CheckCircle2 size={14} style={{ color: BRAND.green }} />
                      <span style={{ ...TY.body, fontSize: "12px", color: BRAND.green }}>Confirm Resolution</span>
                    </motion.button>
                  )}
                </div>
              </div>

              {/* DRIVER SIDE */}
              <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hide p-5" style={{ borderLeft: `1px solid ${t.borderSubtle}` }}>
                {/* Driver profile */}
                <motion.div
                  className="rounded-2xl p-4 mb-4"
                  style={{ background: `${BRAND.green}04`, border: `1px solid ${BRAND.green}10` }}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `${BRAND.green}12` }}>
                      <span style={{ ...TY.body, fontSize: "14px", color: BRAND.green }}>{selected.driver.avatar}</span>
                    </div>
                    <div>
                      <span className="block" style={{ ...TY.sub, fontSize: "14px", color: t.text }}>{selected.driver.name}</span>
                      <span style={{ ...TY.cap, fontSize: "10px", color: BRAND.green }}>DRIVER · Since {selected.driver.joinDate}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-2 rounded-lg text-center" style={{ background: t.surface }}>
                      <span className="block" style={{ ...TY.body, fontSize: "16px", color: selected.driver.rating < 4.3 ? STATUS.warning : t.text }}>{selected.driver.rating}</span>
                      <span style={{ ...TY.cap, fontSize: "8px", color: t.textFaint }}>Rating</span>
                    </div>
                    <div className="p-2 rounded-lg text-center" style={{ background: t.surface }}>
                      <span className="block" style={{ ...TY.body, fontSize: "16px", color: t.text }}>{selected.driver.totalTrips}</span>
                      <span style={{ ...TY.cap, fontSize: "8px", color: t.textFaint }}>Trips</span>
                    </div>
                    <div className="p-2 rounded-lg text-center" style={{ background: t.surface }}>
                      <span className="block" style={{ ...TY.body, fontSize: "16px", color: selected.driver.disputeHistory >= 5 ? STATUS.error : t.text }}>{selected.driver.disputeHistory}</span>
                      <span style={{ ...TY.cap, fontSize: "8px", color: t.textFaint }}>Disputes</span>
                    </div>
                  </div>
                </motion.div>

                {/* Driver's evidence */}
                <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: BRAND.green, letterSpacing: "0.06em" }}>DRIVER'S EVIDENCE</span>
                <div className="space-y-2 mb-4">
                  {selected.evidence.filter(e => e.source === "driver").map((ev, i) => (
                    <motion.div
                      key={ev.id}
                      className="rounded-xl p-3"
                      style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}` }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.05 }}
                    >
                      <span className="block mb-0.5" style={{ ...TY.body, fontSize: "11px", color: BRAND.green }}>{ev.label}</span>
                      <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{ev.summary}</span>
                    </motion.div>
                  ))}
                  {selected.evidence.filter(e => e.source === "driver").length === 0 && (
                    <div className="rounded-xl p-4 text-center" style={{ background: t.surface }}>
                      <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint }}>No driver-submitted evidence</span>
                    </div>
                  )}
                </div>

                {/* Driver's timeline entries */}
                <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: BRAND.green, letterSpacing: "0.06em" }}>DRIVER'S ACTIONS</span>
                {selected.timeline.filter(e => e.type === "driver").map(event => (
                  <div key={event.id} className="flex items-start gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: BRAND.green }} />
                    <div>
                      <span className="block" style={{ ...TY.body, fontSize: "11px", color: t.textSecondary }}>{event.title}</span>
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{event.detail}</span>
                      <span className="block" style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{event.timestamp}</span>
                    </div>
                  </div>
                ))}
                {selected.timeline.filter(e => e.type === "driver").length === 0 && (
                  <div className="rounded-xl p-3 text-center" style={{ background: t.surface }}>
                    <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textFaint }}>No driver actions recorded</span>
                  </div>
                )}

                {/* Driver risk signals */}
                {selected.driver.disputeHistory >= 3 && (
                  <motion.div
                    className="mt-4 p-3 rounded-xl"
                    style={{ background: `${STATUS.error}06`, border: `1px solid ${STATUS.error}12` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle size={12} style={{ color: STATUS.error }} />
                      <span style={{ ...TY.body, fontSize: "11px", color: STATUS.error }}>Risk Signal</span>
                    </div>
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>
                      {selected.driver.disputeHistory} previous disputes on record.
                      {selected.driver.rating < 4.3 ? ` Rating below 4.3 threshold.` : ""}
                    </span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
