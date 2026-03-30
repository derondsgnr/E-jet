/**
 * ============================================================================
 * JET — ROUTING ARCHITECTURE
 * ============================================================================
 *
 * Six surfaces — all demo-ready:
 *
 *   /                    → Demo Launcher (all surfaces)
 *   /website             → Public marketing website
 *
 * RIDER FLOW:
 *   /rider/onboarding    → Splash → Auth → OTP → KYC → Done → /rider
 *   /rider               → Rider Shell (Home, Activity, Wallet, Account)
 *   /rider/scheduled     → Scheduled rides
 *   /rider/approach      → Driver approach (standalone)
 *   /rider/trip          → In-ride → Complete → Rating → /rider
 *
 * DRIVER FLOW:
 *   /driver/onboarding   → Splash → Auth → OTP → Vehicle → Done → /driver/verification
 *   /driver/verification → Upload docs → Background check → Schedule inspection → /driver
 *   /driver              → Driver Shell (Home, Trips, Wallet, Account)
 *
 * ADMIN DASHBOARD:
 *   /admin               → Command Center (index)
 *   /admin/login          → Admin login
 *   /admin/forgot-password → Admin forgot password
 *   /admin/reset-password  → Admin reset password (from email link)
 *   /admin/rides          → Trip management (all booking sources)
 *   /admin/disputes       → Dispute resolution (ride-level)
 *   /admin/support        → B2B cases (fleet owner + hotel account issues)
 *   /admin/riders         → Rider management
 *   /admin/drivers        → Driver management + verification pipeline
 *   /admin/hotels         → Hotel partner management
 *   /admin/fleet          → Fleet owner + vehicle management
 *   /admin/finance        → Financial visibility (all money flows)
 *   /admin/analytics      → Analytics deep dives
 *   /admin/comms          → Communications + broadcasts
 *   /admin/settings       → Configuration + compliance
 *
 * ============================================================================
 */

import { createBrowserRouter } from "react-router";
import { Launcher } from "./views/launcher";
import { Website } from "./views/website";
import { RiderShell } from "./views/rider-shell";
import { RiderOnboarding } from "./views/rider-onboarding";
import { RiderScheduled } from "./views/rider-scheduled";
import { RiderApproach } from "./views/rider-approach";
import { RiderTrip } from "./views/rider-trip";
import { DriverShell } from "./views/driver-shell";
import { DriverOnboarding } from "./views/driver-onboarding";
import { DriverVerification } from "./views/driver-verification";
import { AdminShell } from "./views/admin-shell";
import { AdminCommandCenter } from "./views/admin-dashboard";
import { AdminDrivers } from "./views/admin-drivers";
import { AdminDisputes } from "./views/admin-disputes";
import { AdminFinance } from "./views/admin-finance";
import { AdminFleetView as AdminFleet } from "./views/admin-fleet-view";
import { AdminHotelsView as AdminHotels } from "./views/admin-hotels-view";
import { AdminRidersPage as AdminRiders } from "./views/admin-riders";
import { AdminSupportPage as AdminSupport } from "./views/admin-support";
import { AdminCommsPage as AdminComms } from "./views/admin-comms";
import { AdminAnalyticsPage as AdminAnalytics } from "./views/admin-analytics";
import { AdminSettingsPage as AdminSettings } from "./views/admin-settings";
import { AdminRidesView } from "./views/admin-rides";

/* ── NEW: Admin Onboarding E2E ── */
import { AdminOnboardingWelcome } from "./views/admin-onboarding-welcome";
import { AdminOnboardingZones } from "./views/admin-onboarding-zones";
import { AdminDashboardEmpty } from "./views/admin-dashboard-empty";
import { AdminSettingsPricing } from "./views/admin-settings-pricing";
import { AdminDriversVerification } from "./views/admin-drivers-verification";
import { AdminHotelsEmpty } from "./views/admin-hotels-empty";
import { AdminHotelsNew } from "./views/admin-hotels-new";
import { AdminHotelsProfile } from "./views/admin-hotels-profile";
import { AdminFleetEmpty } from "./views/admin-fleet-empty";
import { AdminFleetNew } from "./views/admin-fleet-new";
import { AdminFleetProfile } from "./views/admin-fleet-profile";

/* ── NEW: Fleet Owner Dashboard ── */
import { FleetShell } from "./views/fleet-shell";

/* ── NEW: Hotel Partner Dashboard ── */
import { HotelShell } from "./views/hotel-shell";

/* ── NEW: Guest Tracking (public, no auth) ── */
import { GuestTracking } from "./views/guest-tracking";

/* ── Auth Pages (login, forgot-password, reset-password) ── */
import {
  AdminLoginPage, AdminForgotPasswordPage, AdminResetPasswordPage,
  FleetLoginPage, FleetForgotPasswordPage, FleetResetPasswordPage,
  HotelLoginPage, HotelForgotPasswordPage, HotelResetPasswordPage,
} from "./views/auth-pages";

import DSShell from "./views/ds-shell";
import DSFoundation from "./views/ds-foundation";
import DSComponents from "./views/ds-components";
import DSRider from "./views/ds-rider";
import DSAdmin from "./views/ds-admin";
import DSPatterns from "./views/ds-patterns";
import DSDriver from "./views/ds-driver";
import DSFleetPage from "./views/ds-fleet";

export const router = createBrowserRouter([
  /* ── Design System (multi-page) ── */
  {
    path: "/design-system",
    Component: DSShell,
    children: [
      { index: true, Component: DSFoundation },
      { path: "components", Component: DSComponents },
      { path: "rider", Component: DSRider },
      { path: "driver", Component: DSDriver },
      { path: "admin", Component: DSAdmin },
      { path: "fleet", Component: DSFleetPage },
      { path: "patterns", Component: DSPatterns },
    ],
  },


  /* ── Demo Launcher ── */
  {
    path: "/",
    Component: Launcher,
  },

  /* ── Marketing Website ── */
  {
    path: "/website",
    Component: Website,
  },



  /* ── Fleet Owner Shell (with nav + journey states) ── */
  {
    path: "/fleet",
    Component: FleetShell,
  },

  /* ── Hotel Partner Shell (with nav + journey states) ── */
  {
    path: "/hotel",
    Component: HotelShell,
  },

  /* ── Guest Tracking (public, no auth) ── */
  {
    path: "/guest-tracking",
    Component: GuestTracking,
  },

  /* ── Auth Pages — Admin ── */
  { path: "/admin/login", Component: AdminLoginPage },
  { path: "/admin/forgot-password", Component: AdminForgotPasswordPage },
  { path: "/admin/reset-password", Component: AdminResetPasswordPage },

  /* ── Auth Pages — Fleet ── */
  { path: "/fleet/login", Component: FleetLoginPage },
  { path: "/fleet/forgot-password", Component: FleetForgotPasswordPage },
  { path: "/fleet/reset-password", Component: FleetResetPasswordPage },

  /* ── Auth Pages — Hotel ── */
  { path: "/hotel/login", Component: HotelLoginPage },
  { path: "/hotel/forgot-password", Component: HotelForgotPasswordPage },
  { path: "/hotel/reset-password", Component: HotelResetPasswordPage },

  /* ── Rider App ── */
  {
    path: "/rider",
    Component: RiderShell,
  },
  {
    path: "/rider/onboarding",
    Component: RiderOnboarding,
  },
  {
    path: "/rider/scheduled",
    Component: RiderScheduled,
  },
  {
    path: "/rider/approach",
    Component: RiderApproach,
  },
  {
    path: "/rider/trip",
    Component: RiderTrip,
  },

  /* ── Driver App ── */
  {
    path: "/driver",
    Component: DriverShell,
  },
  {
    path: "/driver/onboarding",
    Component: DriverOnboarding,
  },
  {
    path: "/driver/verification",
    Component: DriverVerification,
  },

  /* ── Admin Dashboard ── */
  {
    path: "/admin",
    Component: AdminShell,
    children: [
      { index: true, Component: AdminCommandCenter },
      { path: "rides", Component: AdminRidesView },
      { path: "disputes", Component: AdminDisputes },
      { path: "support", Component: AdminSupport },
      { path: "riders", Component: AdminRiders },
      { path: "drivers", Component: AdminDrivers },
      { path: "hotels", Component: AdminHotels },
      { path: "fleet", Component: AdminFleet },
      { path: "finance", Component: AdminFinance },
      { path: "analytics", Component: AdminAnalytics },
      { path: "comms", Component: AdminComms },
      { path: "settings", Component: AdminSettings },
      /* ── Admin Onboarding E2E ── */
      { path: "onboarding/welcome", Component: AdminOnboardingWelcome },
      { path: "onboarding/zones", Component: AdminOnboardingZones },
      { path: "dashboard-empty", Component: AdminDashboardEmpty },
      { path: "settings/pricing", Component: AdminSettingsPricing },
      { path: "drivers/verification", Component: AdminDriversVerification },
      { path: "hotels/empty", Component: AdminHotelsEmpty },
      { path: "hotels/new", Component: AdminHotelsNew },
      { path: "hotels/profile", Component: AdminHotelsProfile },
      { path: "fleet/empty", Component: AdminFleetEmpty },
      { path: "fleet/new", Component: AdminFleetNew },
      { path: "fleet/profile", Component: AdminFleetProfile },
    ],
  },

  /* Catch-all → launcher */
  {
    path: "*",
    Component: Launcher,
  },
]);