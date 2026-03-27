 /**
 * DISPUTE VARIATION B — "TIMELINE THEATER"
 *
 * Mental model: Court proceedings — chronological truth.
 * The dispute is told as a story from ride request to complaint.
 *
 * Layout: Stats bar (top) │ Queue + Timeline (stacked, full-width)
 *
 * Why this works: Disputes are narratives. Understanding chronology
 * IS understanding truth. Each event card is a witness statement.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Clock, AlertTriangle, ChevronRight, ArrowLeft,
  MessageSquare, FileText, Route, Camera, Star,
  Shield, CheckCircle2, XCircle, RefreshCcw, ArrowUpRight,
  Eye, Phone, User, Timer, Activity, Zap, Radio,
  ChevronDown, Hash,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";
import {
  DISPUTES, DISPUTE_STATS, CATEGORY_META, STATUS_META,
  formatNaira, type Dispute, type TimelineEventType, type DisputeCategory,
} from "../../../config/dispute-mock-data";

const EVENT_STYLE: Record<TimelineEventType, { color: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }> = {
  system: { color: "#737373", icon: Activity },
  rider: { color: STATUS.info, icon: User },
  driver: { color: BRAND.green, icon: Shield },
  admin: { color: STATUS.warning, icon: Star },
  auto: { color: STATUS.error, icon: Zap },
};

const PRIORITY_COLOR: Record<string, string> = {
  critical: STATUS.error,
  high: "#F97316",
  medium: STATUS.warning,
  low: "#737373",
};

export function DisputeVariationB() {
  const { t } = useAdminTheme();
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [showResolution, setShowResolution] = useState(false);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ═══ TOP: STATS STRIP ═══ */}
      <div className="flex items-center gap-6 px-6 h-12 shrink-0" style={{ borderBottom: `1px solid ${t.borderSubtle}`, background: t.surface }}>
        {[
          { label: "Open", value: DISPUTE_STATS.total, color: t.text },
          { label: "Critical", value: DISPUTE_STATS.bySeverity.critical, color: STATUS.error },
          { label: "High", value: DISPUTE_STATS.bySeverity.high, color: "#F97316" },
          { label: "Avg resolve", value: `${DISPUTE_STATS.avgResolutionTime}h`, color: BRAND.green },
          { label: "SLA compliance", value: `${DISPUTE_STATS.slaCompliance}%`, color: DISPUTE_STATS.slaCompliance >= 90 ? BRAND.green : STATUS.warning },
          { label: "Resolved today", value: DISPUTE_STATS.resolvedToday.toString(), color: BRAND.green },
        ].map(s => (
          <div key={s.label} className="flex items-center gap-2">
            <span style={{ ...TY.body, fontSize: "13px", color: s.color }}>{s.value}</span>
            <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{s.label}</span>
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!selected ? (
          /* ═══ QUEUE VIEW — FULL WIDTH CARD LAYOUT ═══ */
          <motion.div
            key="queue"
            className="flex-1 overflow-y-auto scrollbar-hide p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="max-w-[1000px] mx-auto">
              {/* Category quick-stats */}
              <div className="grid grid-cols-5 gap-3 mb-6">
                {(Object.entries(CATEGORY_META) as [DisputeCategory, typeof CATEGORY_META["fare"]][]).map(([key, meta]) => {
                  const count = DISPUTE_STATS.byCategory[key];
                  return (
                    <motion.div
                      key={key}
                      className="rounded-xl p-3 text-center cursor-pointer transition-colors"
                      style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}` }}
                      whileHover={{ borderColor: `${meta.color}30` }}
                    >
                      <span className="block" style={{ ...TY.h, fontSize: "22px", color: meta.color }}>{count}</span>
                      <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>{meta.label}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Dispute cards */}
              <div className="space-y-3">
                {DISPUTES.map((dispute, i) => {
                  const pc = PRIORITY_COLOR[dispute.priority];
                  const cm = CATEGORY_META[dispute.category];
                  const sm = STATUS_META[dispute.status];

                  return (
                    <motion.button
                      key={dispute.id}
                      className="w-full rounded-2xl p-5 text-left transition-all group"
                      style={{
                        background: t.surfaceRaised,
                        border: `1px solid ${t.borderSubtle}`,
                        boxShadow: t.shadow,
                      }}
                      onClick={() => setSelected(dispute)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = `${pc}30`)}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = t.borderSubtle)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Priority + category glyph */}
                        <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0" style={{ background: `${pc}10`, border: `1px solid ${pc}18` }}>
                          <span style={{ ...TY.h, fontSize: "16px", color: pc }}>{cm.icon}</span>
                          <span style={{ ...TY.cap, fontSize: "7px", color: pc, marginTop: 1 }}>{dispute.priority.toUpperCase()}</span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ ...TY.body, fontSize: "13px", color: t.text }}>{dispute.title}</span>
                          </div>
                          <span className="block mb-2" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
                            {dispute.description.slice(0, 120)}{dispute.description.length > 120 ? "..." : ""}
                          </span>

                          {/* Meta row */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md" style={{ ...TY.cap, fontSize: "9px", color: cm.color, background: `${cm.color}10` }}>{cm.label}</span>
                            <span className="px-2 py-0.5 rounded-md" style={{ ...TY.cap, fontSize: "9px", color: sm.color, background: `${sm.color}10` }}>{sm.label}</span>
                            <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>
                              {dispute.rider.name} vs {dispute.driver.name}
                            </span>
                            <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{dispute.createdAt}</span>
                          </div>
                        </div>

                        {/* SLA + evidence count */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: dispute.slaHoursLeft <= 4 ? `${STATUS.error}08` : t.surface }}>
                            <Timer size={10} style={{ color: dispute.slaHoursLeft <= 4 ? STATUS.error : t.textMuted }} />
                            <span style={{ ...TY.cap, fontSize: "10px", color: dispute.slaHoursLeft <= 4 ? STATUS.error : t.textMuted }}>
                              {dispute.slaHoursLeft}h
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{dispute.evidence.length} evidence</span>
                            <span style={{ ...TY.cap, fontSize: "9px", color: t.textGhost }}>·</span>
                            <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{dispute.timeline.length} events</span>
                          </div>
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: t.iconMuted }} />
                        </div>
                      </div>

                      {/* Timeline preview — mini bar */}
                      <div className="flex items-center gap-1 mt-4 ml-16">
                        {dispute.timeline.map((event) => {
                          const style = EVENT_STYLE[event.type];
                          return (
                            <div key={event.id} className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full" style={{ background: style.color }} />
                              <div className="w-6 h-0.5 rounded-full" style={{ background: `${style.color}30` }} />
                            </div>
                          );
                        })}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : (
          /* ═══ DETAIL VIEW — TIMELINE THEATER ═══ */
          <motion.div
            key={`detail-${selected.id}`}
            className="flex-1 flex flex-col overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Detail header */}
            <div className="flex items-center gap-4 px-6 py-4 shrink-0" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
              <button onClick={() => { setSelected(null); setShowResolution(false); }} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: t.surfaceHover }}>
                <ArrowLeft size={14} style={{ color: t.iconSecondary }} />
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span style={{ ...TY.sub, fontSize: "14px", color: t.text }}>{selected.id}</span>
                  <span className="px-2 py-0.5 rounded-md" style={{ ...TY.cap, fontSize: "9px", color: CATEGORY_META[selected.category].color, background: `${CATEGORY_META[selected.category].color}10` }}>
                    {CATEGORY_META[selected.category].label}
                  </span>
                  <span className="px-2 py-0.5 rounded-md" style={{ ...TY.cap, fontSize: "9px", color: PRIORITY_COLOR[selected.priority], background: `${PRIORITY_COLOR[selected.priority]}10` }}>
                    {selected.priority}
                  </span>
                </div>
                <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textMuted }}>{selected.title}</span>
              </div>

              {/* Parties mini */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: `${STATUS.info}08` }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${STATUS.info}15` }}>
                    <span style={{ ...TY.cap, fontSize: "7px", color: STATUS.info }}>{selected.rider.avatar}</span>
                  </div>
                  <span style={{ ...TY.cap, fontSize: "10px", color: STATUS.info }}>{selected.rider.name.split(" ")[0]}</span>
                </div>
                <span style={{ ...TY.cap, fontSize: "10px", color: t.textGhost }}>vs</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg" style={{ background: `${BRAND.green}08` }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${BRAND.green}15` }}>
                    <span style={{ ...TY.cap, fontSize: "7px", color: BRAND.green }}>{selected.driver.avatar}</span>
                  </div>
                  <span style={{ ...TY.cap, fontSize: "10px", color: BRAND.green }}>{selected.driver.name.split(" ")[0]}</span>
                </div>
              </div>

              {/* Resolve button */}
              <button
                className="h-10 px-5 rounded-xl flex items-center gap-2 transition-opacity hover:opacity-90"
                style={{ background: `${BRAND.green}15`, border: `1px solid ${BRAND.green}25` }}
                onClick={() => setShowResolution(!showResolution)}
              >
                <CheckCircle2 size={14} style={{ color: BRAND.green }} />
                <span style={{ ...TY.body, fontSize: "12px", color: BRAND.green }}>Resolve</span>
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Timeline scroll */}
              <div className="flex-1 overflow-y-auto scrollbar-hide px-6 py-6">
                <div className="max-w-[700px] mx-auto">
                  {/* Trip context card */}
                  <motion.div
                    className="rounded-2xl p-5 mb-8"
                    style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin size={14} style={{ color: BRAND.green }} />
                      <span style={{ ...TY.body, fontSize: "13px", color: t.text }}>{selected.trip.pickup}</span>
                      <ArrowUpRight size={12} style={{ color: t.textMuted }} />
                      <span style={{ ...TY.body, fontSize: "13px", color: t.text }}>{selected.trip.dropoff}</span>
                    </div>
                    <div className="flex gap-5">
                      <div><span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>Distance</span><span className="block" style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>{selected.trip.distance}</span></div>
                      <div><span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>Duration</span><span className="block" style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>{selected.trip.duration}</span></div>
                      <div><span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>Fare</span><span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{formatNaira(selected.trip.fare)}</span></div>
                      {selected.trip.surgeMultiplier > 1 && (
                        <div><span style={{ ...TY.cap, fontSize: "9px", color: STATUS.warning }}>Surge</span><span className="block" style={{ ...TY.body, fontSize: "12px", color: STATUS.warning }}>{selected.trip.surgeMultiplier}x</span></div>
                      )}
                      <div><span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>Vehicle</span><span className="block" style={{ ...TY.body, fontSize: "12px", color: t.textSecondary }}>{selected.trip.vehicleType}</span></div>
                    </div>
                  </motion.div>

                  {/* Timeline events */}
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[19px] top-0 bottom-0 w-px" style={{ background: t.borderSubtle }} />

                    {selected.timeline.map((event, i) => {
                      const style = EVENT_STYLE[event.type];
                      const EIcon = style.icon;
                      const linkedEvidence = selected.evidence.filter(e => e.timestamp === event.timestamp);

                      return (
                        <motion.div
                          key={event.id}
                          className="relative flex gap-4 mb-6"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.06 }}
                        >
                          {/* Event node */}
                          <div className="relative z-10 w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${style.color}12`, border: `1px solid ${style.color}20` }}>
                            <EIcon size={16} style={{ color: style.color }} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{event.title}</span>
                              <span style={{ ...TY.cap, fontSize: "9px", color: style.color }}>{event.type}</span>
                              <span className="ml-auto" style={{ ...TY.cap, fontSize: "10px", color: t.textMuted }}>{event.timestamp}</span>
                            </div>
                            <span className="block" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
                              {event.detail}
                            </span>

                            {/* Linked evidence */}
                            {linkedEvidence.length > 0 && (
                              <div className="mt-2 space-y-1.5">
                                {linkedEvidence.map(ev => (
                                  <div key={ev.id} className="flex items-start gap-2 px-3 py-2 rounded-lg" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                                    <FileText size={10} style={{ color: t.iconMuted, marginTop: 2 }} />
                                    <div>
                                      <span className="block" style={{ ...TY.body, fontSize: "10px", color: t.textSecondary }}>{ev.label}</span>
                                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{ev.summary}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Resolution slide panel */}
              <AnimatePresence>
                {showResolution && (
                  <motion.div
                    className="w-[300px] shrink-0 flex flex-col overflow-y-auto scrollbar-hide"
                    style={{ borderLeft: `1px solid ${t.border}`, background: t.overlay }}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 300, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="p-5">
                      <span className="block mb-4" style={{ ...TY.sub, fontSize: "14px", color: t.text }}>Resolve dispute</span>

                      {/* Parties summary */}
                      <div className="space-y-3 mb-5">
                        <div className="p-3 rounded-xl" style={{ background: `${STATUS.info}06`, border: `1px solid ${STATUS.info}12` }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ ...TY.body, fontSize: "12px", color: STATUS.info }}>{selected.rider.name}</span>
                            <span className="ml-auto" style={{ ...TY.cap, fontSize: "9px", color: STATUS.info }}>{selected.rider.rating}★</span>
                          </div>
                          <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>{selected.rider.totalTrips} trips · {selected.rider.disputeHistory} past disputes</span>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: `${BRAND.green}06`, border: `1px solid ${BRAND.green}12` }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span style={{ ...TY.body, fontSize: "12px", color: BRAND.green }}>{selected.driver.name}</span>
                            <span className="ml-auto" style={{ ...TY.cap, fontSize: "9px", color: BRAND.green }}>{selected.driver.rating}★</span>
                          </div>
                          <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>{selected.driver.totalTrips} trips · {selected.driver.disputeHistory} past disputes</span>
                        </div>
                      </div>

                      {/* Resolution options */}
                      <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>VERDICT</span>
                      {[
                        { label: "Favor rider", desc: `Refund ${formatNaira(selected.trip.fare)} + driver warning`, color: STATUS.info },
                        { label: "Favor driver", desc: "Close dispute, notify rider", color: BRAND.green },
                        { label: "Partial refund", desc: "Calculated adjustment to rider", color: STATUS.warning },
                        { label: "Escalate", desc: "Route to senior operations", color: STATUS.error },
                      ].map(opt => (
                        <button
                          key={opt.label}
                          className="w-full p-3 rounded-xl mb-2 text-left transition-colors"
                          style={{ border: `1px solid ${t.borderSubtle}` }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = `${opt.color}30`, e.currentTarget.style.background = t.surfaceHover)}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = t.borderSubtle, e.currentTarget.style.background = "transparent")}
                        >
                          <span className="block" style={{ ...TY.body, fontSize: "12px", color: opt.color }}>{opt.label}</span>
                          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted }}>{opt.desc}</span>
                        </button>
                      ))}

                      <span className="block mt-5 mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>QUICK ACTIONS</span>
                      {["Contact rider", "Contact driver", "Request evidence", "Suspend driver", "View trip replay"].map(a => (
                        <button key={a} className="w-full flex items-center gap-2 h-9 px-3 rounded-lg mb-1 text-left transition-colors" onMouseEnter={e => (e.currentTarget.style.background = t.surfaceHover)} onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                          <span style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>{a}</span>
                          <ChevronRight size={10} className="ml-auto" style={{ color: t.textGhost }} />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
