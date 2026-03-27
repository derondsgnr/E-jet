 /**
 * JET ADMIN — PLACEHOLDER VIEWS
 *
 * Skeleton views for admin sections not yet built out.
 * Each shows the surface's purpose and mapped actions.
 */

import { motion } from "motion/react";
import {
  Navigation, MapPin, Car, BarChart3, Settings,
  Globe2, Users, Shield, MessageSquare, Gauge,
  FileText, Megaphone, Wrench, Map, Building2,
  CreditCard, Briefcase, Phone, Key, Truck,
  LifeBuoy, Ticket, Send, Bell,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../config/admin-theme";
import { AdminPageShell } from "../components/admin/ui/admin-page-shell";

interface SurfaceConfig {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  description: string;
  sections: { label: string; desc: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color: string }[];
  actions: string[];
}

function PlaceholderView({ config }: { config: SurfaceConfig }) {
  const { t } = useAdminTheme();

  return (
    <AdminPageShell title={config.title} subtitle={config.subtitle}>
      <div className="p-5 max-w-[1200px]">
        {/* Hero description */}
        <motion.div
          className="rounded-2xl p-6 mb-8 flex items-start gap-4"
          style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: t.greenBg }}>
            <config.icon size={22} style={{ color: BRAND.green }} />
          </div>
          <div>
            <span className="block mb-1" style={{ ...TY.sub, fontSize: "16px", color: t.text }}>{config.title}</span>
            <span style={{ ...TY.bodyR, fontSize: "13px", color: t.textMuted }}>{config.description}</span>
          </div>
        </motion.div>

        {/* Sections */}
        <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>
          SECTIONS
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {config.sections.map((section, i) => (
            <motion.div
              key={section.label}
              className="p-4 rounded-2xl"
              style={{ background: t.surfaceRaised, border: `1px solid ${t.borderSubtle}`, boxShadow: t.shadow }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.04 }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ background: `${section.color}12` }}>
                <section.icon size={16} style={{ color: section.color }} />
              </div>
              <span className="block mb-0.5" style={{ ...TY.body, fontSize: "13px", color: t.text }}>{section.label}</span>
              <span style={{ ...TY.bodyR, fontSize: "11px", color: t.textMuted }}>{section.desc}</span>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <span className="block mb-3" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>
          AVAILABLE ACTIONS
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {config.actions.map((action, i) => (
            <motion.div
              key={action}
              className="flex items-center gap-2 px-4 h-11 rounded-xl"
              style={{ background: t.surface, border: `1px solid ${t.borderSubtle}` }}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.03 }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: BRAND.green }} />
              <span style={{ ...TY.body, fontSize: "12px", color: t.textTertiary }}>{action}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminPageShell>
  );
}

/* ─── RIDERS ─────────────────────────────────────────────────────────────── */
const RIDERS_CONFIG: SurfaceConfig = {
  title: "Riders",
  subtitle: "User management",
  icon: Navigation,
  description: "Rider accounts, trip history, payment methods, and support interactions. View rider behavior patterns and lifetime value metrics.",
  sections: [
    { label: "Rider Directory", desc: "Searchable table with activity, spend, and rating", icon: Users, color: STATUS.info },
    { label: "Trip History", desc: "Full trip log with route replay and fare audit", icon: MapPin, color: BRAND.green },
    { label: "Support Tickets", desc: "Active tickets linked to rider accounts", icon: MessageSquare, color: STATUS.warning },
  ],
  actions: [
    "View rider profile", "Search by phone/email", "View trip history",
    "Issue credit / refund", "Suspend / reactivate account", "Export rider data",
    "View payment methods", "Send push notification", "Flag for review",
  ],
};

/* ─── RIDES ──────────────────────────────────────────────────────────────── */
const RIDES_CONFIG: SurfaceConfig = {
  title: "Rides",
  subtitle: "Trip management",
  icon: MapPin,
  description: "Live and historical trip data across all booking sources. Monitor active rides, investigate completed trips, and audit fare calculations across rider-booked and hotel-booked rides.",
  sections: [
    { label: "Live Rides", desc: "Real-time map of all active trips", icon: Map, color: BRAND.green },
    { label: "Trip Log", desc: "Searchable history with filters by source, state, zone, time", icon: FileText, color: STATUS.info },
    { label: "Hotel Bookings", desc: "Rides booked by hotel partners on behalf of guests", icon: Building2, color: STATUS.warning },
    { label: "Fare Audit", desc: "Investigate fare calculations, surge, and pricing", icon: Gauge, color: "#F97316" },
  ],
  actions: [
    "Monitor live ride", "Filter by booking source", "Replay trip route",
    "Audit fare calculation", "Cancel active ride", "Investigate anomaly",
    "Export trip data", "View ride heatmap", "Override fare",
  ],
};

/* ─── FLEET ──────────────────────────────────────────────────────────────── */
const FLEET_CONFIG: SurfaceConfig = {
  title: "Fleet",
  subtitle: "Fleet owners & vehicles",
  icon: Car,
  description: "B2B supply-side partner management. Fleet owner accounts, driver rosters, vehicle registries, payouts, and performance metrics.",
  sections: [
    { label: "Fleet Owners", desc: "Partner accounts, contracts, driver rosters, and payouts", icon: Briefcase, color: STATUS.info },
    { label: "Vehicle Registry", desc: "All registered vehicles with status, specs, and assignments", icon: Car, color: BRAND.green },
    { label: "EV Dashboard", desc: "EV fleet tracking — charge levels, range, utilization", icon: Gauge, color: STATUS.warning },
    { label: "Onboarding Pipeline", desc: "Fleet application → verification → vehicle approval → live", icon: Shield, color: "#F97316" },
    { label: "Maintenance", desc: "Inspection schedules and maintenance tracking", icon: Wrench, color: "#737373" },
  ],
  actions: [
    "View fleet owner profile", "Onboard new fleet partner", "View driver roster",
    "Register new vehicle", "Assign vehicle to driver", "Schedule inspection",
    "Manage fleet payouts", "Adjust commission rate", "Suspend fleet operations",
    "Check EV charge status", "Export fleet report",
  ],
};

/* ─── ANALYTICS ──────────────────────────────────────────────────────────── */
const ANALYTICS_CONFIG: SurfaceConfig = {
  title: "Analytics",
  subtitle: "Deep dives",
  icon: BarChart3,
  description: "Advanced analytics across all platform dimensions. Supply-demand modeling, cohort analysis, geographic expansion insights, and financial projections.",
  sections: [
    { label: "Supply & Demand", desc: "Driver availability vs ride requests over time", icon: Gauge, color: BRAND.green },
    { label: "Revenue Analytics", desc: "Revenue trends, ARPU, take rate, LTV projections", icon: BarChart3, color: STATUS.info },
    { label: "Geographic Insights", desc: "State/zone performance, expansion readiness scores", icon: Globe2, color: STATUS.warning },
    { label: "Cohort Analysis", desc: "Rider/driver retention, churn, activation metrics", icon: Users, color: "#F97316" },
  ],
  actions: [
    "Run supply-demand model", "Generate cohort report", "Compare state performance",
    "Forecast next month revenue", "Export analytics dashboard", "Set up custom alert",
    "Build custom report", "Share dashboard link", "Schedule recurring report",
  ],
};

/* ─── SETTINGS ───────────────────────────────────────────────────────────── */
const SETTINGS_CONFIG: SurfaceConfig = {
  title: "Settings",
  subtitle: "Configuration",
  icon: Settings,
  description: "Platform configuration, admin user management, pricing rules, notification templates, compliance settings, and audit trail.",
  sections: [
    { label: "Admin Users", desc: "Roles, permissions, and access control", icon: Shield, color: STATUS.error },
    { label: "Pricing Rules", desc: "Base fares, surge multipliers, commission rates", icon: Gauge, color: BRAND.green },
    { label: "Notifications", desc: "Push, SMS, and email templates", icon: Megaphone, color: STATUS.info },
    { label: "Compliance", desc: "Regulatory settings, data retention, audit trail", icon: FileText, color: STATUS.warning },
    { label: "Integrations", desc: "Paystack, SMS gateway, maps API keys", icon: Wrench, color: "#F97316" },
  ],
  actions: [
    "Add admin user", "Edit role permissions", "Update fare formula",
    "Configure surge rules", "Edit notification template", "View audit trail",
    "Export compliance report", "Manage API keys", "Set data retention policy",
  ],
};

/* ─── HOTELS ─────────────────────────────────────────────────────────────── */
const HOTELS_CONFIG: SurfaceConfig = {
  title: "Hotels",
  subtitle: "Hotel partners",
  icon: Building2,
  description: "B2B demand-side partner management. Hotel accounts, guest bookings, corporate billing, API integrations, and partnership tiers.",
  sections: [
    { label: "Partner Directory", desc: "All hotel partner accounts with status and tier", icon: Building2, color: STATUS.info },
    { label: "Bookings", desc: "Guest rides booked by hotels, volume metrics", icon: MapPin, color: BRAND.green },
    { label: "Billing & Invoicing", desc: "Corporate invoices, payment status, reconciliation", icon: CreditCard, color: STATUS.warning },
    { label: "API & Integrations", desc: "Integration status, API keys, webhook configuration", icon: Key, color: "#F97316" },
    { label: "Onboarding Pipeline", desc: "Application → review → contract → integration → live", icon: Shield, color: "#737373" },
  ],
  actions: [
    "View hotel profile", "Onboard new hotel partner", "Generate invoice",
    "View guest bookings", "Manage API keys", "Adjust contract terms",
    "Suspend partnership", "Issue billing credit", "Contact account manager",
    "Export booking report", "View partnership metrics",
  ],
};

/* ─── SUPPORT ────────────────────────────────────────────────────────────── */
const SUPPORT_CONFIG: SurfaceConfig = {
  title: "Support",
  subtitle: "B2B cases",
  icon: LifeBuoy,
  description: "Account-level support cases from fleet owners and hotel partners. Billing issues, technical problems, account management, and operational requests — separate from ride-level disputes.",
  sections: [
    { label: "Case Queue", desc: "Active cases by priority, partner type, and category", icon: Ticket, color: STATUS.info },
    { label: "Fleet Owner Cases", desc: "Payout issues, driver concerns, vehicle disputes", icon: Truck, color: BRAND.green },
    { label: "Hotel Cases", desc: "Billing discrepancies, API issues, contract questions", icon: Building2, color: STATUS.warning },
    { label: "Resolved Archive", desc: "Closed cases with full resolution history", icon: FileText, color: "#737373" },
  ],
  actions: [
    "View case detail", "Assign to admin", "Link to ride or dispute",
    "Escalate to account manager", "Contact partner", "Add internal note",
    "Update case status", "Export case report", "Flag for finance review",
  ],
};

/* ─── COMMUNICATIONS ─────────────────────────────────────────────────────── */
const COMMS_CONFIG: SurfaceConfig = {
  title: "Communications",
  subtitle: "Broadcasts & messaging",
  icon: Megaphone,
  description: "Platform-wide and targeted communications across all user types. Rider promos, driver policy updates, hotel partner announcements, fleet owner notifications, and system-wide alerts.",
  sections: [
    { label: "Broadcast Center", desc: "Send messages to riders, drivers, or partner segments", icon: Send, color: STATUS.info },
    { label: "Partner Announcements", desc: "Hotel and fleet owner communications", icon: Building2, color: BRAND.green },
    { label: "Notification Templates", desc: "Manage push, SMS, and email templates", icon: Bell, color: STATUS.warning },
    { label: "Delivery Log", desc: "Message delivery status and engagement metrics", icon: FileText, color: "#737373" },
  ],
  actions: [
    "Create broadcast", "Send to rider segment", "Send to driver segment",
    "Announce to hotel partners", "Announce to fleet owners", "Edit template",
    "View delivery stats", "Schedule message", "System maintenance alert",
  ],
};

/* ─── EXPORTS ────────────────────────────────────────────────────────────── */
export function AdminRiders() { return <PlaceholderView config={RIDERS_CONFIG} />; }
export function AdminRides() { return <PlaceholderView config={RIDES_CONFIG} />; }
export function AdminFleet() { return <PlaceholderView config={FLEET_CONFIG} />; }
export function AdminHotels() { return <PlaceholderView config={HOTELS_CONFIG} />; }
export function AdminSupport() { return <PlaceholderView config={SUPPORT_CONFIG} />; }
export function AdminComms() { return <PlaceholderView config={COMMS_CONFIG} />; }
export function AdminAnalytics() { return <PlaceholderView config={ANALYTICS_CONFIG} />; }
export function AdminSettings() { return <PlaceholderView config={SETTINGS_CONFIG} />; }