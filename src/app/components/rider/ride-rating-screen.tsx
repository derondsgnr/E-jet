 /**
 * RideRatingScreen — Star rating + quick feedback tags + optional comment.
 *
 * NORTHSTAR: Uber rating + Airbnb review — quick primary action, optional depth.
 * - Large tappable stars (the hero)
 * - Contextual feedback tags based on rating (positive for 4-5, constructive for 1-3)
 * - Optional text comment (progressive disclosure — appears after stars)
 * - Submit → done
 *
 * SPINE: GlassPanel, MapCanvas, green-as-scalpel, motion stagger
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Star,
  ThumbsUp,
  Route,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  Music,
  Clock,
  Ban,
  AlertCircle,
  Car,
  Leaf,
} from "lucide-react";
import {
  GLASS_COLORS,
  GLASS_TYPE,
  MOTION,
  type GlassColorMode,
} from "../../config/project";
import { BRAND_COLORS } from "../../config/brand";
import { GlassPanel } from "./glass-panel";
import { MapCanvas } from "./map-canvas";
import { mockDriver, mockCompletedTrip } from "./booking-data";

const SPRING = { type: "spring" as const, stiffness: 500, damping: 32, mass: 0.8 };
const SPRING_BOUNCY = { type: "spring" as const, stiffness: 400, damping: 22, mass: 0.6 };

/* ── Feedback tags by sentiment ── */
const POSITIVE_TAGS = [
  { id: "smooth", label: "Smooth ride", icon: Route },
  { id: "friendly", label: "Friendly", icon: ThumbsUp },
  { id: "safe", label: "Safe driving", icon: ShieldCheck },
  { id: "clean", label: "Clean car", icon: Sparkles },
  { id: "music", label: "Great music", icon: Music },
  { id: "conversation", label: "Good chat", icon: MessageCircle },
];

const CONSTRUCTIVE_TAGS = [
  { id: "late", label: "Late pickup", icon: Clock },
  { id: "route", label: "Wrong route", icon: Route },
  { id: "driving", label: "Rough driving", icon: AlertCircle },
  { id: "car", label: "Car condition", icon: Car },
  { id: "rude", label: "Unfriendly", icon: Ban },
];

const RATING_LABELS = ["", "Poor", "Below average", "Okay", "Great", "Excellent"];

interface RideRatingScreenProps {
  colorMode: GlassColorMode;
  onSubmit: (data: {
    rating: number;
    tags: string[];
    comment: string;
  }) => void;
  onSkip: () => void;
}

export function RideRatingScreen({
  colorMode,
  onSubmit,
  onSkip,
}: RideRatingScreenProps) {
  const d = colorMode === "dark";
  const c = GLASS_COLORS[colorMode];

  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const tags = rating >= 4 ? POSITIVE_TAGS : rating > 0 ? CONSTRUCTIVE_TAGS : [];

  const toggleTag = (id: string) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      onSubmit({ rating, tags: selectedTags, comment });
    }, 1200);
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden flex flex-col"
      style={{ background: c.bg }}
    >
      {/* ── Atmospheric background ── */}
      <div className="absolute inset-0">
        <MapCanvas variant="muted" colorMode={colorMode} />
        {d ? (
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0D]/85 via-[#0B0B0D]/70 to-[#0B0B0D]/90 z-[1]" />
        ) : (
          <div
            className="absolute inset-0 z-[1]"
            style={{
              background:
                "linear-gradient(to bottom, rgba(250,250,250,0.9) 0%, rgba(250,250,250,0.75) 50%, rgba(250,250,250,0.92) 100%)",
            }}
          />
        )}
      </div>

      {/* ── Success state ── */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            className="absolute inset-0 z-50 flex flex-col items-center justify-center"
            style={{
              background: d ? "rgba(11,11,13,0.95)" : "rgba(250,250,250,0.95)",
              backdropFilter: "blur(20px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={MOTION.standard}
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{
                background: d ? "rgba(29,185,84,0.12)" : "rgba(29,185,84,0.08)",
                border: `2px solid ${BRAND_COLORS.green}30`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={SPRING_BOUNCY}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...SPRING_BOUNCY, delay: 0.15 }}
              >
                <ThumbsUp
                  className="w-7 h-7"
                  style={{ color: BRAND_COLORS.green }}
                />
              </motion.div>
            </motion.div>
            <motion.span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "20px",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: "1.2",
                color: c.text.display,
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...MOTION.standard, delay: 0.25 }}
            >
              Thanks for your feedback!
            </motion.span>
            <motion.span
              className="mt-1"
              style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ ...MOTION.standard, delay: 0.35 }}
            >
              Your rating helps improve JET
            </motion.span>

            {/* Carbon saved note in success */}
            {mockCompletedTrip.isEV && mockCompletedTrip.carbonSavedKg && (
              <motion.div
                className="flex items-center gap-1.5 mt-4 px-3.5 py-2 rounded-full"
                style={{
                  background: d ? "rgba(29,185,84,0.08)" : "rgba(29,185,84,0.05)",
                  border: `1px solid rgba(29,185,84,${d ? "0.15" : "0.1"})`,
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...MOTION.standard, delay: 0.5 }}
              >
                <Leaf className="w-3.5 h-3.5" style={{ color: BRAND_COLORS.green }} />
                <span style={{ ...GLASS_TYPE.caption, color: BRAND_COLORS.green }}>
                  {mockCompletedTrip.carbonSavedKg} kg CO₂ saved this trip
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content ── */}
      <div
        className="relative z-10 flex-1 overflow-y-auto scrollbar-hide"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 12px) + 24px)" }}
      >
        <div className="px-5 pb-4">
          {/* Driver avatar + question */}
          <motion.div
            className="flex flex-col items-center mb-8"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.1 }}
          >
            <motion.div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ background: c.green.tint }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={SPRING_BOUNCY}
            >
              <span
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "20px",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: "1.2",
                  color: BRAND_COLORS.green,
                }}
              >
                {mockDriver.avatarInitials}
              </span>
            </motion.div>

            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "22px",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: "1.2",
                color: c.text.display,
              }}
            >
              How was your ride?
            </span>
            <span
              className="mt-1"
              style={{ ...GLASS_TYPE.bodySmall, color: c.text.muted }}
            >
              with {mockDriver.name}
            </span>
          </motion.div>

          {/* ── Star rating ── */}
          <motion.div
            className="flex items-center justify-center gap-3 mb-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING, delay: 0.2 }}
          >
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = star <= rating;
              return (
                <motion.button
                  key={star}
                  className="p-1"
                  onClick={() => {
                    setRating(star);
                    setSelectedTags([]); // reset tags on rating change
                  }}
                  whileTap={{ scale: 0.85 }}
                  animate={filled ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Star
                    className="w-10 h-10"
                    style={{
                      color: filled ? BRAND_COLORS.green : c.text.ghost,
                      fill: filled ? BRAND_COLORS.green : "transparent",
                      transition: "color 0.15s, fill 0.15s",
                    }}
                    strokeWidth={1.5}
                  />
                </motion.button>
              );
            })}
          </motion.div>

          {/* Rating label */}
          <AnimatePresence mode="wait">
            {rating > 0 && (
              <motion.div
                key={rating}
                className="text-center mb-6"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={MOTION.micro}
              >
                <span
                  style={{
                    ...GLASS_TYPE.bodySmall,
                    fontWeight: 600,
                    color: rating >= 4 ? BRAND_COLORS.green : c.text.secondary,
                  }}
                >
                  {RATING_LABELS[rating]}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Feedback tags ── */}
          <AnimatePresence>
            {rating > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={MOTION.standard}
              >
                <GlassPanel
                  variant={d ? "dark" : "light"}
                  blur={20}
                  className="rounded-2xl px-5 py-5 mb-4"
                >
                  <span
                    style={{
                      ...GLASS_TYPE.label,
                      color: c.text.faint,
                      display: "block",
                      marginBottom: "12px",
                    }}
                  >
                    {rating >= 4 ? "What went well?" : "What could improve?"}
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {tags.map(({ id, label, icon: Icon }, i) => {
                      const isSelected = selectedTags.includes(id);
                      return (
                        <motion.button
                          key={id}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors"
                          style={{
                            background: isSelected
                              ? d
                                ? "rgba(29,185,84,0.12)"
                                : "rgba(29,185,84,0.08)"
                              : c.surface.subtle,
                            border: isSelected
                              ? `1px solid rgba(29,185,84,${d ? "0.25" : "0.18"})`
                              : "1px solid transparent",
                          }}
                          onClick={() => toggleTag(id)}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            ...MOTION.micro,
                            delay: i * MOTION.stagger,
                          }}
                        >
                          <Icon
                            className="w-3.5 h-3.5"
                            style={{
                              color: isSelected
                                ? BRAND_COLORS.green
                                : c.icon.muted,
                            }}
                          />
                          <span
                            style={{
                              ...GLASS_TYPE.caption,
                              fontWeight: isSelected ? 600 : 500,
                              color: isSelected
                                ? BRAND_COLORS.green
                                : c.text.secondary,
                            }}
                          >
                            {label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </GlassPanel>

                {/* ── Comment (optional) ── */}
                <GlassPanel
                  variant={d ? "dark" : "light"}
                  blur={20}
                  className="rounded-2xl px-5 py-4 mb-4"
                >
                  <span
                    style={{
                      ...GLASS_TYPE.label,
                      color: c.text.faint,
                      display: "block",
                      marginBottom: "8px",
                    }}
                  >
                    Additional comments (optional)
                  </span>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us more..."
                    rows={3}
                    className="w-full bg-transparent outline-none resize-none"
                    style={{
                      ...GLASS_TYPE.bodySmall,
                      color: c.text.primary,
                      letterSpacing: "-0.02em",
                    }}
                  />
                </GlassPanel>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="relative z-10 shrink-0 px-5 pt-3"
        style={{
          paddingBottom: "max(env(safe-area-inset-bottom, 24px), 24px)",
          borderTop: `1px solid ${c.surface.hover}`,
          background: d ? "rgba(11,11,13,0.8)" : "rgba(250,250,250,0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="flex gap-3">
          {/* Skip */}
          <motion.button
            className="flex-[0.35] py-3.5 rounded-xl flex items-center justify-center"
            style={{ background: c.surface.subtle }}
            onClick={onSkip}
            whileTap={{ scale: 0.97 }}
          >
            <span style={{ ...GLASS_TYPE.small, color: c.text.muted }}>
              Skip
            </span>
          </motion.button>

          {/* Submit */}
          <motion.button
            className="flex-[0.65] py-3.5 rounded-xl flex items-center justify-center gap-2 relative overflow-hidden transition-opacity"
            style={{
              background: rating > 0 ? BRAND_COLORS.green : c.surface.subtle,
              opacity: rating > 0 ? 1 : 0.5,
            }}
            onClick={rating > 0 ? handleSubmit : undefined}
            whileTap={rating > 0 ? { scale: 0.98 } : undefined}
          >
            {rating > 0 && (
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.12) 50%, transparent 60%)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 4,
                  ease: "linear",
                }}
              />
            )}
            <span
              className="relative z-10"
              style={{
                ...GLASS_TYPE.small,
                fontWeight: 600,
                color: rating > 0 ? "#fff" : c.text.muted,
              }}
            >
              Submit rating
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}