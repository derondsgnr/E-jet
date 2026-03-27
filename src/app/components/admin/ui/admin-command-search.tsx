/**
 * JET ADMIN — COMMAND SEARCH (⌘K)
 *
 * Linear/Vercel-style command palette.
 * Search across pages, drivers, riders, actions.
 */

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search, Activity, MapPin, Scale, MessageSquare, Navigation,
  Users, Globe2, Car, Wallet, BarChart3, Megaphone, Settings,
  ArrowRight, Hash, Zap, FileText, Clock,
} from "lucide-react";
import { useAdminTheme, TY, BRAND, STATUS } from "../../../config/admin-theme";

interface SearchResult {
  id: string;
  label: string;
  section: string;
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  route?: string;
  meta?: string;
}

const SEARCH_INDEX: SearchResult[] = [
  // Pages
  { id: "p-cmd", label: "Command Center", section: "Pages", icon: Activity, route: "/admin" },
  { id: "p-rides", label: "Rides", section: "Pages", icon: MapPin, route: "/admin/rides" },
  { id: "p-disputes", label: "Disputes", section: "Pages", icon: Scale, route: "/admin/disputes" },
  { id: "p-support", label: "Support", section: "Pages", icon: MessageSquare, route: "/admin/support" },
  { id: "p-riders", label: "Riders", section: "Pages", icon: Navigation, route: "/admin/riders" },
  { id: "p-drivers", label: "Drivers", section: "Pages", icon: Users, route: "/admin/drivers" },
  { id: "p-hotels", label: "Hotels", section: "Pages", icon: Globe2, route: "/admin/hotels" },
  { id: "p-fleet", label: "Fleet", section: "Pages", icon: Car, route: "/admin/fleet" },
  { id: "p-finance", label: "Finance", section: "Pages", icon: Wallet, route: "/admin/finance" },
  { id: "p-analytics", label: "Analytics", section: "Pages", icon: BarChart3, route: "/admin/analytics" },
  { id: "p-comms", label: "Communications", section: "Pages", icon: Megaphone, route: "/admin/comms" },
  { id: "p-settings", label: "Settings", section: "Pages", icon: Settings, route: "/admin/settings" },
  // Actions
  { id: "a-payout", label: "Approve payout batch", section: "Actions", icon: Wallet, route: "/admin/finance", meta: "Finance" },
  { id: "a-refund", label: "Issue refund", section: "Actions", icon: Wallet, route: "/admin/finance", meta: "Finance" },
  { id: "a-verify", label: "Review driver applications", section: "Actions", icon: Users, route: "/admin/drivers", meta: "Drivers" },
  { id: "a-dispute", label: "Resolve open dispute", section: "Actions", icon: Scale, route: "/admin/disputes", meta: "Disputes" },
  { id: "a-broadcast", label: "Send broadcast", section: "Actions", icon: Megaphone, route: "/admin/comms", meta: "Comms" },
  { id: "a-report", label: "Generate financial report", section: "Actions", icon: FileText, route: "/admin/finance", meta: "Finance" },
  // Drivers
  { id: "d-emeka", label: "Emeka Nwosu", section: "Drivers", icon: Users, route: "/admin/drivers", meta: "★ 4.92 · Victoria Island" },
  { id: "d-fatima", label: "Fatima Bello", section: "Drivers", icon: Zap, route: "/admin/drivers", meta: "★ 4.88 · EV · Lekki" },
  { id: "d-seun", label: "Oluwaseun Kolade", section: "Drivers", icon: Users, route: "/admin/drivers", meta: "★ 4.76 · Ikeja" },
  // Hotels
  { id: "h-eko", label: "Eko Hotels & Suites", section: "Hotels", icon: Globe2, route: "/admin/hotels", meta: "5-Star · Victoria Island" },
  { id: "h-radisson", label: "Radisson Blu Ikeja", section: "Hotels", icon: Globe2, route: "/admin/hotels", meta: "5-Star · Ikeja GRA" },
  // Fleets
  { id: "f-green", label: "GreenRide Lagos", section: "Fleets", icon: Car, route: "/admin/fleet", meta: "64 drivers · 82% util" },
  { id: "f-metro", label: "Metro Express", section: "Fleets", icon: Car, route: "/admin/fleet", meta: "48 drivers · 78% util" },
];

interface CommandSearchProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
}

export function CommandSearch({ open, onClose, onNavigate }: CommandSearchProps) {
  const { t, theme } = useAdminTheme();
  const isDark = theme === "dark";
  const [query, setQuery] = useState("");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return SEARCH_INDEX.slice(0, 8);
    const q = query.toLowerCase();
    return SEARCH_INDEX.filter(r =>
      r.label.toLowerCase().includes(q) || r.section.toLowerCase().includes(q) || (r.meta || "").toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

  const grouped = useMemo(() => {
    const map: Record<string, SearchResult[]> = {};
    results.forEach(r => {
      if (!map[r.section]) map[r.section] = [];
      map[r.section].push(r);
    });
    return map;
  }, [results]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)); }
      if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
      if (e.key === "Enter" && results[selectedIdx]) {
        onNavigate(results[selectedIdx].route || "/admin");
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, selectedIdx, onClose, onNavigate]);

  // ⌘K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else onClose(); // toggle handled externally
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
          <motion.div
            className="absolute inset-0"
            style={{ backdropFilter: "blur(4px)", background: isDark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.2)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="relative w-full max-w-[560px] mx-4 rounded-2xl overflow-hidden"
            style={{
              background: t.overlay,
              border: `1px solid ${t.border}`,
              boxShadow: isDark ? "0 24px 80px rgba(0,0,0,0.6)" : "0 24px 80px rgba(0,0,0,0.15)",
            }}
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 h-12" style={{ borderBottom: `1px solid ${t.borderSubtle}` }}>
              <Search size={15} style={{ color: t.iconMuted }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => { setQuery(e.target.value); setSelectedIdx(0); }}
                placeholder="Search pages, drivers, actions..."
                className="flex-1 bg-transparent outline-none"
                style={{ color: t.text, ...TY.body, fontSize: "13px" }}
              />
              <span className="h-5 px-1.5 rounded flex items-center" style={{ background: t.surfaceActive, ...TY.cap, fontSize: "9px", color: t.textFaint }}>ESC</span>
            </div>

            {/* Results */}
            <div className="max-h-[360px] overflow-y-auto py-2">
              {results.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Search size={20} style={{ color: t.iconMuted, marginBottom: 8 }} />
                  <span style={{ ...TY.body, fontSize: "12px", color: t.textMuted }}>No results for "{query}"</span>
                </div>
              ) : (
                Object.entries(grouped).map(([section, items]) => (
                  <div key={section} className="mb-1">
                    <span className="block px-4 py-1" style={{ ...TY.label, fontSize: "9px", color: t.textFaint, letterSpacing: "0.06em" }}>{section.toUpperCase()}</span>
                    {items.map(item => {
                      const flatIdx = results.indexOf(item);
                      const isSelected = flatIdx === selectedIdx;
                      return (
                        <button
                          key={item.id}
                          onClick={() => { onNavigate(item.route || "/admin"); onClose(); }}
                          onMouseEnter={() => setSelectedIdx(flatIdx)}
                          className="w-full flex items-center gap-3 px-4 h-10 transition-colors"
                          style={{ background: isSelected ? t.surfaceHover : "transparent" }}
                        >
                          <item.icon size={14} style={{ color: isSelected ? BRAND.green : t.iconMuted }} />
                          <span className="flex-1 text-left truncate" style={{ ...TY.body, fontSize: "12px", color: isSelected ? t.text : t.textSecondary }}>{item.label}</span>
                          {item.meta && <span style={{ ...TY.bodyR, fontSize: "10px", color: t.textFaint }}>{item.meta}</span>}
                          {isSelected && <ArrowRight size={12} style={{ color: t.textMuted }} />}
                        </button>
                      );
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer hint */}
            <div className="flex items-center gap-4 px-4 h-9" style={{ borderTop: `1px solid ${t.borderSubtle}` }}>
              <span style={{ ...TY.cap, fontSize: "9px", color: t.textGhost }}>↑↓ navigate</span>
              <span style={{ ...TY.cap, fontSize: "9px", color: t.textGhost }}>↵ open</span>
              <span style={{ ...TY.cap, fontSize: "9px", color: t.textGhost }}>esc close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
