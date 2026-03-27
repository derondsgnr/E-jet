/**
 * ONBOARDING — WELCOME
 * Full screen, no shell. One CTA to zone setup.
 */

import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { AdminThemeProvider, useAdminTheme, BRAND, TY } from "../config/admin-theme";

function WelcomeInner() {
  const navigate = useNavigate();
  const { t } = useAdminTheme();

  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center px-6"
      style={{ background: t.bg }}
    >
      {/* Logo — top left */}
      <div className="absolute top-8 left-8">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: `${BRAND.green}12`,
            border: `1px solid ${BRAND.green}20`,
          }}
        >
          <span
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "-0.03em",
              color: BRAND.green,
            }}
          >
            J
          </span>
        </div>
      </div>

      {/* Centered content */}
      <motion.div
        className="max-w-md text-center"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1
          className="mb-4"
          style={{
            ...TY.h,
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 600,
            fontSize: "32px",
            letterSpacing: "-0.03em",
            color: t.text,
          }}
        >
          Welcome to JET Admin
        </h1>

        <p
          className="mb-2"
          style={{
            ...TY.body,
            fontSize: "15px",
            letterSpacing: "-0.02em",
            color: t.textSecondary,
            lineHeight: 1.5,
          }}
        >
          You're the control centre for Nigeria's smartest
          mobility platform. Let's get you set up.
        </p>

        <p
          className="mb-8"
          style={{
            ...TY.body,
            fontSize: "15px",
            letterSpacing: "-0.02em",
            color: t.textTertiary,
            lineHeight: 1.5,
          }}
        >
          One thing to do first — define where JET operates.
        </p>

        <motion.button
          className="h-12 px-6 rounded-xl flex items-center justify-center gap-2 mx-auto"
          style={{
            background: BRAND.green,
            border: `1px solid ${BRAND.green}`,
            minHeight: 44,
          }}
          onClick={() => navigate("/onboarding-zones")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span
            style={{
              ...TY.body,
              fontSize: "13px",
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
            }}
          >
            Set up service zones
          </span>
          <ArrowRight size={14} style={{ color: "#FFFFFF" }} />
        </motion.button>
      </motion.div>

      {/* Bottom text */}
      <div className="absolute bottom-8">
        <span
          style={{
            ...TY.bodyR,
            fontSize: "11px",
            color: t.textFaint,
          }}
        >
          Takes about 5 minutes
        </span>
      </div>
    </div>
  );
}

export function AdminOnboardingWelcome() {
  return (
    <AdminThemeProvider>
      <WelcomeInner />
    </AdminThemeProvider>
  );
}
