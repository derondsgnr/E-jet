/**
 * FLEET CONTEXT — Shared state types & context for fleet shell + sub-views.
 * Extracted to break circular dependency between fleet-shell ↔ fleet-variation-e.
 */

import { createContext, useContext } from "react";

// ── Mock Fleets (multi-fleet support) ──────────────────────────────────────

export const MOCK_FLEETS = [
  { id: "lagos", name: "Metro Lagos", location: "Lagos" },
  { id: "abuja", name: "Metro Abuja", location: "Abuja" },
];

export const ALL_FLEETS_ID = "__all__";

export interface FleetWorkspace {
  id: string;
  name: string;
  location: string;
}

// ─── Fleet State Types ──────────────────────────────────────────────────────

export type FleetJourneyState = "onboarding" | "empty" | "active";
export type FleetNavId = "dashboard" | "drivers" | "vehicles" | "earnings" | "settings";

/**
 * Deep-link payload: navigate to a tab AND pre-select a specific entity.
 * Consumed once by the target view, then auto-cleared.
 */
export interface FleetDeepLink {
  entityId: string;
  entityType: "driver" | "vehicle";
}

// ─── Fleet Context ──────────────────────────────────────────────────────────

export const FleetContext = createContext<{
  journeyState: FleetJourneyState;
  setJourneyState: (s: FleetJourneyState) => void;
  activeNav: FleetNavId;
  setActiveNav: (n: FleetNavId) => void;
  deepLink: FleetDeepLink | null;
  navigateTo: (nav: FleetNavId, deepLink?: FleetDeepLink) => void;
  consumeDeepLink: () => void;
  activeFleetId: string;
  setActiveFleetId: (id: string) => void;
  fleets: FleetWorkspace[];
  addFleet: (name: string, location: string) => void;
}>({
  journeyState: "active",
  setJourneyState: () => {},
  activeNav: "dashboard",
  setActiveNav: () => {},
  deepLink: null,
  navigateTo: () => {},
  consumeDeepLink: () => {},
  activeFleetId: "lagos",
  setActiveFleetId: () => {},
  fleets: [],
  addFleet: () => {},
});

export const useFleetContext = () => useContext(FleetContext);
