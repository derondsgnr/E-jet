/**
 * View Skeletons — Linear/Vercel-style shimmer skeletons per view type.
 * Uses admin-theme tokens for dark/light consistency.
 * Each variant mirrors the real view's layout structure.
 */

import { useAdminTheme } from "../../config/admin-theme";

function Bone({ w = "100%", h = 12, r = 8, className = "" }: { w?: string | number; h?: number; r?: number; className?: string }) {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        width: typeof w === "number" ? `${w}px` : w,
        height: h,
        borderRadius: r,
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
      }}
    />
  );
}

/** Dashboard skeleton — KPI strip + chart + list */
export function DashboardSkeleton() {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="flex-1 p-4 md:p-5 space-y-5 animate-pulse">
        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="px-3.5 py-3 rounded-xl" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}` }}>
              <Bone w={60} h={8} className="mb-2" />
              <Bone w={80} h={20} />
            </div>
          ))}
        </div>
        {/* Chart area */}
        <div className="p-4 rounded-xl" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}` }}>
          <Bone w={120} h={10} className="mb-3" />
          <Bone w="100%" h={44} r={4} />
        </div>
        {/* List */}
        <div className="rounded-xl" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}` }}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < 4 ? `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` : "none" }}>
              <Bone w={32} h={32} r={8} />
              <div className="flex-1 space-y-1.5">
                <Bone w="40%" h={10} />
                <Bone w="60%" h={8} />
              </div>
              <Bone w={48} h={10} />
            </div>
          ))}
        </div>
      </div>
      {/* Right panel */}
      <div className="hidden md:block w-px self-stretch" style={{ background: `linear-gradient(to bottom, transparent, ${t.borderSubtle}, transparent)` }} />
      <div className="shrink-0 md:w-[300px] p-4 space-y-4 animate-pulse">
        <div className="p-4 rounded-xl" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
          <Bone w={80} h={8} className="mb-2" />
          <Bone w={120} h={22} className="mb-1" />
          <Bone w={100} h={8} />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` }}>
            <Bone w={12} h={12} r={6} />
            <div className="flex-1 space-y-1">
              <Bone w="50%" h={8} />
              <Bone w="70%" h={7} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Table skeleton — Filters + rows (for Drivers, Vehicles, Rides) */
export function TableSkeleton() {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div className="h-full p-4 md:p-5 space-y-4 animate-pulse">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <Bone w={200} h={32} r={10} />
        <Bone w={80} h={32} r={10} />
        <div className="flex-1" />
        <Bone w={100} h={32} r={10} />
      </div>
      {/* Filter pills */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map(i => <Bone key={i} w={72} h={28} r={14} />)}
      </div>
      {/* Rows */}
      <div className="rounded-xl" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}` }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: i < 6 ? `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` : "none" }}>
            <Bone w={36} h={36} r={10} />
            <div className="flex-1 space-y-1.5">
              <Bone w="35%" h={10} />
              <Bone w="55%" h={8} />
            </div>
            <Bone w={60} h={22} r={10} />
            <Bone w={11} h={11} r={3} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Earnings skeleton — KPI strip + chart + two tables */
export function EarningsSkeleton() {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div className="h-full p-4 md:p-5 space-y-5 animate-pulse">
      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="px-3.5 py-3 rounded-xl" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}` }}>
            <Bone w={60} h={8} className="mb-2" />
            <Bone w={90} h={22} />
          </div>
        ))}
      </div>
      {/* Chart */}
      <div className="p-4 rounded-2xl" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
        <Bone w={140} h={10} className="mb-3" />
        <Bone w="100%" h={160} r={8} />
      </div>
      {/* Table */}
      <div className="rounded-xl" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}` }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < 4 ? `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` : "none" }}>
            <Bone w={28} h={28} r={14} />
            <div className="flex-1 space-y-1">
              <Bone w="30%" h={10} />
              <Bone w="50%" h={8} />
            </div>
            <Bone w={60} h={10} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Billing skeleton — credit meter + invoice table */
export function BillingSkeleton() {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div className="h-full p-4 md:p-5 space-y-5 animate-pulse">
      {/* Credit meter */}
      <div className="p-4 rounded-xl" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
        <Bone w={80} h={8} className="mb-2" />
        <Bone w={120} h={22} className="mb-2" />
        <Bone w="100%" h={6} r={3} className="mb-1" />
        <Bone w={100} h={7} />
      </div>
      {/* Invoice table */}
      <div className="rounded-xl" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)"}` }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < 5 ? `1px solid ${isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}` : "none" }}>
            <Bone w={32} h={32} r={8} />
            <div className="flex-1 space-y-1">
              <Bone w="40%" h={10} />
              <Bone w="25%" h={8} />
            </div>
            <Bone w={60} h={10} />
            <Bone w={50} h={22} r={8} />
          </div>
        ))}
      </div>
    </div>
  );
}

/** Form skeleton — for booking flows */
export function FormSkeleton() {
  const { theme } = useAdminTheme();
  const isDark = theme === "dark";
  return (
    <div className="h-full p-4 md:p-5 space-y-5 animate-pulse max-w-2xl mx-auto">
      <Bone w={200} h={18} className="mb-1" />
      <Bone w={280} h={10} />
      <div className="space-y-4 mt-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i}>
            <Bone w={80} h={8} className="mb-1.5" />
            <Bone w="100%" h={40} r={10} />
          </div>
        ))}
      </div>
      <Bone w={140} h={40} r={10} className="mt-4" />
    </div>
  );
}
