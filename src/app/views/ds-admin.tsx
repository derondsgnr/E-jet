/**
 * DS ADMIN — Admin primitives + surfaces documentation.
 * KPICard, SegmentedBar, StatTile, DiagnosticCard, StageRow,
 * ActionQueueItem, PriorityIcon, FeedIcon, CTAButton, ActionRow,
 * EmptyState, Skeleton, SectionLabel, ThemeToggle,
 * AdminModal, AdminDrawer, Surface Selection Framework.
 */

import { useState } from "react";
import {
  Car, Users, Wallet, Zap, Star, Clock, Shield, MapPin,
  AlertTriangle, CheckCircle, AlertCircle, UserPlus, Plus,
  Building2, CreditCard, Scale,
} from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../config/admin-theme";
import {
  KPICard, SegmentedBar, StatTile, DiagnosticCard,
  StageRow, ActionQueueItem, PriorityIcon, FeedIcon,
  CTAButton, ActionRow, EmptyState, Skeleton, SectionLabel, ThemeToggle,
} from "../components/admin/ui/primitives";
import { Section, DSCard, SLabel, PropTable, NoteCard, DSep } from "./ds-primitives";

export default function DSAdmin() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";

  return (
    <div className="max-w-[1100px] mx-auto px-5 py-8 space-y-14">

      {/* ═══ KPI CARD ═══ */}
      <Section id="kpi-card" title="KPI CARD" description="Icon + value + delta + label. Animated entrance with stagger.">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <KPICard icon={Car} label="Active rides" value="127" delta="+8%" up delay={0} />
          <KPICard icon={Users} label="Online drivers" value="84" delta="-3%" up={false} delay={0.04} />
          <KPICard icon={Wallet} label="Today's revenue" value="₦2.4M" delta="+12%" up delay={0.08} />
          <KPICard icon={Zap} label="EV trips" value="31" delta="+22%" up delay={0.12} />
        </div>
        <DSCard className="mt-4">
          <PropTable rows={[
            ["label", "string", "—"],
            ["value", "string", "—"],
            ["delta", "string", "undefined"],
            ["up", "boolean", "undefined"],
            ["icon", "LucideIcon", "—"],
            ["delay", "number", "0"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ SEGMENTED BAR ═══ */}
      <Section id="segmented-bar" title="SEGMENTED BAR" description="Multi-segment progress bar with flexible proportions.">
        <DSCard>
          <div className="space-y-6">
            <div>
              <SLabel>DRIVER STATUS DISTRIBUTION</SLabel>
              <SegmentedBar segments={[
                { value: 18, color: BRAND.green, label: "On Trip" },
                { value: 24, color: STATUS.info, label: "Online" },
                { value: 8, color: "#737373", label: "Offline" },
              ]} height={12} />
              <div className="flex gap-4 mt-2">
                {[
                  { label: "On Trip", color: BRAND.green, val: "18" },
                  { label: "Online", color: STATUS.info, val: "24" },
                  { label: "Offline", color: "#737373", val: "8" },
                ].map(s => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, letterSpacing: "-0.02em" }}>{s.label}: {s.val}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SLabel>FLEET COMPOSITION</SLabel>
              <SegmentedBar segments={[
                { value: 12, color: BRAND.green },
                { value: 28, color: t.textMuted },
              ]} height={8} />
              <div className="flex gap-4 mt-2">
                <div className="flex items-center gap-1.5"><Zap size={10} style={{ color: BRAND.green }} /><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, letterSpacing: "-0.02em" }}>EV: 12</span></div>
                <div className="flex items-center gap-1.5"><Car size={10} style={{ color: t.textMuted }} /><span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, letterSpacing: "-0.02em" }}>Gas: 28</span></div>
              </div>
            </div>
          </div>
          <PropTable rows={[
            ["segments", "{ value, color, label? }[]", "—"],
            ["height", "number", "10"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ STAT TILE ═══ */}
      <Section id="stat-tile" title="STAT TILE" description="Compact stat block for dense data grids.">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatTile label="Avg rating" value="4.8" color={BRAND.green} />
          <StatTile label="Avg ETA" value="4.2m" />
          <StatTile label="Completion" value="94%" color={BRAND.green} />
          <StatTile label="Disputes" value="3" color={STATUS.warning} />
        </div>
      </Section>

      {/* ═══ DIAGNOSTIC CARD ═══ */}
      <Section id="diagnostic-card" title="DIAGNOSTIC CARD" description="Health metric with target + verdict. Used in supply health panels.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <DiagnosticCard label="Driver utilization" value="78%" target="Target: ≥70%" verdict="Healthy" ok pct={78} color={BRAND.green} />
          <DiagnosticCard label="Avg wait time" value="6.2m" target="Target: ≤5m" verdict="Warning" ok={false} pct={62} color={STATUS.warning} />
          <DiagnosticCard label="Cancellation rate" value="4.1%" target="Target: ≤5%" verdict="Healthy" ok pct={41} color={BRAND.green} />
          <DiagnosticCard label="EV fleet coverage" value="28%" target="Target: ≥40%" verdict="Below" ok={false} pct={28} color={STATUS.error} />
        </div>
        <DSCard className="mt-4">
          <PropTable rows={[
            ["label", "string", "—"],
            ["value", "string", "—"],
            ["target", "string", "—"],
            ["verdict", "string", "—"],
            ["ok", "boolean", "—"],
            ["pct", "number (0-100)", "—"],
            ["color", "string", "—"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ STAGE ROW ═══ */}
      <Section id="stage-row" title="STAGE ROW" description="Pipeline stage with bottleneck indicator. Used in driver verification pipeline.">
        <DSCard>
          <div className="space-y-1">
            <StageRow label="Document Upload" count={12} color={BRAND.green} delay={0} />
            <StageRow label="Background Check" count={8} color={STATUS.info} delay={0.04} />
            <StageRow label="Vehicle Inspection" count={15} color={STATUS.warning} isBottleneck delay={0.08} />
            <StageRow label="Training" count={3} color="#737373" delay={0.12} />
            <StageRow label="Approved" count={42} color={BRAND.green} delay={0.16} />
          </div>
        </DSCard>
      </Section>

      {/* ═══ ACTION QUEUE ITEM ═══ */}
      <Section id="action-queue" title="ACTION QUEUE ITEM" description="Priority queue entry with icon + timeline. Used in command center.">
        <DSCard noPad>
          <ActionQueueItem priority="critical" title="Ride dispute — passenger safety" subtitle="Rider #4521 reported unsafe driving on VI-Lekki" timestamp="2m ago" meta="SAFETY" delay={0} />
          <ActionQueueItem priority="high" title="Driver payout failed" subtitle="GTBank transfer rejected for Chidi Okafor" timestamp="15m ago" meta="FINANCE" delay={0.04} />
          <ActionQueueItem priority="medium" title="New fleet owner application" subtitle="Lagos Express Ltd — 12 vehicles registered" timestamp="1h ago" delay={0.08} />
          <ActionQueueItem priority="low" title="Hotel partner feedback" subtitle="Eko Hotels requested custom booking flow" timestamp="3h ago" delay={0.12} />
        </DSCard>
      </Section>

      {/* ═══ PRIORITY + FEED ICONS ═══ */}
      <Section id="icons-semantic" title="PRIORITY & FEED ICONS" description="Semantic icon mapping for event types and priority levels.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DSCard>
            <SLabel>PRIORITY ICONS</SLabel>
            <div className="flex flex-wrap gap-4">
              {["critical", "high", "medium", "low"].map(p => (
                <div key={p} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: t.surface }}>
                  <PriorityIcon priority={p} size={14} />
                  <span style={{ ...TY.body, fontSize: "10px", color: t.textSecondary, letterSpacing: "-0.02em" }}>{p}</span>
                </div>
              ))}
            </div>
          </DSCard>
          <DSCard>
            <SLabel>FEED ICONS (12 EVENT TYPES)</SLabel>
            <div className="flex flex-wrap gap-3">
              {[
                "ride_completed", "driver_online", "surge_activated", "payment_failed",
                "ride_cancelled", "dispute_opened", "driver_verified",
                "hotel_ride", "hotel_invoice", "hotel_issue",
                "fleet_offline", "fleet_payout",
              ].map(type => (
                <div key={type} className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: t.surface }}>
                  <FeedIcon type={type} size={12} />
                  <span style={{ ...TY.bodyR, fontSize: "8px", color: t.textFaint, fontFamily: "monospace" }}>{type.replace(/_/g, " ")}</span>
                </div>
              ))}
            </div>
          </DSCard>
        </div>
      </Section>

      {/* ═══ CTA BUTTON + ACTION ROW ═══ */}
      <Section id="cta-action" title="CTA BUTTON · ACTION ROW" description="Tinted action button and chevron navigation row.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DSCard>
            <SLabel>CTA BUTTON VARIANTS</SLabel>
            <div className="space-y-3">
              <CTAButton label="Add Vehicle" icon={Plus} />
              <CTAButton label="Invite Driver" icon={UserPlus} color={STATUS.info} />
              <CTAButton label="View Report" icon={Shield} color={STATUS.warning} />
            </div>
          </DSCard>
          <DSCard>
            <SLabel>ACTION ROW</SLabel>
            <div className="space-y-1">
              <ActionRow label="Fleet Settings" icon={Car} />
              <ActionRow label="Payout Schedule" icon={Wallet} />
              <ActionRow label="Security" icon={Shield} />
              <ActionRow label="Compliance" icon={AlertTriangle} />
            </div>
          </DSCard>
        </div>
      </Section>

      {/* ═══ EMPTY STATE + SKELETON ═══ */}
      <Section id="admin-states" title="ADMIN EMPTY STATE · SKELETON">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DSCard>
            <SLabel>ADMIN EMPTY STATE</SLabel>
            <EmptyState icon={Users} title="No drivers found" description="Try adjusting your filters or invite new drivers to the platform." />
          </DSCard>
          <DSCard>
            <SLabel>ADMIN SKELETON (SHIMMER GRADIENT)</SLabel>
            <div className="space-y-3 py-4">
              <Skeleton width="60%" height={24} />
              <Skeleton width="100%" height={16} />
              <Skeleton width="100%" height={16} />
              <Skeleton width="40%" height={16} />
              <div className="flex gap-3 mt-4">
                <Skeleton width={100} height={36} rounded={12} />
                <Skeleton width={100} height={36} rounded={12} />
              </div>
            </div>
          </DSCard>
        </div>
      </Section>

      {/* ═══ SURFACE SELECTION FRAMEWORK ═══ */}
      <Section id="surface-framework" title="SURFACE SELECTION FRAMEWORK" description="Decision tree for choosing the right surface type.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "CENTER MODAL",
                subtitle: "High friction · Deliberate",
                color: STATUS.error,
                items: ["Irreversible/destructive actions", "Financial impact (refunds, payouts)", "Multi-party consequences", "Full user attention needed"],
                pattern: "Apple delete · Linear issue deletion",
              },
              {
                title: "SIDE DRAWER",
                subtitle: "Low friction · Contextual",
                color: STATUS.info,
                items: ["Reference background while acting", "Composing (messages, notes)", "Browsing supplemental detail", "Multi-step non-destructive flows"],
                pattern: "Linear sidebar · Airbnb reservation",
              },
              {
                title: "INLINE EXPAND",
                subtitle: "Zero friction · Micro",
                color: BRAND.green,
                items: ["Toggle, filter, quick state change", "No confirmation needed", "Component-level interactions"],
                pattern: "Linear filter toggles · Vercel deploy",
              },
            ].map(s => (
              <div key={s.title} className="p-4 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                  <span style={{ ...TY.body, fontSize: "11px", color: t.text, letterSpacing: "-0.02em" }}>{s.title}</span>
                </div>
                <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, display: "block", marginBottom: 8, letterSpacing: "-0.02em" }}>{s.subtitle}</span>
                <div className="space-y-1 mb-3">
                  {s.items.map(item => (
                    <div key={item} className="flex items-start gap-1.5">
                      <div className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: s.color }} />
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textSecondary, letterSpacing: "-0.02em" }}>{item}</span>
                    </div>
                  ))}
                </div>
                <span style={{ ...TY.bodyR, fontSize: "9px", color: t.textFaint, fontStyle: "italic", letterSpacing: "-0.02em" }}>{s.pattern}</span>
              </div>
            ))}
          </div>
        </DSCard>
      </Section>

      {/* ═══ ADMIN MODAL ═══ */}
      <Section id="admin-modal" title="ADMIN MODAL" description="Center modal. Backdrop blur (8px) + scrim. Danger mode. Persistent mode.">
        <DSCard>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Standard modal preview */}
            <div className="relative rounded-2xl overflow-hidden" style={{ height: 200, background: t.bg }}>
              <div className="absolute inset-0" style={{ background: isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)", backdropFilter: "blur(6px)" }} />
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="w-full max-w-[240px] rounded-2xl p-4" style={{ background: t.overlay, border: `1px solid ${t.border}`, boxShadow: t.shadowLg }}>
                  <span style={{ ...TY.sub, fontSize: "12px", color: t.text, display: "block", letterSpacing: "-0.02em" }}>Confirm Action</span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, display: "block", marginTop: 4, marginBottom: 12, letterSpacing: "-0.02em" }}>Standard modal · backdrop blur + scrim</span>
                  <div className="flex gap-2">
                    <div className="flex-1 py-2 rounded-xl text-center" style={{ background: t.surface, ...TY.body, fontSize: "10px", color: t.textSecondary, letterSpacing: "-0.02em" }}>Cancel</div>
                    <div className="flex-1 py-2 rounded-xl text-center" style={{ background: BRAND.green, ...TY.body, fontSize: "10px", color: "#fff", letterSpacing: "-0.02em" }}>Confirm</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Danger modal preview */}
            <div className="relative rounded-2xl overflow-hidden" style={{ height: 200, background: t.bg }}>
              <div className="absolute inset-0" style={{ background: isDark ? "rgba(212,24,61,0.06)" : "rgba(212,24,61,0.03)", backdropFilter: "blur(6px)" }} />
              <div className="absolute inset-4 flex items-center justify-center">
                <div className="w-full max-w-[240px] rounded-2xl p-4" style={{ background: t.overlay, border: `1px solid ${t.errorBorder}`, boxShadow: t.shadowLg }}>
                  <span style={{ ...TY.sub, fontSize: "12px", color: t.text, display: "block", letterSpacing: "-0.02em" }}>Danger Mode</span>
                  <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, display: "block", marginTop: 4, marginBottom: 12, letterSpacing: "-0.02em" }}>Red-tinted overlay · destructive action</span>
                  <div className="flex gap-2">
                    <div className="flex-1 py-2 rounded-xl text-center" style={{ background: t.surface, ...TY.body, fontSize: "10px", color: t.textSecondary, letterSpacing: "-0.02em" }}>Cancel</div>
                    <div className="flex-1 py-2 rounded-xl text-center" style={{ background: STATUS.error, ...TY.body, fontSize: "10px", color: "#fff", letterSpacing: "-0.02em" }}>Delete</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <PropTable rows={[
            ["open", "boolean", "false"],
            ["onClose", "() => void", "—"],
            ["width", "number", "480"],
            ["persistent", "boolean", "false (no backdrop dismiss)"],
            ["danger", "boolean", "false (red overlay tint)"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ ADMIN DRAWER ═══ */}
      <Section id="admin-drawer" title="ADMIN DRAWER" description="Side panel. Dimmer backdrop (not blurred). Built-in header. x-slide animation.">
        <DSCard>
          <div className="flex gap-4 items-stretch h-48 relative rounded-xl overflow-hidden" style={{ border: `1px solid ${t.borderSubtle}`, background: t.bg }}>
            <div className="flex-1 p-4 space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: t.surface }}>
                  <div className="w-5 h-5 rounded-full" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }} />
                  <div className="flex-1"><div className="h-2 rounded" style={{ width: `${40 + i * 10}%`, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }} /></div>
                </div>
              ))}
            </div>
            <div className="w-[180px] shrink-0 flex flex-col" style={{
              background: isDark ? "rgba(17,17,19,0.98)" : "rgba(255,255,255,0.98)",
              borderLeft: `1px solid ${t.borderSubtle}`,
              boxShadow: isDark ? "-8px 0 32px rgba(0,0,0,0.3)" : "-8px 0 32px rgba(0,0,0,0.06)",
            }}>
              <div className="px-3 py-2 flex items-center justify-between" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
                <span style={{ ...TY.body, fontSize: "11px", color: t.text, letterSpacing: "-0.02em" }}>Detail Panel</span>
              </div>
              <div className="flex-1 p-3 space-y-2">
                {["Title", "Subtitle", "Content"].map(l => (
                  <Skeleton key={l} width="100%" height={12} />
                ))}
              </div>
            </div>
          </div>
          <PropTable rows={[
            ["open", "boolean", "false"],
            ["onClose", "() => void", "—"],
            ["width", "number", "420"],
            ["side", "'left' | 'right'", "'right'"],
            ["title", "string", "undefined"],
            ["subtitle", "string", "undefined"],
          ]} />
        </DSCard>
      </Section>

      {/* ═══ THEME TOGGLE ═══ */}
      <Section id="theme-toggle" title="THEME TOGGLE">
        <DSCard>
          <SLabel>SUN/MOON TOGGLE BUTTON</SLabel>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, letterSpacing: "-0.02em" }}>Current: {theme} mode · Click to switch</span>
          </div>
        </DSCard>
      </Section>

      <div className="py-6 text-center">
        <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textGhost, letterSpacing: "-0.02em" }}>JET Design System · Admin Primitives · 17 Mar 2026</span>
      </div>
    </div>
  );
}
