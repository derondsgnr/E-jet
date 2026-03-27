/**
 * SavedPlacesStore — React state management for saved places.
 *
 * Provides hooks for CRUD operations on saved places,
 * and a hook to get just the saved place names (for activity screen).
 *
 * Pure TS module (no JSX) — uses React hooks only.
 */

import { useState, useCallback, useMemo } from "react";
import { type SavedPlace, type PlaceIcon, initialSavedPlaces } from "./saved-places-data";

// ---------------------------------------------------------------------------
// Singleton state (shared across hook instances within same render tree)
// ---------------------------------------------------------------------------
let _places: SavedPlace[] = [...initialSavedPlaces];
let _listeners: Set<() => void> = new Set();

function notifyListeners() {
  _listeners.forEach((fn) => fn());
}

// ---------------------------------------------------------------------------
// useSavedPlaces — full CRUD hook
// ---------------------------------------------------------------------------
export function useSavedPlaces() {
  const [, setTick] = useState(0);
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  // Subscribe to changes
  useState(() => {
    _listeners.add(forceUpdate);
    return () => {
      _listeners.delete(forceUpdate);
    };
  });

  const places = _places;

  const addPlace = useCallback((place: SavedPlace) => {
    _places = [..._places, place];
    notifyListeners();
  }, []);

  const updatePlace = useCallback(
    (id: string, updates: Partial<Omit<SavedPlace, "id">>) => {
      _places = _places.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      );
      notifyListeners();
    },
    []
  );

  const removePlace = useCallback((id: string) => {
    _places = _places.filter((p) => p.id !== id);
    notifyListeners();
  }, []);

  /** Quick-save a place by name (from activity screen frequent places).
   *  Returns true if added, false if already exists. */
  const quickSave = useCallback((name: string): boolean => {
    const exists = _places.some(
      (p) => p.label.toLowerCase() === name.toLowerCase()
    );
    if (exists) return false;
    const newPlace: SavedPlace = {
      id: `sp-${Date.now()}`,
      label: name,
      address: name, // simplified — real app would geocode
      icon: "star",
      lat: 6.45,
      lng: 3.42,
      tripCount: 0,
      carbonSavedKg: 0,
      lastVisited: null,
    };
    _places = [..._places, newPlace];
    notifyListeners();
    return true;
  }, []);

  return { places, addPlace, updatePlace, removePlace, quickSave };
}

// ---------------------------------------------------------------------------
// useSavedPlaceNames — lightweight hook returning just labels
// ---------------------------------------------------------------------------
export function useSavedPlaceNames(): string[] {
  const { places } = useSavedPlaces();
  return useMemo(() => places.map((p) => p.label), [places]);
}
