/**
 * Driver History Modal — Full trip/earnings/rating history for a driver.
 * Wired into fleet-drivers.tsx "View Full History" action.
 *
 * Data source: trips table × driver_id (mock inline)
 */

import { useState } from "react";
import { motion } from "motion/react";
import { X, MapPin, Star, TrendingUp, Calendar, Clock } from "lucide-react";
import { useAdminTheme, BRAND, TY, STATUS } from "../../config/admin-theme";
import type { FleetDriver } from "../../config/fleet-mock-data";

// ── Mock trip history (inline — traceable to trips table) ──────────────────

interface TripRecord {
  id: string;
  date: string;
  pickup: string;
  dropoff: string;
  fare: number;
  rating: number | null;
  duration: string;
}

function generateMockTrips(driverName: string, totalRides: number): TripRecord[] {
  const locations = [
    ["Victoria Island", "Lekki Phase 1"],
    ["Ikeja", "Maryland"],
    ["Ikoyi", "Ajah"],
    ["Surulere", "Yaba"],
    ["Garki", "Maitama"],
    ["Wuse", "Asokoro"],
    ["Alausa", "Ikeja GRA"],
    ["Lekki Phase 1", "Victoria Island"],
    ["Maryland", "Anthony"],
    ["Yaba", "Ebute Metta"],
  ];
  const dates = [
    "Today, 2:14 PM", "Today, 11:30 AM", "Today, 9:05 AM",
    "Yesterday, 6:45 PM", "Yesterday, 3:20 PM", "Yesterday, 12:10 PM",
    "Mar 14, 5:55 PM", "Mar 14, 2:30 PM", "Mar 14, 10:15 AM",
    "Mar 13, 7:20 PM", "Mar 13, 4:00 PM", "Mar 13, 1:45 PM",
    "Mar 12, 6:30 PM", "Mar 12, 3:15 PM", "Mar 12, 11:00 AM",
  ];
  return dates.slice(0, Math.min(15, totalRides)).map((date, i) => {
    const [pickup, dropoff] = locations[i % locations.length];
    return {
      id: `trip-${i}`,
      date,
      pickup,
      dropoff,
      fare: 1800 + Math.round(Math.random() * 4200),
      rating: Math.random() > 0.3 ? Math.round((4 + Math.random()) * 10) / 10 : null,
      duration: `${8 + Math.round(Math.random() * 30)} min`,
    };
  });
}

type TabId = "trips" | "earnings" | "ratings";

export function DriverHistoryModal({ driver, onClose }: {
  driver: FleetDriver;
  onClose: () => void;
}) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<TabId>("trips");
  const trips = generateMockTrips(driver.name, driver.totalRides);

  const tabs: { id: TabId; label: string }[] = [
    { id: "trips", label: "Trips" },
    { id: "earnings", label: "Earnings" },
    { id: "ratings", label: "Ratings" },
  ];

  const totalEarnings = trips.reduce((s, tr) => s + tr.fare, 0);
  const avgRating = trips.filter(tr => tr.rating).reduce((s, tr, _, a) => s + (tr.rating || 0) / a.length, 0);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0" style={{ background: isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.3)" }} onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md rounded-2xl max-h-[80vh] flex flex-col overflow-hidden"
        style={{
          background: isDark ? "rgba(22,22,24,0.97)" : "#fff",
          border: `1px solid ${t.borderSubtle}`,
          boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.5)" : "0 24px 64px rgba(0,0,0,0.15)",
        }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 shrink-0" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ ...TY.sub, fontSize: "15px", color: t.text, lineHeight: "1.3", letterSpacing: "-0.03em" }}>
              Driver History
            </h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity cursor-pointer" style={{ background: t.surface }}>
              <X size={14} style={{ color: t.iconMuted }} />
            </button>
          </div>

          {/* Driver summary */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{
              background: `linear-gradient(135deg, ${BRAND.green}18 0%, ${BRAND.green}06 100%)`,
              border: `1px solid ${BRAND.green}12`,
            }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 600, fontSize: "12px", color: BRAND.green }}>
                {driver.name.split(" ").map(n => n[0]).join("")}
              </span>
            </div>
            <div>
              <span className="block" style={{ ...TY.body, fontSize: "13px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                {driver.name}
              </span>
              <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
                {driver.totalRides} total rides · {driver.rating} avg rating
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 p-0.5 rounded-lg" style={{ background: t.surface }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 py-1.5 px-3 rounded-md transition-all cursor-pointer"
                style={{
                  background: activeTab === tab.id
                    ? isDark ? "rgba(255,255,255,0.06)" : "#fff"
                    : "transparent",
                  boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}
              >
                <span style={{
                  ...TY.body, fontSize: "11px",
                  color: activeTab === tab.id ? t.text : t.textMuted,
                  lineHeight: "1.4", letterSpacing: "-0.02em",
                }}>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeTab === "trips" && (
            <div className="space-y-1">
              {trips.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  className="py-3 flex items-start gap-3"
                  style={{ borderBottom: i < trips.length - 1 ? `1px solid ${t.borderSubtle}` : "none" }}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: t.surface }}>
                    <MapPin size={12} style={{ color: t.iconSecondary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                        {trip.pickup} → {trip.dropoff}
                      </span>
                      <span className="shrink-0" style={{ ...TY.body, fontSize: "12px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                        ₦{trip.fare.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{trip.date}</span>
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>·</span>
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{trip.duration}</span>
                      {trip.rating && (
                        <>
                          <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>·</span>
                          <span className="flex items-center gap-0.5">
                            <Star size={8} style={{ color: STATUS.warning, fill: STATUS.warning }} />
                            <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{trip.rating}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "earnings" && (
            <div className="space-y-4">
              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "This period", value: `₦${totalEarnings.toLocaleString()}`, icon: TrendingUp, color: BRAND.green },
                  { label: "This week", value: `₦${driver.earningsThisWeek.toLocaleString()}`, icon: Calendar, color: STATUS.info },
                ].map((card, i) => (
                  <div key={i} className="p-3 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <card.icon size={10} style={{ color: card.color }} />
                      <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{card.label}</span>
                    </div>
                    <span style={{ ...TY.sub, fontSize: "16px", color: t.text, lineHeight: "1.3", letterSpacing: "-0.03em" }}>
                      {card.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Daily breakdown */}
              <div>
                <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
                  DAILY BREAKDOWN
                </span>
                {driver.sparkline.map((val, i) => {
                  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                  const maxVal = Math.max(...driver.sparkline);
                  return (
                    <div key={i} className="flex items-center gap-3 py-2" style={{ borderBottom: i < 6 ? `1px solid ${t.borderSubtle}` : "none" }}>
                      <span className="w-8" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>{days[i]}</span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: t.surface }}>
                        <div className="h-full rounded-full" style={{ width: `${(val / maxVal) * 100}%`, background: BRAND.green }} />
                      </div>
                      <span className="w-16 text-right" style={{ ...TY.body, fontSize: "11px", color: t.text, lineHeight: "1.4", letterSpacing: "-0.02em" }}>
                        ₦{val.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "ratings" && (
            <div className="space-y-4">
              {/* Rating summary */}
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}>
                <div className="text-center">
                  <span className="block" style={{ ...TY.sub, fontSize: "28px", color: t.text, lineHeight: "1.2", letterSpacing: "-0.03em" }}>
                    {driver.rating}
                  </span>
                  <div className="flex items-center gap-0.5 mt-1 justify-center">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={10} style={{ color: s <= Math.round(driver.rating) ? STATUS.warning : t.borderSubtle, fill: s <= Math.round(driver.rating) ? STATUS.warning : "none" }} />
                    ))}
                  </div>
                  <span className="block mt-1" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>
                    {driver.totalRides} rated trips
                  </span>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map(star => {
                    const pct = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 5 : star === 2 ? 2 : 1;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="w-3 text-right" style={{ ...TY.bodyR, fontSize: "10px", color: t.textMuted, lineHeight: "1.5" }}>{star}</span>
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }}>
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: star >= 4 ? BRAND.green : star === 3 ? STATUS.warning : STATUS.error }} />
                        </div>
                        <span className="w-8" style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent ratings */}
              <div>
                <span className="block mb-2" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em", lineHeight: "1.4" }}>
                  RECENT RATINGS
                </span>
                {trips.filter(tr => tr.rating).slice(0, 8).map((trip, i) => (
                  <div key={trip.id} className="flex items-center gap-3 py-2.5" style={{ borderBottom: i < 7 ? `1px solid ${t.borderSubtle}` : "none" }}>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} size={8} style={{ color: s <= Math.round(trip.rating!) ? STATUS.warning : t.borderSubtle, fill: s <= Math.round(trip.rating!) ? STATUS.warning : "none" }} />
                      ))}
                    </div>
                    <span className="flex-1 truncate" style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted, lineHeight: "1.5" }}>
                      {trip.pickup} → {trip.dropoff}
                    </span>
                    <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint, lineHeight: "1.5" }}>{trip.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
