 /**
 * Saved Places — mock data and types.
 *
 * Supports: Home, Work, Airport, and custom favorites.
 * Each place has an icon category, label, and full address.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export type PlaceIcon = "home" | "work" | "plane" | "gym" | "heart" | "star" | "coffee" | "book" | "shopping" | "hospital";

export interface SavedPlace {
  id: string;
  label: string;
  address: string;
  icon: PlaceIcon;
  /** lat/lng for map pin — mock values */
  lat: number;
  lng: number;
  /** How many times rider has gone here */
  tripCount: number;
  /** Carbon saved on EV trips to this place (kg) */
  carbonSavedKg: number;
  /** Last visited date string */
  lastVisited: string | null;
}

export const ICON_OPTIONS: { id: PlaceIcon; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "plane", label: "Airport" },
  { id: "gym", label: "Gym" },
  { id: "coffee", label: "Café" },
  { id: "heart", label: "Favourite" },
  { id: "star", label: "Special" },
  { id: "shopping", label: "Shopping" },
  { id: "hospital", label: "Hospital" },
  { id: "book", label: "School" },
];

// ---------------------------------------------------------------------------
// Search results (for the add-place search)
// ---------------------------------------------------------------------------
export interface SearchResult {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export const mockSearchResults: SearchResult[] = [
  { id: "sr1", name: "Eko Hotel & Suites", address: "Plot 1415 Adetokunbo Ademola St, V.I.", lat: 6.428, lng: 3.422 },
  { id: "sr2", name: "The Palms Shopping Mall", address: "1 Bis Way, Lekki Phase 1", lat: 6.434, lng: 3.460 },
  { id: "sr3", name: "Lagos Business School", address: "Km 22 Lekki-Epe Expy, Ajah", lat: 6.444, lng: 3.533 },
  { id: "sr4", name: "Landmark Beach", address: "Water Corporation Rd, V.I.", lat: 6.416, lng: 3.446 },
  { id: "sr5", name: "General Hospital Lagos", address: "Broad St, Lagos Island", lat: 6.449, lng: 3.397 },
  { id: "sr6", name: "National Theatre", address: "Iganmu, Surulere", lat: 6.467, lng: 3.390 },
  { id: "sr7", name: "Jabi Lake Mall", address: "Bala Sokoto Way, Jabi, Abuja", lat: 9.063, lng: 7.414 },
  { id: "sr8", name: "Body & Soul Gym", address: "Admiralty Way, Lekki Phase 1", lat: 6.436, lng: 3.462 },
];

// ---------------------------------------------------------------------------
// Initial saved places
// ---------------------------------------------------------------------------
export const initialSavedPlaces: SavedPlace[] = [
  {
    id: "sp-home",
    label: "Home",
    address: "12 Bourdillon Rd, Ikoyi",
    icon: "home",
    lat: 6.448,
    lng: 3.425,
    tripCount: 34,
    carbonSavedKg: 2.8,
    lastVisited: "Today",
  },
  {
    id: "sp-work",
    label: "Office",
    address: "235 Ikorodu Rd, Maryland",
    icon: "work",
    lat: 6.565,
    lng: 3.362,
    tripCount: 28,
    carbonSavedKg: 3.1,
    lastVisited: "Yesterday",
  },
  {
    id: "sp-airport",
    label: "Airport",
    address: "Murtala Muhammed International Airport, Ikeja",
    icon: "plane",
    lat: 6.577,
    lng: 3.321,
    tripCount: 6,
    carbonSavedKg: 0.9,
    lastVisited: "2 weeks ago",
  },
  {
    id: "sp-gym",
    label: "Gym",
    address: "Body & Soul Fitness, Admiralty Way, Lekki",
    icon: "gym",
    lat: 6.436,
    lng: 3.462,
    tripCount: 12,
    carbonSavedKg: 1.1,
    lastVisited: "3 days ago",
  },
  {
    id: "sp-palms",
    label: "The Palms",
    address: "1 Bis Way, Lekki Phase 1",
    icon: "shopping",
    lat: 6.434,
    lng: 3.460,
    tripCount: 8,
    carbonSavedKg: 0.6,
    lastVisited: "Last week",
  },
];
