/**
 * JET Demo Launcher — Entry point for all six surfaces.
 *
 * Organized into:
 *   - Mobile apps (Rider + Driver) with onboarding + active states
 *   - Web surfaces (Website, Fleet, Hotel, Admin)
 *
 * C spine materials: glass, ambient glows, noise texture.
 */

import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Navigation,
  Car,
  ArrowRight,
  Smartphone,
  Zap,
  Globe,
  TrendingUp,
  Building2,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { BRAND_COLORS } from "../config/brand";
import { JetLogo } from "../components/brand/jet-logo";

export function Launcher() {
  const navigate = useNavigate();

  const mobileApps = [
    {
      id: "rider",
      icon: Navigation,
      title: "Rider App",
      description: "Book rides, track drivers, manage trips",
      color: BRAND_COLORS.green,
      onboarding: "/rider/onboarding",
      active: "/rider",
    },
    {
      id: "driver",
      icon: Car,
      title: "Driver App",
      description: "Accept trips, track earnings, manage vehicle",
      color: "#3B82F6",
      onboarding: "/driver/onboarding",
      active: "/driver",
    },
  ];

  const webSurfaces = [
    {
      id: "website",
      icon: Globe,
      title: "Marketing Website",
      description: "Public-facing landing page",
      color: BRAND_COLORS.green,
      route: "/website",
      ready: true,
    },
    {
      id: "fleet",
      icon: TrendingUp,
      title: "Fleet Owner",
      description: "Vehicle & driver management",
      color: "#F59E0B",
      route: "/fleet",
      ready: true,
    },
    {
      id: "hotel",
      icon: Building2,
      title: "Hotel Portal",
      description: "Guest transport booking",
      color: "#8B5CF6",
      route: "/hotel",
      ready: true,
    },
    {
      id: "admin",
      icon: ShieldCheck,
      title: "Admin Dashboard",
      description: "Platform management & ops",
      color: "#EF4444",
      route: "/admin",
      ready: true,
    },
  ];

  return (
    <div
      className="relative min-h-screen w-full overflow-auto flex flex-col"
      style={{ background: "#0B0B0D" }}
    >
      {/* Ambient glow — bottom center */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[400px] pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${BRAND_COLORS.green}12 0%, transparent 70%)`,
        }}
      />
      {/* Ambient glow — top right */}
      <div
        className="absolute -top-20 -right-20 w-[300px] h-[300px] pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${BRAND_COLORS.green}08 0%, transparent 60%)`,
        }}
      />
      {/* Noise */}
      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Content */}
      <div className="relative z-[2] flex-1 flex flex-col items-center px-6 max-w-lg mx-auto w-full py-16">
        {/* Logo + title */}
        <motion.div
          className="flex flex-col items-center mb-10"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <JetLogo variant="icon" height={40} mode="dark" />
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "28px",
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: "1.2",
              color: "#FFFFFF",
              marginTop: "16px",
            }}
          >
            JET
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              fontWeight: 400,
              letterSpacing: "-0.02em",
              lineHeight: "1.5",
              color: "rgba(255,255,255,0.45)",
              marginTop: "4px",
              textAlign: "center",
            }}
          >
            Premium e-hailing for Nigeria
          </p>
        </motion.div>

        {/* ── Section: Mobile Apps ── */}
        <motion.div
          className="w-full mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Mobile apps
          </span>
        </motion.div>

        <div className="w-full flex flex-col gap-4 mb-8">
          {mobileApps.map((app, i) => {
            const Icon = app.icon;
            return (
              <motion.div
                key={app.id}
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                <div className="px-5 pt-5 pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${app.color}15` }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: app.color }}
                      />
                    </div>
                    <div>
                      <h2
                        style={{
                          fontFamily: "var(--font-heading)",
                          fontSize: "18px",
                          fontWeight: 600,
                          letterSpacing: "-0.02em",
                          color: "#FFFFFF",
                        }}
                      >
                        {app.title}
                      </h2>
                      <p
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "13px",
                          fontWeight: 400,
                          letterSpacing: "-0.02em",
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        {app.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 flex gap-2">
                  <motion.button
                    className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                    style={{ background: app.color }}
                    onClick={() => navigate(app.onboarding)}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Smartphone
                      className="w-4 h-4"
                      style={{ color: "#fff" }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "14px",
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        color: "#fff",
                      }}
                    >
                      Onboarding
                    </span>
                  </motion.button>

                  <motion.button
                    className="flex-1 py-3 rounded-xl flex items-center justify-center gap-2"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    onClick={() => navigate(app.active)}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontSize: "14px",
                        fontWeight: 600,
                        letterSpacing: "-0.02em",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      Dashboard
                    </span>
                    <ArrowRight
                      className="w-4 h-4"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Section: Web Surfaces ── */}
        <motion.div
          className="w-full mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            Web surfaces
          </span>
        </motion.div>

        <div className="w-full grid grid-cols-2 gap-3 mb-8">
          {webSurfaces.map((surface, i) => {
            const Icon = surface.icon;
            return (
              <motion.button
                key={surface.id}
                className="rounded-2xl p-4 text-left relative overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  opacity: surface.ready ? 1 : 0.55,
                }}
                onClick={() => navigate(surface.route)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: surface.ready ? 1 : 0.55, y: 0 }}
                transition={{ duration: 0.4, delay: 0.45 + i * 0.06 }}
                whileTap={surface.ready ? { scale: 0.97 } : undefined}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: `${surface.color}12` }}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: surface.color }}
                  />
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "15px",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    color: "#fff",
                  }}
                >
                  {surface.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                    color: "rgba(255,255,255,0.35)",
                    marginTop: "2px",
                  }}
                >
                  {surface.description}
                </p>
                {!surface.ready && (
                  <div
                    className="absolute top-3 right-3 px-2 py-0.5 rounded"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      fontFamily: "var(--font-body)",
                      fontSize: "10px",
                      fontWeight: 500,
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    Soon
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Driver verification shortcut */}
        <motion.button
          className="px-4 py-2.5 rounded-xl flex items-center gap-2"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          onClick={() => navigate("/driver/verification")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileTap={{ scale: 0.97 }}
        >
          <Zap
            className="w-3.5 h-3.5"
            style={{ color: "rgba(255,255,255,0.3)" }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Driver verification flow
          </span>
        </motion.button>

        <motion.button
          className="px-4 py-2.5 rounded-xl flex items-center gap-2 mt-2"
          style={{
            background: `${BRAND_COLORS.green}08`,
            border: `1px solid ${BRAND_COLORS.green}20`,
          }}
          onClick={() => navigate("/briefing")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          whileTap={{ scale: 0.97 }}
        >
          <FileText
            className="w-3.5 h-3.5"
            style={{ color: BRAND_COLORS.green }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: `${BRAND_COLORS.green}aa`,
            }}
          >
            Admin briefing
          </span>
        </motion.button>

        <motion.button
          className="px-4 py-2.5 rounded-xl flex items-center gap-2 mt-2"
          style={{
            background: "rgba(139,92,246,0.06)",
            border: "1px solid rgba(139,92,246,0.15)",
          }}
          onClick={() => navigate("/guest-tracking")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          whileTap={{ scale: 0.97 }}
        >
          <Smartphone
            className="w-3.5 h-3.5"
            style={{ color: "#8B5CF6" }}
          />
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "rgba(139,92,246,0.7)",
            }}
          >
            Guest tracking (SMS link)
          </span>
        </motion.button>

        {/* Footer */}
        <motion.p
          className="mt-auto pt-8 pb-4"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.2)",
            textAlign: "center",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Demo prototype · Not for production
        </motion.p>
      </div>
    </div>
  );
}