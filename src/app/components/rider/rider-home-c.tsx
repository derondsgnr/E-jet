 /**
 * Rider Home — Variation C: "Bold" (LOCKED SPINE)
 *
 * Large typographic greeting, quick destination shortcuts, mini stats,
 * recent rides with route visualization, EV promo banner.
 *
 * Callbacks allow the shell to wire navigation (search → booking,
 * avatar → account, see all → activity, recent ride → activity).
 */

import { motion } from "motion/react";
import {
  ArrowUpRight,
  Zap,
  Navigation,
  MoreHorizontal,
  Home,
  Briefcase,
  Plane,
  ChevronRight,
  Leaf,
  Calendar,
  Clock,
} from "lucide-react";
import { MOTION, GLASS_COLORS, GLASS_TYPE, type GlassColorMode } from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { RIDER_TYPE as RT } from "../../config/rider-type";
import { MapCanvas } from "./map-canvas";
import { GlassPanel } from "./glass-panel";
import { JetLogo } from "../brand/jet-logo";

const AVATAR_URL =
  "https://images.unsplash.com/photo-1668752600261-e56e7f3780b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGFmcmljYW4lMjBtYW4lMjBwcm9mZXNzaW9uYWwlMjBoZWFkc2hvdHxlbnwxfHx8fDE3NzI1MzU3NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const EV_PROMO_IMG =
  "https://images.unsplash.com/photo-1536137011311-182058a260ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVjdHJpYyUyMHZlaGljbGUlMjBjaGFyZ2luZyUyMHN0YXRpb24lMjBMYWdvcyUyME5pZ2VyaWF8ZW58MXx8fHwxNzcyNTUxMDAzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

/** Consistent user identity across all rider screens */
export const RIDER_USER = {
  firstName: "Adeola",
  lastName: "Okafor",
  initials: "AO",
  rating: 4.92,
  memberSince: "2024",
};

const quickDestinations = [
  { id: "home", icon: Home, label: "Home", address: "12 Bourdillon Rd" },
  { id: "work", icon: Briefcase, label: "Work", address: "235 Ikorodu Rd" },
  { id: "airport", icon: Plane, label: "Airport", address: "MM Airport" },
];

const recentRides = [
  { id: "r1", from: "Ikoyi", to: "Lekki Phase 1", fare: "₦3,200", time: "Yesterday", duration: "12 min", type: "EV" },
  { id: "r2", from: "Victoria Island", to: "Ikeja City Mall", fare: "₦5,800", time: "Mon", duration: "35 min", type: "Comfort" },
  { id: "r3", from: "Surulere", to: "Lekki Phase 1", fare: "₦4,100", time: "Sun", duration: "28 min", type: "EV" },
];

const stats = [
  { label: "Rides this month", value: "12", trend: "+3" },
  { label: "Carbon saved", value: "4.2kg", trend: "↑" },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning,";
  if (h < 17) return "Good afternoon,";
  return "Good evening,";
}

interface RiderHomeCProps {
  colorMode?: GlassColorMode;
  isNewUser?: boolean;
  onSearchTap?: () => void;
  onAvatarTap?: () => void;
  onSeeAllTap?: () => void;
  onQuickDestination?: (id: string) => void;
  onScheduledTap?: () => void;
  onSavedPlacesTap?: () => void;
}

export function RiderHomeC({
  colorMode = "dark",
  isNewUser = false,
  onSearchTap,
  onAvatarTap,
  onSeeAllTap,
  onQuickDestination,
  onScheduledTap,
  onSavedPlacesTap,
}: RiderHomeCProps) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];

  const displayRecentRides = isNewUser ? [] : recentRides;
  const displayStats = isNewUser
    ? [
        { label: "Rides this month", value: "0", trend: "" },
        { label: "Carbon saved", value: "0kg", trend: "" },
      ]
    : stats;

  return (
    <div className={`relative h-full w-full overflow-hidden ${d ? "bg-[#0B0B0D]" : "bg-[#FAFAFA]"}`}>
      <MapCanvas variant="muted" colorMode={colorMode} />

      {/* Dark mode gradient */}
      {d && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/30 via-transparent to-[#0B0B0D] z-[1]" />
      )}

      {/* ─── Header ─── */}
      <GlassPanel
        variant={d ? "map-dark" : "map-light"}
        blur={24}
        className="absolute top-0 left-0 right-0 z-10 rounded-none"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={MOTION.emphasis}
        style={{ paddingTop: "env(safe-area-inset-top, 12px)" }}
      >
        <div className="flex items-center justify-between px-5 py-3">
          <JetLogo variant="full" mode={d ? "light" : "dark"} height={22} />
          <div className="flex items-center gap-2">
            <motion.button
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                d
                  ? "bg-white/[0.06] hover:bg-white/[0.10]"
                  : "bg-[#0B0B0D]/[0.05] hover:bg-[#0B0B0D]/[0.08]"
              }`}
              whileTap={{ scale: 0.9 }}
            >
              <MoreHorizontal
                className="w-4 h-4"
                style={{ color: d ? "rgba(255,255,255,0.5)" : "rgba(11,11,13,0.45)" }}
              />
            </motion.button>
            <motion.button
              className={`w-8 h-8 rounded-full overflow-hidden border ${
                d ? "border-white/10" : "border-[#0B0B0D]/[0.08]"
              }`}
              onClick={onAvatarTap}
              whileTap={{ scale: 0.9 }}
            >
              <img src={AVATAR_URL} alt="Profile" className="w-full h-full object-cover" />
            </motion.button>
          </div>
        </div>
      </GlassPanel>

      {/* ─── Content zone ─── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-20 overflow-y-auto scrollbar-hide"
        style={{ maxHeight: "72%", paddingBottom: "12px" }}
      >
        <div className="px-5 pt-2 pb-6">
          {/* ─── Bold greeting ─── */}
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.emphasis, delay: 0.15 }}
          >
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "32px", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: "1.15" }}>
              <span style={{ color: c.text.display }}>{getGreeting()}</span>
              <br />
              <span style={{ color: c.text.displayFaded }}>{RIDER_USER.firstName}.</span>
            </h1>
          </motion.div>

          {/* ─── Where to? Search bar ─── */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.standard, delay: 0.25 }}
          >
            <motion.button
              className="w-full text-left"
              onClick={onSearchTap}
              whileTap={{ scale: 0.98 }}
            >
              <GlassPanel
                variant={d ? "dark" : "light"}
                blur={20}
                className="flex items-center gap-3 px-4 py-4 rounded-2xl"
              >
                <Navigation className="w-5 h-5 shrink-0" style={{ color: BRAND_COLORS.green }} />
                <div className="flex-1">
                  <div style={{ ...RT.body, color: c.text.primarySoft }}>
                    Where to?
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1DB954]/50" />
                    <span style={{ ...RT.meta, color: c.text.muted }}>
                      Bourdillon Rd, Ikoyi
                    </span>
                  </div>
                </div>
                <div className="w-9 h-9 rounded-2xl bg-[#1DB954] flex items-center justify-center shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </div>
              </GlassPanel>
            </motion.button>
          </motion.div>

          {/* ─── Quick destinations ─── */}
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.standard, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span style={{ ...RT.label, color: c.text.faint }}>
                Saved places
              </span>
              <motion.button
                onClick={onSavedPlacesTap}
                whileTap={{ scale: 0.95 }}
                style={{ ...RT.meta, color: c.text.muted }}
              >
                Manage
              </motion.button>
            </div>
            <div className="flex gap-2">
              {quickDestinations.map((dest, i) => {
                const Icon = dest.icon;
                return (
                  <motion.button
                    key={dest.id}
                    className="flex-1 text-left"
                    onClick={() => onQuickDestination?.(dest.id)}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...MOTION.standard, delay: 0.32 + i * 0.04 }}
                  >
                    <div
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                      style={{ background: c.surface.subtle }}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: c.surface.hover }}
                      >
                        <Icon className="w-3.5 h-3.5" style={{ color: c.icon.secondary }} />
                      </div>
                      <div className="min-w-0">
                        <div style={{ ...RT.meta, fontWeight: 600, color: c.text.secondary }}>
                          {dest.label}
                        </div>
                        <div className="truncate" style={{ ...RT.metaSmall, color: c.text.muted }}>
                          {dest.address}
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* ─── Mini stats ─── */}
          <motion.div
            className="flex gap-2.5 mb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.standard, delay: 0.36 }}
          >
            {displayStats.map((stat) => (
              <GlassPanel
                key={stat.label}
                variant={d ? "dark" : "light"}
                blur={16}
                className="flex-1 px-3.5 py-3 rounded-2xl"
              >
                <div style={{ ...RT.meta, color: c.text.muted }}>
                  {stat.label}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "22px",
                      fontWeight: 500,
                      letterSpacing: "-0.03em",
                      lineHeight: "1.2",
                      color: c.text.display,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    style={{
                      ...RT.meta,
                      color: d ? "rgba(29,185,84,0.6)" : "rgba(29,185,84,0.7)",
                      position: "relative",
                      top: "-1px",
                    }}
                  >
                    {stat.trend}
                  </span>
                </div>
              </GlassPanel>
            ))}
          </motion.div>

          {/* ─── EV promo banner ─── */}
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.standard, delay: 0.4 }}
          >
            <motion.button
              className="w-full text-left"
              onClick={onSearchTap}
              whileTap={{ scale: 0.98 }}
            >
              <GlassPanel
                variant={d ? "dark" : "light"}
                blur={16}
                className="relative overflow-hidden rounded-2xl"
              >
                <div className="flex items-center gap-4 px-4 py-3.5">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: c.green.tint }}
                  >
                    <Leaf className="w-5 h-5" style={{ color: BRAND_COLORS.green }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ ...RT.bodySmall, color: c.text.primary }}>
                      Try JetEV — 15% cheaper
                    </div>
                    <div className="mt-0.5" style={{ ...RT.meta, color: c.text.muted }}>
                      Zero emissions, same comfort. Save ₦400 on your next ride.
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0" style={{ color: c.icon.muted }} />
                </div>
              </GlassPanel>
            </motion.button>
          </motion.div>

          {/* ─── Scheduled rides shortcut ─── */}
          {!isNewUser && (
          <motion.div
            className="mb-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.standard, delay: 0.42 }}
          >
            <motion.button
              className="w-full text-left"
              onClick={onScheduledTap}
              whileTap={{ scale: 0.98 }}
            >
              <GlassPanel
                variant={d ? "dark" : "light"}
                blur={16}
                className="px-4 py-3.5 rounded-2xl"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: d ? "rgba(255,255,255,0.06)" : "rgba(11,11,13,0.04)" }}
                  >
                    <Calendar className="w-4.5 h-4.5" style={{ color: c.icon.secondary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div style={{ ...RT.bodySmall, color: c.text.primary }}>
                      Scheduled rides
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3" style={{ color: c.text.muted }} />
                      <span style={{ ...RT.meta, color: c.text.muted }}>
                        Tomorrow · 7:30 AM · Home → Work
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="px-1.5 py-0.5 rounded-md"
                      style={{
                        background: "rgba(29,185,84,0.1)",
                        ...RT.badge,
                        fontWeight: 600,
                        color: BRAND_COLORS.green,
                      }}
                    >
                      4
                    </span>
                    <ChevronRight className="w-4 h-4" style={{ color: c.icon.muted }} />
                  </div>
                </div>
              </GlassPanel>
            </motion.button>
          </motion.div>
          )}

          {/* ─── Recent rides ─── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...MOTION.standard, delay: 0.44 }}
          >
            <div className="flex items-center justify-between mb-3">
              <span style={{ ...RT.label, color: c.text.faint }}>
                Recent rides
              </span>
              {!isNewUser && (
              <motion.button
                onClick={onSeeAllTap}
                whileTap={{ scale: 0.95 }}
                style={{ ...RT.meta, color: c.text.muted }}
              >
                See all
              </motion.button>
              )}
            </div>
            {displayRecentRides.length === 0 ? (
              /* ── Empty state for new users ── */
              <GlassPanel
                variant={d ? "dark" : "light"}
                blur={16}
                className="px-5 py-8 rounded-2xl text-center"
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: c.surface.hover }}
                >
                  <Navigation className="w-5 h-5" style={{ color: c.text.ghost }} />
                </div>
                <p style={{
                  ...RT.bodySmall,
                  color: c.text.tertiary,
                  marginBottom: "4px",
                }}>
                  No rides yet
                </p>
                <p style={{ ...RT.meta, color: c.text.ghost }}>
                  Your ride history will appear here after your first trip
                </p>
              </GlassPanel>
            ) : (
            <div className="space-y-2">
              {displayRecentRides.map((ride, i) => (
                <motion.div
                  key={ride.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...MOTION.standard, delay: 0.48 + i * MOTION.stagger }}
                >
                  <motion.button
                    className="w-full text-left"
                    onClick={onSearchTap}
                    whileTap={{ scale: 0.98 }}
                  >
                    <GlassPanel
                      variant={d ? "dark" : "light"}
                      blur={16}
                      className="px-4 py-3.5 rounded-2xl"
                    >
                      <div className="flex items-start gap-3">
                        {/* Route viz */}
                        <div className="flex flex-col items-center shrink-0" style={{ paddingTop: "2px" }}>
                          <div className="w-2 h-2 rounded-full border-[1.5px] border-[#1DB954] bg-transparent" />
                          <div
                            className="w-px flex-1 my-1"
                            style={{ minHeight: "14px", background: c.surface.hover }}
                          />
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ background: c.text.ghost }}
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span style={{ ...RT.bodySmall, color: c.text.primarySoft }}>
                              {ride.from}
                            </span>
                            <ArrowUpRight className="w-3 h-3" style={{ color: c.text.ghost }} />
                            <span style={{ ...RT.bodySmall, color: c.text.primarySoft }}>
                              {ride.to}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span style={{ ...RT.meta, color: c.text.muted }}>{ride.time}</span>
                            <span style={{ ...RT.meta, color: c.text.faint }}>·</span>
                            <span style={{ ...RT.meta, color: c.text.muted }}>{ride.duration}</span>
                            {ride.type === "EV" && (
                              <>
                                <span style={{ ...RT.meta, color: c.text.faint }}>·</span>
                                <span className="flex items-center gap-0.5" style={{ color: "rgba(29,185,84,0.6)" }}>
                                  <Zap className="w-3 h-3" />
                                  <span style={{ ...RT.badge }}>EV</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Fare */}
                        <span
                          style={{
                            fontFamily: "var(--font-heading)",
                            fontSize: "15px",
                            fontWeight: 500,
                            letterSpacing: "-0.02em",
                            lineHeight: "1.4",
                            color: c.text.secondaryStrong,
                          }}
                        >
                          {ride.fare}
                        </span>
                      </div>
                    </GlassPanel>
                  </motion.button>
                </motion.div>
              ))}
            </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}