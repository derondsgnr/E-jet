 /**
 * JetSkeleton — Linear/Vercel-style pulse skeleton primitives.
 *
 * C spine: Uses GLASS_COLORS for mode-aware pulse colors.
 * Composable: Use primitives to build screen-specific skeleton layouts.
 *
 * Usage:
 *   <JetSkeleton colorMode="dark">
 *     <SkeletonHero colorMode="dark" />
 *     <SkeletonList colorMode="dark" rows={3} />
 *   </JetSkeleton>
 */

import { GLASS_COLORS, type GlassColorMode } from "../../config/project";

// ---------------------------------------------------------------------------
// Pulse keyframe style (injected once)
// ---------------------------------------------------------------------------
const pulseKeyframes = `
@keyframes jetPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}
`;

let injected = false;
function injectPulse() {
  if (injected || typeof document === "undefined") return;
  const style = document.createElement("style");
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);
  injected = true;
}

// ---------------------------------------------------------------------------
// Primitive: SkeletonBox
// ---------------------------------------------------------------------------
export function SkeletonBox({
  width,
  height,
  rounded = "8px",
  colorMode,
  className = "",
  style: extraStyle,
}: {
  width?: string | number;
  height?: string | number;
  rounded?: string;
  colorMode: GlassColorMode;
  className?: string;
  style?: React.CSSProperties;
}) {
  injectPulse();
  const c = GLASS_COLORS[colorMode];
  return (
    <div
      className={className}
      style={{
        width,
        height,
        borderRadius: rounded,
        background: c.surface.hover,
        animation: "jetPulse 1.8s ease-in-out infinite",
        ...extraStyle,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Primitive: SkeletonCircle
// ---------------------------------------------------------------------------
export function SkeletonCircle({
  size = 40,
  colorMode,
  className = "",
}: {
  size?: number;
  colorMode: GlassColorMode;
  className?: string;
}) {
  injectPulse();
  const c = GLASS_COLORS[colorMode];
  return (
    <div
      className={`shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: c.surface.hover,
        animation: "jetPulse 1.8s ease-in-out infinite",
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Compound: SkeletonHero (big number + subtitle)
// ---------------------------------------------------------------------------
export function SkeletonHero({
  colorMode,
}: {
  colorMode: GlassColorMode;
}) {
  return (
    <div className="flex flex-col items-center py-4">
      <SkeletonBox
        width={160}
        height={36}
        rounded="10px"
        colorMode={colorMode}
        style={{ marginBottom: 8 }}
      />
      <SkeletonBox
        width={100}
        height={14}
        rounded="6px"
        colorMode={colorMode}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compound: SkeletonStatCards (row of 2-3 stat boxes)
// ---------------------------------------------------------------------------
export function SkeletonStatCards({
  count = 3,
  colorMode,
}: {
  count?: number;
  colorMode: GlassColorMode;
}) {
  return (
    <div className="flex gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex-1 px-3 py-3 rounded-xl"
          style={{ background: GLASS_COLORS[colorMode].surface.subtle }}
        >
          <SkeletonBox
            width={16}
            height={16}
            rounded="4px"
            colorMode={colorMode}
            style={{ marginBottom: 8, animationDelay: `${i * 0.15}s` }}
          />
          <SkeletonBox
            width="60%"
            height={16}
            rounded="5px"
            colorMode={colorMode}
            style={{ marginBottom: 4, animationDelay: `${i * 0.15}s` }}
          />
          <SkeletonBox
            width="40%"
            height={10}
            rounded="4px"
            colorMode={colorMode}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compound: SkeletonListItem (icon + 2 text lines + right value)
// ---------------------------------------------------------------------------
function SkeletonListItem({
  colorMode,
  delay = 0,
}: {
  colorMode: GlassColorMode;
  delay?: number;
}) {
  const c = GLASS_COLORS[colorMode];
  return (
    <div
      className="flex items-center gap-3 px-3.5 py-3 rounded-xl"
      style={{ background: c.surface.subtle }}
    >
      <SkeletonBox
        width={36}
        height={36}
        rounded="10px"
        colorMode={colorMode}
        style={{ animationDelay: `${delay}s` }}
      />
      <div className="flex-1 space-y-1.5">
        <SkeletonBox
          width="55%"
          height={12}
          rounded="4px"
          colorMode={colorMode}
          style={{ animationDelay: `${delay + 0.05}s` }}
        />
        <SkeletonBox
          width="35%"
          height={10}
          rounded="4px"
          colorMode={colorMode}
          style={{ animationDelay: `${delay + 0.1}s` }}
        />
      </div>
      <SkeletonBox
        width={48}
        height={14}
        rounded="5px"
        colorMode={colorMode}
        style={{ animationDelay: `${delay + 0.05}s` }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compound: SkeletonList (n list items)
// ---------------------------------------------------------------------------
export function SkeletonList({
  rows = 4,
  colorMode,
}: {
  rows?: number;
  colorMode: GlassColorMode;
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonListItem
          key={i}
          colorMode={colorMode}
          delay={i * 0.1}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Compound: SkeletonSparkline (chart placeholder)
// ---------------------------------------------------------------------------
export function SkeletonSparkline({
  colorMode,
}: {
  colorMode: GlassColorMode;
}) {
  return (
    <SkeletonBox
      width="100%"
      height={44}
      rounded="8px"
      colorMode={colorMode}
    />
  );
}

// ---------------------------------------------------------------------------
// Compound: SkeletonPills (horizontal scrolling pills)
// ---------------------------------------------------------------------------
export function SkeletonPills({
  count = 4,
  colorMode,
}: {
  count?: number;
  colorMode: GlassColorMode;
}) {
  return (
    <div className="flex gap-2 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBox
          key={i}
          width={80 + Math.random() * 40}
          height={32}
          rounded="10px"
          colorMode={colorMode}
          style={{ animationDelay: `${i * 0.1}s`, flexShrink: 0 }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen-specific: RiderHomeSkeleton
// ---------------------------------------------------------------------------
export function RiderHomeSkeleton({
  colorMode,
}: {
  colorMode: GlassColorMode;
}) {
  return (
    <div className="px-5 pt-6 space-y-5">
      {/* Greeting */}
      <div className="space-y-2">
        <SkeletonBox width={140} height={20} rounded="6px" colorMode={colorMode} />
        <SkeletonBox width={200} height={14} rounded="5px" colorMode={colorMode} />
      </div>
      {/* Search bar */}
      <SkeletonBox width="100%" height={48} rounded="14px" colorMode={colorMode} />
      {/* Quick action pills */}
      <SkeletonPills count={4} colorMode={colorMode} />
      {/* Saved places */}
      <div className="space-y-2">
        <SkeletonBox width={90} height={12} rounded="4px" colorMode={colorMode} />
        <SkeletonList rows={2} colorMode={colorMode} />
      </div>
      {/* Recent rides */}
      <div className="space-y-2">
        <SkeletonBox width={80} height={12} rounded="4px" colorMode={colorMode} />
        <SkeletonList rows={3} colorMode={colorMode} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen-specific: ActivitySkeleton
// ---------------------------------------------------------------------------
export function ActivitySkeleton({
  colorMode,
}: {
  colorMode: GlassColorMode;
}) {
  return (
    <div className="px-5 pt-4 space-y-5">
      {/* Hero spend */}
      <SkeletonHero colorMode={colorMode} />
      {/* Sparkline */}
      <SkeletonSparkline colorMode={colorMode} />
      {/* Insight cards */}
      <SkeletonStatCards count={3} colorMode={colorMode} />
      {/* Frequent places pills */}
      <div className="space-y-2">
        <SkeletonBox width={100} height={12} rounded="4px" colorMode={colorMode} />
        <SkeletonPills count={3} colorMode={colorMode} />
      </div>
      {/* Trip list */}
      <div className="space-y-2">
        <SkeletonBox width={60} height={12} rounded="4px" colorMode={colorMode} />
        <SkeletonList rows={4} colorMode={colorMode} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen-specific: WalletSkeleton
// ---------------------------------------------------------------------------
export function WalletSkeleton({
  colorMode,
}: {
  colorMode: GlassColorMode;
}) {
  return (
    <div className="px-5 pt-4 space-y-5">
      {/* Balance card */}
      <div
        className="rounded-2xl px-5 py-6"
        style={{ background: GLASS_COLORS[colorMode].surface.subtle }}
      >
        <SkeletonBox width={80} height={12} rounded="4px" colorMode={colorMode} style={{ marginBottom: 8 }} />
        <SkeletonBox width={140} height={32} rounded="8px" colorMode={colorMode} style={{ marginBottom: 12 }} />
        <div className="flex gap-2">
          <SkeletonBox width="50%" height={40} rounded="10px" colorMode={colorMode} />
          <SkeletonBox width="50%" height={40} rounded="10px" colorMode={colorMode} />
        </div>
      </div>
      {/* Payment methods */}
      <div className="space-y-2">
        <SkeletonBox width={120} height={12} rounded="4px" colorMode={colorMode} />
        <SkeletonList rows={2} colorMode={colorMode} />
      </div>
      {/* Transactions */}
      <div className="space-y-2">
        <SkeletonBox width={100} height={12} rounded="4px" colorMode={colorMode} />
        <SkeletonList rows={5} colorMode={colorMode} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen-specific: EarningsHomeSkeleton (driver)
// ---------------------------------------------------------------------------
export function EarningsHomeSkeleton({
  colorMode,
}: {
  colorMode: GlassColorMode;
}) {
  return (
    <div className="px-5 pt-4 space-y-5">
      {/* Hero balance */}
      <SkeletonHero colorMode={colorMode} />
      {/* Stat row */}
      <SkeletonStatCards count={3} colorMode={colorMode} />
      {/* Sparkline */}
      <SkeletonSparkline colorMode={colorMode} />
      {/* Last trip */}
      <div className="space-y-2">
        <SkeletonBox width={80} height={12} rounded="4px" colorMode={colorMode} />
        <SkeletonListItem colorMode={colorMode} />
      </div>
      {/* Demand zones */}
      <div className="space-y-2">
        <SkeletonBox width={100} height={12} rounded="4px" colorMode={colorMode} />
        <SkeletonList rows={3} colorMode={colorMode} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen-specific: EarningsHistorySkeleton (driver)
// ---------------------------------------------------------------------------
export function EarningsHistorySkeleton({
  colorMode,
}: {
  colorMode: GlassColorMode;
}) {
  return (
    <div className="px-5 pt-4 space-y-4">
      {/* Period selector */}
      <SkeletonPills count={3} colorMode={colorMode} />
      {/* Trip list */}
      <SkeletonList rows={6} colorMode={colorMode} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen-specific: SavedPlacesSkeleton
// ---------------------------------------------------------------------------
export function SavedPlacesSkeleton({
  colorMode,
}: {
  colorMode: GlassColorMode;
}) {
  return (
    <div className="px-5 pt-4 space-y-4">
      {/* Search */}
      <SkeletonBox width="100%" height={44} rounded="12px" colorMode={colorMode} />
      {/* Category pills */}
      <SkeletonPills count={4} colorMode={colorMode} />
      {/* Places list */}
      <SkeletonList rows={5} colorMode={colorMode} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Screen-specific: ScheduledRidesSkeleton
// ---------------------------------------------------------------------------
export function ScheduledRidesSkeleton({
  colorMode,
}: {
  colorMode: GlassColorMode;
}) {
  return (
    <div className="px-5 pt-4 space-y-4">
      {/* Upcoming label */}
      <SkeletonBox width={100} height={12} rounded="4px" colorMode={colorMode} />
      {/* Ride cards */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl px-4 py-4 space-y-3"
          style={{
            background: GLASS_COLORS[colorMode].surface.subtle,
          }}
        >
          <div className="flex justify-between">
            <SkeletonBox width={120} height={14} rounded="5px" colorMode={colorMode} style={{ animationDelay: `${i * 0.1}s` }} />
            <SkeletonBox width={60} height={14} rounded="5px" colorMode={colorMode} style={{ animationDelay: `${i * 0.1}s` }} />
          </div>
          <SkeletonBox width="70%" height={12} rounded="4px" colorMode={colorMode} style={{ animationDelay: `${i * 0.1 + 0.05}s` }} />
          <SkeletonBox width="50%" height={12} rounded="4px" colorMode={colorMode} style={{ animationDelay: `${i * 0.1 + 0.1}s` }} />
        </div>
      ))}
    </div>
  );
}
