 /**
 * Booking Flow — Bottom Sheet Overlays
 *
 * Reusable sheet components for affordances within the booking flow:
 * - RouteEditSheet: Edit pickup/destination inline (Uber-inspired)
 * - PaymentSheet: Switch payment method
 * - SafetySheet: Emergency contacts, trip sharing, SOS
 *
 * All sheets use GlassPanel as the surface material (spine-compliant),
 * slide up from bottom with spring physics, backdrop scrim for context.
 *
 * REFERENCE INSPIRATION:
 * - Apple Maps: bottom sheet with grab handle, blurred backdrop
 * - Uber: inline location editing with swap gesture
 * - Linear: keyboard-first search within sheets
 * - Airbnb: progressive disclosure — show essentials, expand for more
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  MapPin,
  CircleDot,
  ArrowUpDown,
  Home,
  Briefcase,
  Clock,
  Star,
  Plane,
  CreditCard,
  Wallet,
  Banknote,
  Check,
  Shield,
  Phone,
  Share2,
  AlertTriangle,
  Users,
  ChevronRight,
  Send,
} from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { RIDER_TYPE as RT } from "../../config/rider-type";
import { GlassPanel } from "./glass-panel";
import {
  savedPlaces,
  recentSearches,
  type Place,
} from "./destination-search-data";

/* ── Springs ── */
const SPRING_SHEET = {
  type: "spring" as const,
  stiffness: 350,
  damping: 30,
  mass: 0.8,
};
const SPRING_SNAPPY = {
  type: "spring" as const,
  stiffness: 500,
  damping: 32,
  mass: 0.8,
};

/* ── Place icon map ── */
const placeIconMap = {
  home: Home,
  work: Briefcase,
  clock: Clock,
  star: Star,
  pin: MapPin,
  plane: Plane,
};

/* ═══════════════════════════════════════════════════════════════════════════
   Shared Sheet Wrapper — backdrop + slide-up container
   ═══════════════════════════════════════════════════════════════════════════ */
interface SheetWrapperProps {
  open: boolean;
  onClose: () => void;
  colorMode: GlassColorMode;
  children: React.ReactNode;
  /** Max height as CSS value, default "85vh" */
  maxHeight?: string;
}

function SheetWrapper({
  open,
  onClose,
  colorMode,
  children,
  maxHeight = "85vh",
}: SheetWrapperProps) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          {/* Scrim */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: d
                ? "rgba(0,0,0,0.6)"
                : "rgba(0,0,0,0.25)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="relative z-10 overflow-hidden"
            style={{
              maxHeight,
              background: d ? "#111113" : "#FFFFFF",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              boxShadow: d
                ? "0 -8px 40px rgba(0,0,0,0.5)"
                : "0 -8px 40px rgba(0,0,0,0.08)",
            }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={SPRING_SHEET}
          >
            {/* Grab handle */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div
                className="w-9 h-1 rounded-full"
                style={{
                  background: d
                    ? "rgba(255,255,255,0.2)"
                    : "rgba(0,0,0,0.15)",
                }}
              />
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Route Edit Sheet
   ═══════════════════════════════════════════════════════════════════════════ */
interface RouteEditSheetProps {
  open: boolean;
  onClose: () => void;
  colorMode: GlassColorMode;
  pickup: { name: string; address: string };
  dropoff: { name: string; address: string };
  onUpdatePickup: (place: { name: string; address: string }) => void;
  onUpdateDropoff: (place: { name: string; address: string }) => void;
}

export function RouteEditSheet({
  open,
  onClose,
  colorMode,
  pickup,
  dropoff,
  onUpdatePickup,
  onUpdateDropoff,
}: RouteEditSheetProps) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [activeField, setActiveField] = useState<"pickup" | "dropoff" | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      setActiveField(null);
      setSearchQuery("");
    }
  }, [open]);

  // Focus input when field selected
  useEffect(() => {
    if (activeField && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeField]);

  const allPlaces = [...savedPlaces, ...recentSearches];
  const filteredPlaces = searchQuery
    ? allPlaces.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allPlaces;

  const handleSelectPlace = (place: Place) => {
    const loc = { name: place.name, address: place.address };
    if (activeField === "pickup") {
      onUpdatePickup(loc);
    } else {
      onUpdateDropoff(loc);
    }
    setActiveField(null);
    setSearchQuery("");
  };

  const handleSwapLocations = () => {
    const tempPickup = { ...pickup };
    onUpdatePickup({ ...dropoff });
    onUpdateDropoff(tempPickup);
  };

  return (
    <SheetWrapper open={open} onClose={onClose} colorMode={colorMode}>
      <div className="px-5 pb-2">
        {/* Header */}
        <div className="flex items-center justify-between py-3">
          <span
            style={{
              ...GLASS_TYPE.body,
              color: c.text.primary,
            }}
          >
            Edit route
          </span>
          <motion.button
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: c.surface.subtle }}
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
          </motion.button>
        </div>

        {/* Location fields */}
        <div className="flex gap-3 mb-4">
          {/* Route line indicator */}
          <div className="flex flex-col items-center py-3.5 shrink-0">
            <CircleDot
              className="w-4 h-4"
              style={{ color: BRAND_COLORS.green }}
            />
            <div
              className="w-px flex-1 my-1.5"
              style={{
                background: d
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,0,0,0.1)",
              }}
            />
            <MapPin className="w-4 h-4" style={{ color: c.text.tertiary }} />
          </div>

          {/* Fields */}
          <div className="flex-1 space-y-2">
            {/* Pickup */}
            <motion.button
              className="w-full text-left px-3.5 py-3 rounded-xl"
              style={{
                background:
                  activeField === "pickup"
                    ? d
                      ? "rgba(29,185,84,0.08)"
                      : "rgba(29,185,84,0.04)"
                    : c.surface.subtle,
                border:
                  activeField === "pickup"
                    ? `1.5px solid ${BRAND_COLORS.green}30`
                    : `1.5px solid transparent`,
              }}
              onClick={() => {
                setActiveField("pickup");
                setSearchQuery("");
              }}
              whileTap={{ scale: 0.98 }}
            >
              {activeField === "pickup" ? (
                <input
                  ref={activeField === "pickup" ? inputRef : undefined}
                  type="text"
                  className="w-full bg-transparent outline-none"
                  style={{
                    ...GLASS_TYPE.bodySmall,
                    color: c.text.primary,
                  }}
                  placeholder="Search pickup location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <span
                    style={{
                      ...GLASS_TYPE.caption,
                      color: BRAND_COLORS.green,
                    }}
                  >
                    Pickup
                  </span>
                  <div
                    className="mt-0.5"
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      color: c.text.primary,
                    }}
                  >
                    {pickup.name}
                  </div>
                </>
              )}
            </motion.button>

            {/* Dropoff */}
            <motion.button
              className="w-full text-left px-3.5 py-3 rounded-xl"
              style={{
                background:
                  activeField === "dropoff"
                    ? d
                      ? "rgba(29,185,84,0.08)"
                      : "rgba(29,185,84,0.04)"
                    : c.surface.subtle,
                border:
                  activeField === "dropoff"
                    ? `1.5px solid ${BRAND_COLORS.green}30`
                    : `1.5px solid transparent`,
              }}
              onClick={() => {
                setActiveField("dropoff");
                setSearchQuery("");
              }}
              whileTap={{ scale: 0.98 }}
            >
              {activeField === "dropoff" ? (
                <input
                  ref={activeField === "dropoff" ? inputRef : undefined}
                  type="text"
                  className="w-full bg-transparent outline-none"
                  style={{
                    ...GLASS_TYPE.bodySmall,
                    color: c.text.primary,
                  }}
                  placeholder="Search destination..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <>
                  <span
                    style={{
                      ...GLASS_TYPE.caption,
                      color: c.text.muted,
                    }}
                  >
                    Destination
                  </span>
                  <div
                    className="mt-0.5"
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      color: c.text.primary,
                    }}
                  >
                    {dropoff.name}
                  </div>
                </>
              )}
            </motion.button>
          </div>

          {/* Swap button */}
          <div className="flex items-center shrink-0">
            <motion.button
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: c.surface.subtle,
                border: `1px solid ${c.surface.hover}`,
              }}
              onClick={handleSwapLocations}
              whileTap={{ scale: 0.9 }}
            >
              <ArrowUpDown
                className="w-4 h-4"
                style={{ color: c.icon.secondary }}
              />
            </motion.button>
          </div>
        </div>

        {/* Place suggestions (shown when a field is active) */}
        {activeField && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_SNAPPY}
          >
            <div
              className="mb-2"
              style={{ ...GLASS_TYPE.caption, color: c.text.muted }}
            >
              {searchQuery ? "Results" : "Saved & recent"}
            </div>
            <div
              className="space-y-0.5 overflow-y-auto"
              style={{ maxHeight: "40vh" }}
            >
              {filteredPlaces.map((place, i) => {
                const PlaceIcon = placeIconMap[place.icon];
                return (
                  <motion.button
                    key={place.id}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left"
                    style={{ background: "transparent" }}
                    onClick={() => handleSelectPlace(place)}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...SPRING_SNAPPY, delay: i * 0.04 }}
                  >
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: c.surface.subtle }}
                    >
                      <PlaceIcon
                        className="w-4 h-4"
                        style={{ color: c.icon.secondary }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        style={{
                          ...GLASS_TYPE.bodySmall,
                          color: c.text.primary,
                        }}
                      >
                        {place.name}
                      </div>
                      <div
                        className="truncate mt-0.5"
                        style={{
                          ...GLASS_TYPE.caption,
                          color: c.text.muted,
                        }}
                      >
                        {place.address}
                      </div>
                    </div>
                    {place.eta && (
                      <span
                        style={{
                          ...GLASS_TYPE.caption,
                          color: c.text.muted,
                        }}
                      >
                        {place.eta}
                      </span>
                    )}
                  </motion.button>
                );
              })}

              {filteredPlaces.length === 0 && (
                <div
                  className="py-8 text-center"
                  style={{
                    ...GLASS_TYPE.bodySmallRegular,
                    color: c.text.muted,
                  }}
                >
                  No places found
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Done / Confirm button when not searching */}
        {!activeField && (
          <motion.button
            className="w-full py-3.5 rounded-2xl flex items-center justify-center mb-2"
            style={{ background: BRAND_COLORS.green }}
            onClick={onClose}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_SNAPPY, delay: 0.1 }}
          >
            <span style={{ ...GLASS_TYPE.body, color: "#FFFFFF" }}>
              Confirm route
            </span>
          </motion.button>
        )}
      </div>
    </SheetWrapper>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Payment Method Sheet
   ═══════════════════════════════════════════════════════════════════════════ */
interface PaymentMethod {
  id: string;
  label: string;
  detail: string;
  icon: typeof CreditCard;
  isDefault: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "visa",
    label: "Visa",
    detail: "•••• 4821",
    icon: CreditCard,
    isDefault: true,
  },
  {
    id: "mastercard",
    label: "Mastercard",
    detail: "•••• 7392",
    icon: CreditCard,
    isDefault: false,
  },
  {
    id: "wallet",
    label: "JET Wallet",
    detail: "₦14,500 balance",
    icon: Wallet,
    isDefault: false,
  },
  {
    id: "cash",
    label: "Cash",
    detail: "Pay driver directly",
    icon: Banknote,
    isDefault: false,
  },
];

interface PaymentSheetProps {
  open: boolean;
  onClose: () => void;
  colorMode: GlassColorMode;
  selectedId: string;
  onSelect: (id: string, label: string, detail: string) => void;
}

export function PaymentSheet({
  open,
  onClose,
  colorMode,
  selectedId,
  onSelect,
}: PaymentSheetProps) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  return (
    <SheetWrapper
      open={open}
      onClose={onClose}
      colorMode={colorMode}
      maxHeight="55vh"
    >
      <div className="px-5 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between py-3 mb-2">
          <span style={{ ...GLASS_TYPE.body, color: c.text.primary }}>
            Payment method
          </span>
          <motion.button
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: c.surface.subtle }}
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
          </motion.button>
        </div>

        {/* Methods */}
        <div className="space-y-1">
          {paymentMethods.map((method, i) => {
            const MethodIcon = method.icon;
            const isSelected = selectedId === method.id;

            return (
              <motion.button
                key={method.id}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left"
                style={{
                  background: isSelected
                    ? d
                      ? "rgba(29,185,84,0.08)"
                      : "rgba(29,185,84,0.04)"
                    : "transparent",
                  border: isSelected
                    ? `1.5px solid ${BRAND_COLORS.green}30`
                    : "1.5px solid transparent",
                }}
                onClick={() => {
                  onSelect(method.id, method.label, method.detail);
                  onClose();
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SNAPPY, delay: i * 0.05 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: c.surface.subtle }}
                >
                  <MethodIcon
                    className="w-[18px] h-[18px]"
                    style={{
                      color: isSelected
                        ? BRAND_COLORS.green
                        : c.icon.secondary,
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="flex items-center gap-2"
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      color: c.text.primary,
                    }}
                  >
                    {method.label}
                    {method.isDefault && (
                      <span
                        className="px-1.5 py-0.5 rounded"
                        style={{
                          ...GLASS_TYPE.caption,
                          fontSize: "10px",
                          background: c.surface.subtle,
                          color: c.text.muted,
                        }}
                      >
                        Default
                      </span>
                    )}
                  </div>
                  <div
                    className="mt-0.5"
                    style={{
                      ...GLASS_TYPE.caption,
                      color: c.text.muted,
                    }}
                  >
                    {method.detail}
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={SPRING_SNAPPY}
                  >
                    <Check
                      className="w-5 h-5"
                      style={{ color: BRAND_COLORS.green }}
                    />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </SheetWrapper>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Safety Tools Sheet
   ═══════════════════════════════════════════════════════════════════════════ */
interface SafetyAction {
  id: string;
  icon: typeof Shield;
  label: string;
  description: string;
  isEmergency?: boolean;
}

const safetyActions: SafetyAction[] = [
  {
    id: "share",
    icon: Share2,
    label: "Share trip status",
    description: "Send real-time location to contacts",
  },
  {
    id: "contacts",
    icon: Users,
    label: "Trusted contacts",
    description: "Auto-notify when trip starts/ends",
  },
  {
    id: "call",
    icon: Phone,
    label: "Call emergency line",
    description: "Reach JET safety team instantly",
  },
  {
    id: "sos",
    icon: AlertTriangle,
    label: "Emergency SOS",
    description: "Alert emergency services & JET",
    isEmergency: true,
  },
];

interface SafetySheetProps {
  open: boolean;
  onClose: () => void;
  colorMode: GlassColorMode;
}

export function SafetySheet({ open, onClose, colorMode }: SafetySheetProps) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";

  return (
    <SheetWrapper
      open={open}
      onClose={onClose}
      colorMode={colorMode}
      maxHeight="60vh"
    >
      <div className="px-5 pb-4">
        {/* Header */}
        <div className="flex items-center justify-between py-3 mb-1">
          <div className="flex items-center gap-2">
            <Shield
              className="w-4.5 h-4.5"
              style={{ color: BRAND_COLORS.green }}
            />
            <span style={{ ...GLASS_TYPE.body, color: c.text.primary }}>
              Safety tools
            </span>
          </div>
          <motion.button
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: c.surface.subtle }}
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
          </motion.button>
        </div>

        <div
          className="mb-4"
          style={{
            ...GLASS_TYPE.caption,
            color: c.text.muted,
          }}
        >
          Your safety is our priority. These tools are always available during
          your trip.
        </div>

        {/* Actions */}
        <div className="space-y-1.5">
          {safetyActions.map((action, i) => {
            const ActionIcon = action.icon;
            return (
              <motion.button
                key={action.id}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left"
                style={{
                  background: action.isEmergency
                    ? d
                      ? "rgba(212,24,61,0.08)"
                      : "rgba(212,24,61,0.04)"
                    : c.surface.subtle,
                  border: action.isEmergency
                    ? `1.5px solid rgba(212,24,61,0.2)`
                    : "1.5px solid transparent",
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...SPRING_SNAPPY, delay: i * 0.05 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: action.isEmergency
                      ? d
                        ? "rgba(212,24,61,0.12)"
                        : "rgba(212,24,61,0.06)"
                      : d
                        ? "rgba(255,255,255,0.06)"
                        : "rgba(0,0,0,0.04)",
                  }}
                >
                  <ActionIcon
                    className="w-[18px] h-[18px]"
                    style={{
                      color: action.isEmergency
                        ? BRAND_COLORS.error
                        : c.icon.secondary,
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      color: action.isEmergency
                        ? BRAND_COLORS.error
                        : c.text.primary,
                    }}
                  >
                    {action.label}
                  </div>
                  <div
                    className="mt-0.5"
                    style={{
                      ...GLASS_TYPE.caption,
                      color: c.text.muted,
                    }}
                  >
                    {action.description}
                  </div>
                </div>
                <ChevronRight
                  className="w-4 h-4 shrink-0"
                  style={{ color: c.icon.muted }}
                />
              </motion.button>
            );
          })}
        </div>
      </div>
    </SheetWrapper>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Chat Sheet — rider ↔ driver messaging
   ═══════════════════════════════════════════════════════════════════════════ */

interface ChatMessage {
  id: string;
  from: "rider" | "driver";
  text: string;
  time: string;
}

const quickReplies = [
  "I'm here",
  "On my way",
  "5 minutes away",
  "Please wait",
  "Wrong location?",
];

interface ChatSheetProps {
  open: boolean;
  onClose: () => void;
  colorMode: GlassColorMode;
  driverName: string;
}

export function ChatSheet({
  open,
  onClose,
  colorMode,
  driverName,
}: ChatSheetProps) {
  const c = GLASS_COLORS[colorMode];
  const d = colorMode === "dark";
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      from: "driver",
      text: "Hello! I'm on my way to pick you up.",
      time: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const msg: ChatMessage = {
      id: Date.now().toString(),
      from: "rider",
      text: text.trim(),
      time: "Now",
    };
    setMessages((prev) => [...prev, msg]);
    setInput("");

    // Simulate driver reply
    setTimeout(() => {
      const replies = [
        "Got it, thanks!",
        "No problem",
        "Okay, see you soon",
        "Alright!",
      ];
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          from: "driver",
          text: replies[Math.floor(Math.random() * replies.length)],
          time: "Now",
        },
      ]);
    }, 1200);
  };

  return (
    <SheetWrapper
      open={open}
      onClose={onClose}
      colorMode={colorMode}
      maxHeight="70vh"
    >
      <div className="flex flex-col" style={{ height: "65vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3">
          <span style={{ ...GLASS_TYPE.body, color: c.text.primary }}>
            {driverName}
          </span>
          <motion.button
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: c.surface.subtle }}
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
          >
            <X className="w-4 h-4" style={{ color: c.icon.secondary }} />
          </motion.button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-5 space-y-2"
        >
          {messages.map((msg) => {
            const isRider = msg.from === "rider";
            return (
              <motion.div
                key={msg.id}
                className={`flex ${isRider ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={SPRING_SNAPPY}
              >
                <div
                  className="max-w-[75%] px-3.5 py-2.5 rounded-2xl"
                  style={{
                    background: isRider
                      ? BRAND_COLORS.green
                      : c.surface.subtle,
                    borderBottomRightRadius: isRider ? 6 : 16,
                    borderBottomLeftRadius: isRider ? 16 : 6,
                  }}
                >
                  <div
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      color: isRider ? "#FFFFFF" : c.text.primary,
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    className="mt-0.5"
                    style={{
                      ...GLASS_TYPE.caption,
                      fontSize: "10px",
                      color: isRider
                        ? "rgba(255,255,255,0.6)"
                        : c.text.muted,
                    }}
                  >
                    {msg.time}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick replies */}
        <div className="px-5 pt-2 pb-1">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickReplies.map((reply) => (
              <motion.button
                key={reply}
                className="shrink-0 px-3 py-1.5 rounded-full"
                style={{
                  background: c.surface.subtle,
                  border: `1px solid ${c.surface.hover}`,
                }}
                onClick={() => sendMessage(reply)}
                whileTap={{ scale: 0.95 }}
              >
                <span
                  style={{
                    ...GLASS_TYPE.caption,
                    color: c.text.secondary,
                    whiteSpace: "nowrap",
                  }}
                >
                  {reply}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Input bar */}
        <div
          className="px-5 pb-2 pt-2"
          style={{
            paddingBottom: "max(env(safe-area-inset-bottom, 12px), 12px)",
          }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl"
            style={{
              background: c.surface.subtle,
              border: `1px solid ${c.surface.hover}`,
            }}
          >
            <input
              type="text"
              className="flex-1 bg-transparent outline-none"
              style={{
                ...GLASS_TYPE.bodySmall,
                color: c.text.primary,
              }}
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage(input);
              }}
            />
            <motion.button
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: input.trim()
                  ? BRAND_COLORS.green
                  : "transparent",
              }}
              onClick={() => sendMessage(input)}
              whileTap={{ scale: 0.9 }}
            >
              <Send
                className="w-4 h-4"
                style={{
                  color: input.trim() ? "#FFFFFF" : c.icon.muted,
                }}
              />
            </motion.button>
          </div>
        </div>
      </div>
    </SheetWrapper>
  );
}