 /**
 * Shared mock data for Destination Search variations.
 * Same data, three different presentations.
 */

export interface Place {
  id: string;
  name: string;
  address: string;
  type: "recent" | "saved" | "suggested";
  icon: "home" | "work" | "pin" | "star" | "clock" | "plane";
  eta?: string;
  distance?: string;
  fare?: string;
  evFare?: string;
}

export const savedPlaces: Place[] = [
  {
    id: "s1",
    name: "Home",
    address: "12 Bourdillon Rd, Ikoyi",
    type: "saved",
    icon: "home",
    eta: "—",
    distance: "—",
  },
  {
    id: "s2",
    name: "Office",
    address: "235 Ikorodu Rd, Maryland",
    type: "saved",
    icon: "work",
    eta: "25 min",
    distance: "14.2 km",
    fare: "₦4,600",
    evFare: "₦3,900",
  },
];

export const recentSearches: Place[] = [
  {
    id: "r1",
    name: "Lekki Phase 1",
    address: "Admiralty Way, Lekki Phase 1",
    type: "recent",
    icon: "clock",
    eta: "12 min",
    distance: "6.8 km",
    fare: "₦3,200",
    evFare: "₦2,800",
  },
  {
    id: "r2",
    name: "Ikeja City Mall",
    address: "Alausa, Obafemi Awolowo Way, Ikeja",
    type: "recent",
    icon: "clock",
    eta: "35 min",
    distance: "22.1 km",
    fare: "₦5,800",
    evFare: "₦4,900",
  },
  {
    id: "r3",
    name: "Murtala Muhammed Airport",
    address: "Ikeja, Lagos",
    type: "recent",
    icon: "plane",
    eta: "40 min",
    distance: "26.3 km",
    fare: "₦6,500",
    evFare: "₦5,600",
  },
];

export const suggestions: Place[] = [
  {
    id: "sg1",
    name: "The Palms Shopping Mall",
    address: "1 Bis Way, Lekki Phase 1",
    type: "suggested",
    icon: "star",
    eta: "15 min",
    distance: "8.2 km",
    fare: "₦3,500",
    evFare: "₦3,000",
  },
  {
    id: "sg2",
    name: "Eko Hotel & Suites",
    address: "Plot 1415 Adetokunbo Ademola St, V.I.",
    type: "suggested",
    icon: "star",
    eta: "8 min",
    distance: "3.4 km",
    fare: "₦2,200",
    evFare: "₦1,900",
  },
  {
    id: "sg3",
    name: "Computer Village",
    address: "Otigba St, Ikeja",
    type: "suggested",
    icon: "pin",
    eta: "30 min",
    distance: "18.7 km",
    fare: "₦5,200",
    evFare: "₦4,400",
  },
];
