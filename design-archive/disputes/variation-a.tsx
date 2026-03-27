/**
 * DISPUTE VARIATION A — "EVIDENCE WALL"
 *
 * Mental model: Detective's investigation board.
 * All evidence visible simultaneously in a spatial layout.
 *
 * Layout: Queue (left) │ Evidence Canvas (center) │ Resolution (right)
 *
 * Why this works: When resolving disputes you need ALL context at once.
 * Hidden tabs = missed evidence = wrong decisions.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin, Clock, AlertTriangle, ChevronRight, ArrowLeft,
  MessageSquare, FileText, Route, Camera, Radio, Star,
  Shield, CheckCircle2, XCircle, RefreshCcw, ArrowUpRight,
  Zap, Eye, Phone, User, Hash, Timer,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";
import {
  DISPUTES, DISPUTE_STATS, CATEGORY_META, STATUS_META,
  formatNaira, type Dispute, type Evidence, type DisputeCategory,
} from "../../../config/dispute-mock-data";

const PRIORITY_COLOR: Record<string, string> = {
  critical: STATUS.error,
  high: "#F97316",
  medium: STATUS.warning,
  low: "#737373",
};

const EVIDENCE_ICON: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  gps_trace: Route,
  chat: MessageSquare,
  fare_calc: Hash,
  photo: Camera,
  system_log: FileText,
  rating: Star,
  call_recording: Phone,
};

export function DisputeVariationA() {
  const { t } = useAdminTheme();
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [filterCat, setFilterCat] = useState<DisputeCategory | "all">("all");
  const [hoveredEvidence, setHoveredEvidence] = useState<string | null>(null);

  const filtered = filterCat === "all" ? DISPUTES : DISPUTES.filter(d => d.category === filterCat);

  return (
    <div className="flex h-full overflow-hidden">
      {/* ═══ LEFT: QUEUE ═══ */}
      <motion.div
        className="flex flex-col shrink-0 overflow-hidden"
        style={{ width: selected ? 280 : 380, borderRight: `1px solid ${t.border}`, background: t.overlay, transition: "width 0.3s ease" }}
      >
        {/* Queue header */}
        <div className="px-4 py-3 shrink-0" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          <div className="flex items-center justify-between mb-3">
            <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>Disputes</span>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full" style={{ ...TY.cap, fontSize: "10px", color: STATUS.error, background: `${STATUS.error}12` }}>
                {DISPUTE_STATS.bySeverity.critical + DISPUTE_STATS.bySeverity.high} urgent
              </span>
            </div>
          </div>

          {/* Category filters */}
          <div className="flex gap-1 flex-wrap">
            {(["all", "safety", "fare", "route", "payment", "service"] as const).map(cat => {
              const isActive = filterCat === cat;
              const color = cat === "all" ? t.text : CATEGORY_META[cat].color;
              return (
                <button
                  key={cat}
                  className="px-2.5 py-1.5 rounded-lg transition-colors"
                  style={{
                    background: isActive ? `${color}15` : "transparent",
                    border: `1px solid ${isActive ? `${color}25` : t.borderSubtle}`,
                  }}
                  onClick={() => setFilterCat(cat)}
                >
                  <span style={{ ...TY.cap, fontSize: "10px", color: isActive ? color : t.textMuted }}>
                    {cat === "all" ? "All" : CATEGORY_META[cat].label.split(" ")[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Queue list */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {filtered.map((dispute, i) => {
            const isActive = selected?.id === dispute.id;
            const pc = PRIORITY_COLOR[dispute.priority];
            const cm = CATEGORY_META[dispute.category];
            const sm = STATUS_META[dispute.status];

            return (
              <motion.button
                key={dispute.id}
                className="w-full text-left px-4 py-3.5 transition-colors"
                style={{
                  background: isActive ? t.surfaceActive : "transparent",
                  borderBottom: `1px solid ${t.borderSubtle}`,
                }}
                onClick={() => setSelected(dispute)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = t.surfaceHover; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = isActive ? t.surfaceActive : "transparent"; }}
              >
                <div className="flex items-start gap-3">
                  {/* Priority bar */}
                  <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
                    <div className="w-2 h-2 rounded-full" style={{ background: pc }} />
                    <div className="w-0.5 flex-1 rounded-full" style={{ background: `${pc}30`, minHeight: 24 }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ ...TY.cap, fontSize: "9px", color: cm.color }}>{cm.label}</span>
                      <span style={{ ...TY.cap, fontSize: "9px", color: t.textGhost }}>·</span>
                      <span style={{ ...TY.cap, fontSize: "9px", color: sm.color }}>{sm.label}</span>
                    </div>
                    <span className="block truncate mb-1" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4" }}>
                      {dispute.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{dispute.id}</span>
                      <span style={{ ...TY.cap, fontSize: "9px", color: t.textGhost }}>·</span>
                      <span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{dispute.createdAt}</span>
                      {dispute.slaHoursLeft <= 4 && (
                        <span className="flex items-center gap-0.5" style={{ ...TY.cap, fontSize: "9px", color: STATUS.error }}>
                          <Timer size={8} /> {dispute.slaHoursLeft}h left
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* ═══ CENTER + RIGHT: EVIDENCE CANVAS + RESOLUTION ═══ */}
      <AnimatePresence mode="wait">
        {selected ? (
          <motion.div
            key={selected.id}
            className="flex-1 flex min-w-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Evidence canvas */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-hide p-5">
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: t.surfaceHover }}>
                  <ArrowLeft size={14} style={{ color: t.iconSecondary }} />
                </button>
                <div className="flex-1">
                  <span className="block" style={{ ...TY.sub, fontSize: "15px", color: t.text }}>{selected.title}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span style={{ ...TY.cap, fontSize: "10px", color: CATEGORY_META[selected.category].color }}>{CATEGORY_META[selected.category].label}</span>
                    <span style={{ ...TY.cap, fontSize: "10px", color: t.textGhost }}>·</span>
                    <span style={{ ...TY.cap, fontSize: "10px", color: t.textFaint }}>{selected.id}</span>
                    <span style={{ ...TY.cap, fontSize: "10px", color: t.textGhost }}>·</span>
                    <span style={{ ...TY.cap, fontSize: "10px", color: STATUS_META[selected.status].color }}>{STATUS_META[selected.status].label}</span>
                  </div>
                </div>
                {/* SLA badge */}
                <div
                  className="px-3 py-2 rounded-xl flex items-center gap-2 shrink-0"
                  style={{ background: selected.slaHoursLeft <= 2 ? `${STATUS.error}10` : `${STATUS.warning}08`, border: `1px solid ${selected.slaHoursLeft <= 2 ? STATUS.error : STATUS.warning}18` }}
                >
                  <Timer size={12} style={{ color: selected.slaHoursLeft <= 2 ? STATUS.error : STATUS.warning }} />
                  <span style={{ ...TY.body, fontSize: "12px", color: selected.slaHoursLeft <= 2 ? STATUS.error : STATUS.warning }}>
                    {selected.slaHoursLeft}h to SLA
                  </span>
                </div>
              </div>

              {/* Parties strip */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                {/* Rider */}
                <div className="rounded-2xl p-4" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${STATUS.info}12` }}>
                      <span style={{ ...TY.body, fontSize: "12px", color: STATUS.info }}>{selected.rider.avatar}</span>
                    </div>
                    <div>
                      <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{selected.rider.name}</span>
                      <span style={{ ...TY.cap, fontSize: "10px", color: STATUS.info }}>RIDER</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div><span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>Rating</span><span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{selected.rider.rating}★</span></div>
                    <div><span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>Trips</span><span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{selected.rider.totalTrips}</span></div>
                    <div><span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>Past disputes</span><span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{selected.rider.disputeHistory}</span></div>
                  </div>
                </div>
                {/* Driver */}
                <div className="rounded-2xl p-4" style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${BRAND.green}12` }}>
                      <span style={{ ...TY.body, fontSize: "12px", color: BRAND.green }}>{selected.driver.avatar}</span>
                    </div>
                    <div>
                      <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{selected.driver.name}</span>
                      <span style={{ ...TY.cap, fontSize: "10px", color: BRAND.green }}>DRIVER</span>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div><span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>Rating</span><span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{selected.driver.rating}★</span></div>
                    <div><span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>Trips</span><span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{selected.driver.totalTrips}</span></div>
                    <div><span style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>Past disputes</span><span className="block" style={{ ...TY.body, fontSize: "13px", color: selected.driver.disputeHistory >= 5 ? STATUS.error : t.text }}>{selected.driver.disputeHistory}</span></div>
                  </div>
                </div>
              </div>

              {/* Trip card */}
              <div className="rounded-2xl p-4 mb-5" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>TRIP {selected.trip.id}</span>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={12} style={{ color: BRAND.green }} />
                  <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{selected.trip.pickup}</span>
                  <ArrowUpRight size={10} style={{ color: t.textMuted }} />
                  <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{selected.trip.dropoff}</span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1">
                  <span style={{ ...TY.cap, fontSize: "10px", color: t.textMuted }}>{selected.trip.distance} · {selected.trip.duration}</span>
                  <span style={{ ...TY.cap, fontSize: "10px", color: t.text }}>{formatNaira(selected.trip.fare)}</span>
                  {selected.trip.surgeMultiplier > 1 && <span style={{ ...TY.cap, fontSize: "10px", color: STATUS.warning }}>{selected.trip.surgeMultiplier}x surge</span>}
                  <span style={{ ...TY.cap, fontSize: "10px", color: t.textMuted }}>{selected.trip.vehicleType}</span>
                  <span style={{ ...TY.cap, fontSize: "10px", color: t.textMuted }}>{selected.trip.paymentMethod}</span>
                </div>
              </div>

              {/* Evidence wall — spatial grid */}
              <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>
                EVIDENCE ({selected.evidence.length} items)
              </span>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-5">
                {selected.evidence.map((ev, i) => {
                  const EIcon = EVIDENCE_ICON[ev.type] || FileText;
                  const sourceColor = ev.source === "rider" ? STATUS.info : ev.source === "driver" ? BRAND.green : t.textMuted;
                  const isHovered = hoveredEvidence === ev.id;

                  return (
                    <motion.div
                      key={ev.id}
                      className="rounded-xl p-4 cursor-pointer transition-all"
                      style={{
                        background: isHovered ? t.surfaceActive : t.surfaceRaised,
                        border: `1px solid ${isHovered ? `${sourceColor}30` : t.borderSubtle}`,
                        boxShadow: isHovered ? `0 0 20px ${sourceColor}08` : "none",
                      }}
                      onMouseEnter={() => setHoveredEvidence(ev.id)}
                      onMouseLeave={() => setHoveredEvidence(null)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.04 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <EIcon size={14} style={{ color: sourceColor }} />
                        <span style={{ ...TY.body, fontSize: "12px", color: t.text }}>{ev.label}</span>
                        <span className="ml-auto px-1.5 py-0.5 rounded-md" style={{ ...TY.cap, fontSize: "8px", color: sourceColor, background: `${sourceColor}10` }}>
                          {ev.source}
                        </span>
                      </div>
                      <span className="block" style={{ ...TY.bodyR, fontSize: "11px", color: t.textSecondary, lineHeight: "1.5" }}>
                        {ev.summary}
                      </span>
                      {ev.timestamp && (
                        <span className="block mt-1.5" style={{ ...TY.cap, fontSize: "9px", color: t.textFaint }}>{ev.timestamp}</span>
                      )}
                    </motion.div>
                  );
                })}
              </div>

              {/* Description */}
              <div className="rounded-xl p-4" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <span className="block mb-1" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>RIDER'S STATEMENT</span>
                <span style={{ ...TY.bodyR, fontSize: "12px", color: t.textSecondary, lineHeight: "1.5" }}>
                  {selected.description}
                </span>
              </div>
            </div>

            {/* ─── RIGHT: RESOLUTION PANEL ─── */}
            <div className="w-[280px] shrink-0 flex flex-col overflow-y-auto scrollbar-hide" style={{ borderLeft: `1px solid ${t.border}`, background: t.overlay }}>
              <div className="p-4" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                <span style={{ ...TY.sub, fontSize: "13px", color: t.text }}>Resolution</span>
              </div>

              <div className="p-4 flex-1">
                {/* Quick actions */}
                <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>
                  VERDICT
                </span>
                {[
                  { label: "Favor rider", desc: "Refund + driver warning", icon: User, color: STATUS.info },
                  { label: "Favor driver", desc: "Close dispute, no action", icon: Shield, color: BRAND.green },
                  { label: "Split resolution", desc: "Partial refund to rider", icon: RefreshCcw, color: STATUS.warning },
                  { label: "Escalate", desc: "Send to senior ops team", icon: AlertTriangle, color: STATUS.error },
                ].map((action, i) => (
                  <motion.button
                    key={action.label}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-2 text-left transition-colors"
                    style={{ border: `1px solid ${t.borderSubtle}` }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = `${action.color}30`, e.currentTarget.style.background = t.surfaceHover)}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = t.borderSubtle, e.currentTarget.style.background = "transparent")}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${action.color}12` }}>
                      <action.icon size={14} style={{ color: action.color }} />
                    </div>
                    <div>
                      <span className="block" style={{ ...TY.body, fontSize: "12px", color: t.text }}>{action.label}</span>
                      <span style={{ ...TY.cap, fontSize: "9px", color: t.textMuted }}>{action.desc}</span>
                    </div>
                  </motion.button>
                ))}

                {/* Additional actions */}
                <span className="block mt-5 mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>
                  ACTIONS
                </span>
                {[
                  { label: "Request more evidence", icon: Camera },
                  { label: "Contact rider", icon: Phone },
                  { label: "Contact driver", icon: Phone },
                  { label: "View full trip replay", icon: Eye },
                  { label: "Suspend driver", icon: XCircle },
                ].map((a) => (
                  <button
                    key={a.label}
                    className="w-full flex items-center gap-2.5 px-3 h-10 rounded-lg mb-1 transition-colors text-left"
                    style={{ }}
                    onMouseEnter={e => (e.currentTarget.style.background = t.surfaceHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <a.icon size={12} style={{ color: t.iconSecondary }} />
                    <span style={{ ...TY.body, fontSize: "11px", color: t.textTertiary }}>{a.label}</span>
                    <ChevronRight size={10} className="ml-auto" style={{ color: t.textGhost }} />
                  </button>
                ))}

                {/* Tags */}
                <span className="block mt-5 mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>
                  TAGS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selected.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-md" style={{ ...TY.cap, fontSize: "9px", color: t.textMuted, background: t.surface }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Empty state */
          <motion.div
            className="flex-1 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: t.surface }}>
                <Eye size={24} style={{ color: t.iconMuted }} />
              </div>
              <span className="block mb-1" style={{ ...TY.sub, fontSize: "16px", color: t.textSecondary }}>Select a dispute</span>
              <span style={{ ...TY.bodyR, fontSize: "13px", color: t.textMuted }}>
                Choose from the queue to view evidence and resolve
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
