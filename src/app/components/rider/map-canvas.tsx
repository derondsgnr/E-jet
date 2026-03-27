 /**
 * MapCanvas — Full-bleed map background for the Rider app.
 *
 * Currently renders a simulated map (static image + overlays).
 * Designed for drop-in replacement with a real map SDK.
 *
 * ── DARK MODE ──
 * Uses a dark aerial city photo. Gradients deepen the bottom for content.
 * Green glows add brand atmosphere. Everything lives IN the darkness.
 *
 * ── LIGHT MODE ──
 * Uses a SEPARATE light-toned aerial photo. Apple Maps energy.
 * The image itself is bright, so we need less gradient trickery.
 * Subtle bottom fade to #FAFAFA for content readability.
 * Route line and location pulse use softer opacities.
 * Grid overlay is hidden — it adds noise on bright backgrounds.
 *
 * ── INTEGRATION GUIDE ──
 * When ready for a real map SDK, pass `useSimulated={false}` and provide
 * a `mapContainerRef` callback. The component renders an empty container
 * div that the SDK can attach to, plus all overlay layers on top.
 */

import { motion } from "motion/react";
import { useCallback, useRef, type RefCallback } from "react";

const MAP_IMAGE_DARK =
  "https://images.unsplash.com/photo-1593099623478-40e6cd012a16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwY2l0eSUyMG1hcCUyMG5pZ2h0JTIwYWVyaWFsJTIwdmlld3xlbnwxfHx8fDE3NzI1MzU3Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const MAP_IMAGE_LIGHT =
  "https://images.unsplash.com/photo-1542382257-80dedb725088?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodCUyMGNpdHklMjBtYXAlMjBhZXJpYWwlMjB2aWV3JTIwZGF5dGltZXxlbnwxfHx8fDE3NzI1NDI4Njl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

/* ── Map style configuration per provider ── */
export interface MapStyleConfig {
  provider: "google" | "mapbox" | "apple";
  lightStyle?: string;
  darkStyle?: string;
  options?: Record<string, unknown>;
}

interface MapCanvasProps {
  variant?: "dark" | "muted" | "warm";
  colorMode?: "dark" | "light";
  className?: string;
  useSimulated?: boolean;
  mapStyle?: MapStyleConfig;
  mapContainerRef?: RefCallback<HTMLDivElement>;
  onMapReady?: () => void;
}

export function MapCanvas({
  variant = "dark",
  colorMode = "dark",
  className = "",
  useSimulated = true,
  mapStyle,
  mapContainerRef,
}: MapCanvasProps) {
  const isLight = colorMode === "light";
  const isRealMap = !useSimulated;

  const activeMapStyle = mapStyle
    ? (isLight ? mapStyle.lightStyle : mapStyle.darkStyle) ?? undefined
    : undefined;

  const darkOverlays: Record<string, string> = {
    dark: "bg-gradient-to-b from-[#0B0B0D]/60 via-transparent to-[#0B0B0D]/80",
    muted: "bg-gradient-to-b from-[#0B0B0D]/40 via-[#0B0B0D]/10 to-[#0B0B0D]/70",
    warm: "bg-gradient-to-b from-[#0B0B0D]/50 via-transparent to-[#0B0B0D]/90",
  };

  const internalRef = useRef<HTMLDivElement>(null);
  const mergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      (internalRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      mapContainerRef?.(node);
    },
    [mapContainerRef],
  );

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* ──────────────── MAP LAYER ──────────────── */}
      {useSimulated ? (
        <img
          src={isLight ? MAP_IMAGE_LIGHT : MAP_IMAGE_DARK}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={
            isLight
              ? { filter: "saturate(0.4) brightness(1.1) contrast(0.95)" }
              : { filter: "saturate(0.3) brightness(0.6)" }
          }
        />
      ) : (
        <div
          ref={mergedRef}
          className="absolute inset-0"
          data-map-provider={mapStyle?.provider}
          data-map-style={activeMapStyle}
          data-color-mode={colorMode}
        />
      )}

      {/* Street grid overlay — dark mode only (adds noise on light) */}
      {!isLight && (
        <div className="absolute inset-0 opacity-[0.04]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      )}

      {/* ──── MODE-SPECIFIC OVERLAYS ──── */}
      {isLight ? (
        isRealMap ? (
          /* Light + real map: subtle bottom fade only */
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 55%, rgba(250,250,250,0.4) 72%, rgba(250,250,250,0.8) 85%, #FAFAFA 95%)",
            }}
          />
        ) : (
          /* Light + simulated: one clean decisive fade.
             Map visible 0–35%, transition 35–55%, solid by 58%. */
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(250,250,250,0.05) 0%, rgba(250,250,250,0.25) 30%, rgba(250,250,250,0.7) 48%, #FAFAFA 58%)",
            }}
          />
        )
      ) : (
        <div className={`absolute inset-0 ${darkOverlays[variant]}`} />
      )}

      {/* Brand green ambient glow — bottom center */}
      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full ${
          isLight ? "opacity-[0.03]" : "opacity-[0.06]"
        }`}
        style={{
          background: "radial-gradient(ellipse, #1DB954 0%, transparent 70%)",
        }}
      />

      {/* Subtle green glow — top right */}
      <div
        className={`absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full ${
          isLight ? "opacity-[0.02]" : "opacity-[0.04]"
        }`}
        style={{
          background: "radial-gradient(circle, #1DB954 0%, transparent 70%)",
        }}
      />

      {/* Simulated route line */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="routeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1DB954" stopOpacity="0" />
            <stop offset="25%" stopColor="#1DB954" stopOpacity={isLight ? "0.25" : "0.5"} />
            <stop offset="50%" stopColor="#1DB954" stopOpacity={isLight ? "0.15" : "0.5"} />
            <stop offset="75%" stopColor="#1DB954" stopOpacity={isLight ? "0.06" : "0.3"} />
            <stop offset="100%" stopColor="#1DB954" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M 200 150 C 200 250, 250 300, 220 400 S 180 500, 200 600"
          stroke="url(#routeGrad)"
          strokeWidth={isLight ? "2.5" : "3"}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 200 150 C 200 250, 250 300, 220 400 S 180 500, 200 600"
          stroke="#1DB954"
          strokeWidth="12"
          fill="none"
          opacity={isLight ? "0.04" : "0.08"}
          strokeLinecap="round"
        />
      </svg>

      {/* Current location pulse */}
      <div className="absolute top-[38%] left-[50%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className={`absolute inset-0 w-12 h-12 -ml-6 -mt-6 rounded-full border-2 ${
            isLight ? "border-[#1DB954]/60" : "border-[#1DB954]"
          }`}
          animate={{ scale: [1, 2.2], opacity: [0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <div
          className="w-5 h-5 -ml-2.5 -mt-2.5 rounded-full flex items-center justify-center"
          style={{
            background: isLight
              ? "rgba(29,185,84,0.15)"
              : "rgba(29,185,84,0.25)",
          }}
        >
          <div
            className="w-3 h-3 rounded-full bg-[#1DB954]"
            style={{
              boxShadow: isLight
                ? "0 0 8px rgba(29,185,84,0.3)"
                : "0 0 12px rgba(29,185,84,0.5)",
            }}
          />
        </div>
      </div>

      {/* Noise texture overlay */}
      <div
        className={`absolute inset-0 mix-blend-overlay ${
          isLight ? "opacity-[0.015]" : "opacity-[0.03]"
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "128px 128px",
        }}
      />
    </div>
  );
}
