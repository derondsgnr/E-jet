/**
 * HOTEL — Shared types & context
 * Extracted from hotel-shell.tsx to prevent circular dependencies.
 * Same pattern as fleet-context.tsx.
 */

import { createContext, useContext } from "react";

export type HotelJourneyState = "onboarding" | "empty" | "active";
export type HotelNavId = "dashboard" | "book" | "rides" | "billing" | "settings";

export const HotelContext = createContext<{
  journeyState: HotelJourneyState;
  setJourneyState: (s: HotelJourneyState) => void;
  activeNav: HotelNavId;
  setActiveNav: (n: HotelNavId) => void;
  navigateTo: (nav: HotelNavId) => void;
}>({
  journeyState: "active",
  setJourneyState: () => {},
  activeNav: "dashboard",
  setActiveNav: () => {},
  navigateTo: () => {},
});

export const useHotelContext = () => useContext(HotelContext);
