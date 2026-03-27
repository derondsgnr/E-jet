/**
 * JET ADMIN — PROFILE DRAWER (Cross-surface)
 *
 * Right-side drawer for viewing rider/driver/hotel mini-profiles
 * without navigating away from the current context.
 *
 * Surface type: SIDE DRAWER (low-friction, contextual)
 * Pattern: Linear issue detail sidebar
 */

import React from "react";
import {
  Star, Phone, Mail, Calendar,
  Car, Navigation, Building2,
  AlertTriangle, CheckCircle2, ExternalLink,
  Zap, Users,
} from "lucide-react";
import { useAdminTheme, BRAND, STATUS } from "../../../config/admin-theme";
import { AdminDrawer } from "./surfaces";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ProfileData {
  type: "rider" | "driver" | "hotel";
  name: string;
  avatar?: string;
  initials: string;
  // Common
  phone?: string;
  email?: string;
  joinDate?: string;
  status?: "active" | "suspended" | "pending" | "inactive";
  // Rider
  rating?: number;
  totalTrips?: number;
  totalSpend?: string;
  lastActive?: string;
  paymentMethods?: number;
  // Driver
  vehicleType?: string;
  vehiclePlate?: string;
  isEV?: boolean;
  completionRate?: string;
  acceptanceRate?: string;
  totalEarnings?: string;
  verificationStatus?: "verified" | "pending" | "rejected";
  fleet?: string;
  // Hotel
  hotelTier?: "standard" | "premium" | "enterprise";
  guestBookings?: number;
  monthlyVolume?: string;
  contactPerson?: string;
  integrationStatus?: "live" | "testing" | "pending";
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK PROFILES — for demo
// ═══════════════════════════════════════════════════════════════════════════

export const MOCK_PROFILES: Record<string, ProfileData> = {
  "Adewale O.": {
    type: "rider",
    name: "Adewale Ogundimu",
    initials: "AO",
    phone: "+234 812 345 6789",
    email: "adewale.o@gmail.com",
    joinDate: "Mar 2025",
    status: "active",
    rating: 4.8,
    totalTrips: 147,
    totalSpend: "₦482,300",
    lastActive: "2 hours ago",
    paymentMethods: 3,
  },
  "Chinwe A.": {
    type: "rider",
    name: "Chinwe Adebayo",
    initials: "CA",
    phone: "+234 803 456 7890",
    email: "chinwe.a@outlook.com",
    joinDate: "Jan 2025",
    status: "active",
    rating: 4.9,
    totalTrips: 89,
    totalSpend: "₦315,700",
    lastActive: "5 hours ago",
    paymentMethods: 2,
  },
  "Emeka N.": {
    type: "driver",
    name: "Emeka Nwachukwu",
    initials: "EN",
    phone: "+234 706 789 0123",
    email: "emeka.n@jetdriver.ng",
    joinDate: "Nov 2024",
    status: "active",
    rating: 4.7,
    totalTrips: 1203,
    vehicleType: "Toyota Camry 2022",
    vehiclePlate: "LND-482JT",
    isEV: false,
    completionRate: "96.4%",
    acceptanceRate: "91.2%",
    totalEarnings: "₦3,840,000",
    verificationStatus: "verified",
  },
  "Ibrahim K.": {
    type: "driver",
    name: "Ibrahim Kabiru",
    initials: "IK",
    phone: "+234 814 567 8901",
    email: "ibrahim.k@jetdriver.ng",
    joinDate: "Feb 2025",
    status: "active",
    rating: 4.5,
    totalTrips: 467,
    vehicleType: "Hyundai Kona EV",
    vehiclePlate: "ABJ-991EV",
    isEV: true,
    completionRate: "94.1%",
    acceptanceRate: "88.7%",
    totalEarnings: "₦1,290,000",
    verificationStatus: "verified",
    fleet: "GreenWheels NG",
  },
  "Lagos Continental": {
    type: "hotel",
    name: "Lagos Continental Hotel",
    initials: "LC",
    phone: "+234 1 234 5678",
    email: "bookings@lagoscontinental.com",
    joinDate: "Oct 2024",
    status: "active",
    hotelTier: "premium",
    guestBookings: 342,
    monthlyVolume: "₦4,210,000",
    contactPerson: "Folake Adeyemi",
    integrationStatus: "live",
  },
  "Eko Hotels": {
    type: "hotel",
    name: "Eko Hotels & Suites",
    initials: "EH",
    phone: "+234 1 271 6000",
    email: "transport@ekohotels.com",
    joinDate: "Sep 2024",
    status: "active",
    hotelTier: "enterprise",
    guestBookings: 891,
    monthlyVolume: "₦12,500,000",
    contactPerson: "Bode Akinwale",
    integrationStatus: "live",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// PROFILE DRAWER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface ProfileDrawerProps {
  open: boolean;
  onClose: () => void;
  profile: ProfileData | null;
}

export function ProfileDrawer({ open, onClose, profile }: ProfileDrawerProps) {
  const { theme, t } = useAdminTheme();
  const isDark = theme === "dark";

  if (!profile) return null;

  const typeLabel = profile.type === "rider" ? "Rider" : profile.type === "driver" ? "Driver" : "Hotel Partner";
  const typeColor = profile.type === "rider" ? STATUS.info : profile.type === "driver" ? BRAND.green : STATUS.warning;
  const TypeIcon = profile.type === "rider" ? Navigation : profile.type === "driver" ? Car : Building2;

  const statusColor = profile.status === "active" ? BRAND.green : profile.status === "suspended" ? STATUS.error : STATUS.warning;
  const statusLabel = profile.status ? profile.status.charAt(0).toUpperCase() + profile.status.slice(1) : "Unknown";

  return (
    <AdminDrawer
      open={open}
      onClose={onClose}
      title={typeLabel + " Profile"}
      subtitle={`Quick view — full profile in ${profile.type === "hotel" ? "Hotels" : profile.type === "rider" ? "Riders" : "Drivers"}`}
      width={380}
      side="right"
    >
      <div className="p-5">
        {/* Identity card */}
        <div
          className="rounded-xl p-4 mb-4"
          style={{
            background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.015)",
            border: `1px solid ${isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"}`,
          }}
        >
          <div className="flex items-start gap-3.5">
            {/* Avatar */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: `${typeColor}12`,
                border: `1px solid ${typeColor}20`,
              }}
            >
              <span
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "12px",
                  color: typeColor,
                }}
              >
                {profile.initials}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <span
                className="block"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  lineHeight: "1.3",
                  letterSpacing: "-0.02em",
                  color: t.text,
                }}
              >
                {profile.name}
              </span>

              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 500,
                    fontSize: "9px",
                    color: typeColor,
                    background: `${typeColor}10`,
                  }}
                >
                  <TypeIcon size={8} />
                  {typeLabel}
                </span>

                {profile.isEV && (
                  <span
                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded"
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 500,
                      fontSize: "9px",
                      color: BRAND.green,
                      background: `${BRAND.green}10`,
                    }}
                  >
                    <Zap size={7} />
                    EV
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status + rating row */}
          <div className="flex items-center gap-3 mt-3.5 pt-3" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
              <span
                style={{
                  fontFamily: "'Manrope', sans-serif",
                  fontWeight: 500,
                  fontSize: "11px",
                  letterSpacing: "-0.02em",
                  color: statusColor,
                }}
              >
                {statusLabel}
              </span>
            </div>

            {profile.rating && (
              <div className="flex items-center gap-1">
                <Star size={10} style={{ color: STATUS.warning, fill: STATUS.warning }} />
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 500,
                    fontSize: "11px",
                    letterSpacing: "-0.02em",
                    color: t.text,
                  }}
                >
                  {profile.rating}
                </span>
              </div>
            )}

            {profile.joinDate && (
              <div className="flex items-center gap-1 ml-auto">
                <Calendar size={9} style={{ color: t.textFaint }} />
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 400,
                    fontSize: "10px",
                    color: t.textFaint,
                  }}
                >
                  Since {profile.joinDate}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Contact */}
        <SectionTitle>Contact</SectionTitle>
        <div className="space-y-1 mb-4">
          {profile.phone && <InfoRow icon={Phone} label={profile.phone} />}
          {profile.email && <InfoRow icon={Mail} label={profile.email} />}
        </div>

        {/* Stats — type-specific */}
        {profile.type === "rider" && (
          <>
            <SectionTitle>Activity</SectionTitle>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <StatCell label="Total trips" value={String(profile.totalTrips || 0)} />
              <StatCell label="Total spend" value={profile.totalSpend || "₦0"} />
              <StatCell label="Last active" value={profile.lastActive || "—"} />
              <StatCell label="Payment methods" value={String(profile.paymentMethods || 0)} />
            </div>
          </>
        )}

        {profile.type === "driver" && (
          <>
            <SectionTitle>Vehicle</SectionTitle>
            <div
              className="rounded-lg p-3 mb-4 flex items-center gap-3"
              style={{
                background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                border: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}`,
              }}
            >
              <Car size={14} style={{ color: t.textMuted }} />
              <div>
                <span
                  className="block"
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 500,
                    fontSize: "12px",
                    letterSpacing: "-0.02em",
                    color: t.text,
                  }}
                >
                  {profile.vehicleType}
                </span>
                <span
                  style={{
                    fontFamily: "'Manrope', sans-serif",
                    fontWeight: 400,
                    fontSize: "10px",
                    color: t.textFaint,
                  }}
                >
                  {profile.vehiclePlate}
                  {profile.fleet && ` · ${profile.fleet}`}
                </span>
              </div>
            </div>

            <SectionTitle>Performance</SectionTitle>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <StatCell label="Total trips" value={String(profile.totalTrips || 0)} />
              <StatCell label="Earnings" value={profile.totalEarnings || "₦0"} />
              <StatCell label="Completion" value={profile.completionRate || "—"} />
              <StatCell label="Acceptance" value={profile.acceptanceRate || "—"} />
            </div>

            {profile.verificationStatus && (
              <>
                <SectionTitle>Verification</SectionTitle>
                <div className="flex items-center gap-2 mb-4">
                  {profile.verificationStatus === "verified" ? (
                    <CheckCircle2 size={12} style={{ color: BRAND.green }} />
                  ) : (
                    <AlertTriangle size={12} style={{ color: STATUS.warning }} />
                  )}
                  <span
                    style={{
                      fontFamily: "'Manrope', sans-serif",
                      fontWeight: 500,
                      fontSize: "11px",
                      letterSpacing: "-0.02em",
                      color: profile.verificationStatus === "verified" ? BRAND.green : STATUS.warning,
                    }}
                  >
                    {profile.verificationStatus.charAt(0).toUpperCase() + profile.verificationStatus.slice(1)}
                  </span>
                </div>
              </>
            )}
          </>
        )}

        {profile.type === "hotel" && (
          <>
            <SectionTitle>Partnership</SectionTitle>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <StatCell label="Guest bookings" value={String(profile.guestBookings || 0)} />
              <StatCell label="Monthly volume" value={profile.monthlyVolume || "₦0"} />
              <StatCell
                label="Tier"
                value={profile.hotelTier ? profile.hotelTier.charAt(0).toUpperCase() + profile.hotelTier.slice(1) : "—"}
              />
              <StatCell
                label="Integration"
                value={profile.integrationStatus ? profile.integrationStatus.charAt(0).toUpperCase() + profile.integrationStatus.slice(1) : "—"}
              />
            </div>
            {profile.contactPerson && (
              <InfoRow icon={Users} label={`Contact: ${profile.contactPerson}`} />
            )}
          </>
        )}

        {/* Full profile link */}
        <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}` }}>
          <button
            className="w-full h-10 rounded-xl flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
            style={{
              background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
              minHeight: 44,
            }}
          >
            <ExternalLink size={12} style={{ color: t.textMuted }} />
            <span
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 500,
                fontSize: "11px",
                letterSpacing: "-0.02em",
                color: t.textMuted,
              }}
            >
              View full profile in {profile.type === "hotel" ? "Hotels" : profile.type === "rider" ? "Riders" : "Drivers"}
            </span>
          </button>
        </div>
      </div>
    </AdminDrawer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

function SectionTitle({ children }: { children: string }) {
  const { t } = useAdminTheme();
  return (
    <span
      className="block mb-2"
      style={{
        fontFamily: "'Manrope', sans-serif",
        fontWeight: 600,
        fontSize: "9px",
        letterSpacing: "0.05em",
        textTransform: "uppercase" as const,
        color: t.textFaint,
      }}
    >
      {children}
    </span>
  );
}

function InfoRow({ icon: Icon, label }: { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; label: string }) {
  const { t } = useAdminTheme();
  return (
    <div
      className="flex items-center gap-2.5 px-3 rounded-lg"
      style={{ height: 36 }}
    >
      <Icon size={12} style={{ color: t.textFaint }} />
      <span
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 400,
          fontSize: "12px",
          letterSpacing: "-0.02em",
          color: t.textSecondary,
        }}
      >
        {label}
      </span>
    </div>
  );
}

function StatCell({ label, value }: { label: string; value: string }) {
  const { theme, t } = useAdminTheme();
  return (
    <div
      className="rounded-lg p-3"
      style={{
        background: theme === "dark" ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)",
        border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"}`,
      }}
    >
      <span
        className="block"
        style={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 600,
          fontSize: "14px",
          letterSpacing: "-0.02em",
          color: t.text,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "'Manrope', sans-serif",
          fontWeight: 400,
          fontSize: "10px",
          color: t.textFaint,
        }}
      >
        {label}
      </span>
    </div>
  );
}