/**
 * FLEET OWNER DASHBOARD — MOCK DATA
 *
 * All data traceable to real sources:
 *   - Vehicle data → vehicle registry table
 *   - Driver data → driver roster + dispatch status
 *   - Earnings → trips table × fleet_owner_share
 *   - Payouts → payout ledger
 */

export interface FleetVehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  plate: string;
  type: "EV" | "Gas";
  status: "registered" | "pending_docs" | "under_review" | "inspection_scheduled" | "approved" | "maintenance" | "suspended" | "deactivated";
  assignedDriverId: string | null;
  assignedDriverName: string | null;
  evData?: { batteryLevel: number; range: number; lastCharged: string };
  mileage?: number;
  lastService?: string;
  nextInspection?: string;
  insuranceExpiry?: string;
  addedDate?: string;
  color?: string;
  vin?: string;
}

export interface FleetDriver {
  id: string;
  name: string;
  phone: string;
  photo: string;
  status: "offline" | "online" | "on_trip" | "suspended";
  verificationStatus: "docs_submitted" | "under_review" | "approved" | "rejected";
  assignedVehicleId: string | null;
  assignedVehicle: string | null;
  rating: number;
  totalRides: number;
  earningsThisWeek: number;
  joinedDate: string;
  lastSeen?: string; // e.g. "2h ago", "3d ago" — for offline/suspended drivers
  sparkline: number[];
  currentRide?: { pickup: string; dropoff: string; eta: string; fare: number };
}

export interface FleetPayout {
  id: string;
  amount: number;
  date: string;
  status: "completed" | "processing" | "pending";
  bankAccount: string;
}

export interface FleetEarnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
  allTime: number;
  nextPayout: { amount: number; date: string };
  payouts: FleetPayout[];
  dailyChart: { day: string; amount: number }[];
}

export interface FleetOwnerData {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  commissionRate: number; // JET's cut in %
  fleetShare: number; // Fleet owner's share in %
  payoutSchedule: "weekly" | "daily";
  bankAccount: string;
  status: "active" | "invited" | "suspended";
  inviteLink: string;
  vehicles: FleetVehicle[];
  drivers: FleetDriver[];
  earnings: FleetEarnings;
}

// ─── Mock data ──────────────────────────────────────────────────────────────

export const MOCK_VEHICLES: FleetVehicle[] = [
  {
    id: "v1", make: "Toyota", model: "Camry", year: 2023, plate: "LND-284EP", type: "Gas",
    status: "approved", assignedDriverId: "d1", assignedDriverName: "Emeka Nwosu",
    mileage: 34200, lastService: "Feb 2026", nextInspection: "Jun 2026", insuranceExpiry: "Nov 2026", addedDate: "2025-08-12", color: "White", vin: "1HGBH...4521",
  },
  {
    id: "v2", make: "BYD", model: "Seal", year: 2024, plate: "LND-291KA", type: "EV",
    status: "approved", assignedDriverId: "d2", assignedDriverName: "Adaeze Okoro",
    evData: { batteryLevel: 78, range: 245, lastCharged: "2h ago" },
    mileage: 12400, lastService: "Jan 2026", nextInspection: "Jul 2026", insuranceExpiry: "Dec 2026", addedDate: "2025-10-01", color: "Midnight Blue", vin: "7SYRB...8812",
  },
  {
    id: "v3", make: "Honda", model: "Accord", year: 2022, plate: "LND-156BT", type: "Gas",
    status: "approved", assignedDriverId: "d3", assignedDriverName: "Tunde Adeyemi",
    mileage: 58700, lastService: "Mar 2026", nextInspection: "May 2026", insuranceExpiry: "Sep 2026", addedDate: "2025-06-20", color: "Silver", vin: "3CZRU...2091",
  },
  {
    id: "v4", make: "BYD", model: "Atto 3", year: 2024, plate: "LND-312FA", type: "EV",
    status: "inspection_scheduled", assignedDriverId: null, assignedDriverName: null,
    evData: { batteryLevel: 100, range: 420, lastCharged: "Today" },
    mileage: 0, nextInspection: "Mar 2026", addedDate: "2026-03-01", color: "Forest Green", vin: "7SYRB...1198",
  },
  {
    id: "v5", make: "Toyota", model: "Corolla", year: 2021, plate: "LND-098HJ", type: "Gas",
    status: "approved", assignedDriverId: "d4", assignedDriverName: "Chioma Eze",
    mileage: 71300, lastService: "Jan 2026", nextInspection: "Apr 2026", insuranceExpiry: "Aug 2026", addedDate: "2025-04-15", color: "Black", vin: "2T1BU...6643",
  },
  {
    id: "v6", make: "Hyundai", model: "Ioniq 5", year: 2024, plate: "LND-445KL", type: "EV",
    status: "under_review", assignedDriverId: null, assignedDriverName: null,
    evData: { batteryLevel: 92, range: 380, lastCharged: "1h ago" },
    mileage: 0, addedDate: "2026-03-08", color: "Gravity Gold", vin: "KMHK3...5590",
  },
  {
    id: "v7", make: "Toyota", model: "Camry", year: 2020, plate: "LND-667MN", type: "Gas",
    status: "maintenance", assignedDriverId: null, assignedDriverName: null,
    mileage: 92100, lastService: "Mar 2026", nextInspection: "Apr 2026", insuranceExpiry: "Jul 2026", addedDate: "2025-02-10", color: "Grey", vin: "4T1BF...3378",
  },
  {
    id: "v8", make: "Toyota", model: "Corolla", year: 2023, plate: "ABJ-421PQ", type: "Gas",
    status: "approved", assignedDriverId: "d6", assignedDriverName: "Obiora Agu",
    mileage: 28900, lastService: "Feb 2026", nextInspection: "Aug 2026", insuranceExpiry: "Oct 2026", addedDate: "2025-09-05", color: "White", vin: "2T1BU...7723",
  },
  {
    id: "v9", make: "BYD", model: "Atto 3", year: 2024, plate: "LND-510EV", type: "EV",
    status: "approved", assignedDriverId: "d7", assignedDriverName: "Folake Babatunde",
    evData: { batteryLevel: 85, range: 400, lastCharged: "3h ago" },
    mileage: 15600, lastService: "Dec 2025", nextInspection: "Jun 2026", insuranceExpiry: "Jan 2027", addedDate: "2025-10-15", color: "White", vin: "7SYRB...4401",
  },
  {
    id: "v10", make: "Honda", model: "Accord", year: 2023, plate: "KJA-118RT", type: "Gas",
    status: "approved", assignedDriverId: "d8", assignedDriverName: "Yusuf Bello",
    mileage: 41200, lastService: "Jan 2026", nextInspection: "May 2026", insuranceExpiry: "Sep 2026", addedDate: "2025-07-22", color: "Black", vin: "1HGCV...8834",
  },
  {
    id: "v11", make: "Hyundai", model: "Elantra", year: 2023, plate: "LND-330GH", type: "Gas",
    status: "approved", assignedDriverId: "d9", assignedDriverName: "Ngozi Udeh",
    mileage: 22100, lastService: "Feb 2026", nextInspection: "Jul 2026", insuranceExpiry: "Nov 2026", addedDate: "2025-11-10", color: "Silver", vin: "5NPD8...1190",
  },
  {
    id: "v12", make: "Toyota", model: "Camry", year: 2023, plate: "ABJ-256MK", type: "Gas",
    status: "approved", assignedDriverId: "d10", assignedDriverName: "Abubakar Sani",
    mileage: 36800, lastService: "Mar 2026", nextInspection: "Jun 2026", insuranceExpiry: "Dec 2026", addedDate: "2025-08-28", color: "White", vin: "4T1BZ...3398",
  },
  {
    id: "v13", make: "Kia", model: "K5", year: 2023, plate: "LND-712JN", type: "Gas",
    status: "approved", assignedDriverId: "d11", assignedDriverName: "Blessing Okafor",
    mileage: 27500, lastService: "Jan 2026", nextInspection: "May 2026", insuranceExpiry: "Oct 2026", addedDate: "2025-10-20", color: "Grey", vin: "KNAG4...4456",
  },
  {
    id: "v14", make: "Honda", model: "Civic", year: 2023, plate: "KJA-890VW", type: "Gas",
    status: "approved", assignedDriverId: "d12", assignedDriverName: "Kunle Fashola",
    mileage: 31900, lastService: "Feb 2026", nextInspection: "Aug 2026", insuranceExpiry: "Nov 2026", addedDate: "2025-09-18", color: "Blue", vin: "2HGF...1190",
  },
  {
    id: "v15", make: "BYD", model: "Dolphin", year: 2024, plate: "LND-604EV", type: "EV",
    status: "approved", assignedDriverId: "d13", assignedDriverName: "Halima Abdullahi",
    evData: { batteryLevel: 95, range: 350, lastCharged: "1h ago" },
    mileage: 8200, lastService: "Feb 2026", nextInspection: "Sep 2026", insuranceExpiry: "Feb 2027", addedDate: "2026-01-05", color: "White", vin: "7SYRB...5567",
  },
  {
    id: "v16", make: "Toyota", model: "Camry", year: 2023, plate: "ABJ-179PL", type: "Gas",
    status: "approved", assignedDriverId: "d14", assignedDriverName: "Segun Ajayi",
    mileage: 44100, lastService: "Mar 2026", nextInspection: "Jul 2026", insuranceExpiry: "Oct 2026", addedDate: "2025-06-15", color: "Silver", vin: "4T1BZ...8834",
  },
  {
    id: "v17", make: "Hyundai", model: "Ioniq 5", year: 2024, plate: "LND-446KL", type: "EV",
    status: "approved", assignedDriverId: "d15", assignedDriverName: "Amina Garba",
    evData: { batteryLevel: 88, range: 370, lastCharged: "2h ago" },
    mileage: 19300, lastService: "Jan 2026", nextInspection: "Jun 2026", insuranceExpiry: "Dec 2026", addedDate: "2025-11-01", color: "Lucid Blue", vin: "KMHK3...2278",
  },
  {
    id: "v18", make: "Kia", model: "Sportage", year: 2023, plate: "LND-881AB", type: "Gas",
    status: "suspended", assignedDriverId: null, assignedDriverName: null,
    mileage: 53200, lastService: "Dec 2025", nextInspection: "Overdue", insuranceExpiry: "Expired", addedDate: "2025-05-10", color: "Red", vin: "KNDPM...6643",
  },
  {
    id: "v19", make: "Toyota", model: "Corolla", year: 2023, plate: "KJA-334DE", type: "Gas",
    status: "approved", assignedDriverId: "d17", assignedDriverName: "Fatima Yusuf",
    mileage: 25700, lastService: "Feb 2026", nextInspection: "Jun 2026", insuranceExpiry: "Nov 2026", addedDate: "2025-09-12", color: "White", vin: "2T1BU...9901",
  },
  {
    id: "v20", make: "Honda", model: "Accord", year: 2023, plate: "ABJ-567FG", type: "Gas",
    status: "approved", assignedDriverId: "d18", assignedDriverName: "Chukwuma Ibe",
    mileage: 38400, lastService: "Jan 2026", nextInspection: "May 2026", insuranceExpiry: "Sep 2026", addedDate: "2025-07-30", color: "Black", vin: "1HGCV...4423",
  },
  {
    id: "v21", make: "BYD", model: "Seal", year: 2024, plate: "LND-298EV", type: "EV",
    status: "approved", assignedDriverId: "d19", assignedDriverName: "Damilola Oni",
    evData: { batteryLevel: 80, range: 250, lastCharged: "4h ago" },
    mileage: 14100, lastService: "Mar 2026", nextInspection: "Aug 2026", insuranceExpiry: "Jan 2027", addedDate: "2025-12-08", color: "Arctic Blue", vin: "7SYRB...7781",
  },
  {
    id: "v22", make: "Hyundai", model: "Elantra", year: 2023, plate: "KJA-445HJ", type: "Gas",
    status: "approved", assignedDriverId: "d20", assignedDriverName: "Maryam Aliyu",
    mileage: 18600, lastService: "Feb 2026", nextInspection: "Jul 2026", insuranceExpiry: "Dec 2026", addedDate: "2025-11-25", color: "White", vin: "5NPD8...1134",
  },
  {
    id: "v23", make: "Toyota", model: "Camry", year: 2023, plate: "LND-901KL", type: "Gas",
    status: "approved", assignedDriverId: "d21", assignedDriverName: "Ifeanyi Nnamdi",
    mileage: 33500, lastService: "Mar 2026", nextInspection: "Jun 2026", insuranceExpiry: "Oct 2026", addedDate: "2025-08-05", color: "Grey", vin: "4T1BZ...3367",
  },
  {
    id: "v24", make: "Kia", model: "K5", year: 2023, plate: "ABJ-623MN", type: "Gas",
    status: "pending_docs", assignedDriverId: null, assignedDriverName: null,
    mileage: 0, addedDate: "2026-03-10", color: "Silver", vin: "KNAG4...8890",
  },
  {
    id: "v25", make: "Honda", model: "Civic", year: 2023, plate: "LND-112PQ", type: "Gas",
    status: "deactivated", assignedDriverId: null, assignedDriverName: null,
    mileage: 67800, lastService: "Oct 2025", nextInspection: "Overdue", insuranceExpiry: "Expired", addedDate: "2025-03-15", color: "Grey", vin: "2HGF...5501",
  },
];

// Helper: generate realistic sparkline data
function spark(base: number, variance = 200): number[] {
  return Array.from({ length: 7 }, (_, i) => Math.max(0, base + Math.round((Math.random() - 0.4) * variance * (i + 1))));
}

export const MOCK_DRIVERS: FleetDriver[] = [
  // ── Active / On Trip ──────────────────────────────────────────────────
  {
    id: "d1", name: "Emeka Nwosu", phone: "+234 801 *** 2345", photo: "",
    status: "on_trip", verificationStatus: "approved",
    assignedVehicleId: "v1", assignedVehicle: "Toyota Camry · LND-284EP",
    rating: 4.87, totalRides: 342, earningsThisWeek: 45200, joinedDate: "2025-11-15",
    sparkline: [4500, 4600, 4700, 4800, 4900, 5000, 5100],
    currentRide: { pickup: "Nnamdi Azikiwe International Airport", dropoff: "University of Nigeria", eta: "10 mins", fare: 5000 },
  },
  {
    id: "d6", name: "Obiora Agu", phone: "+234 813 *** 5501", photo: "",
    status: "on_trip", verificationStatus: "approved",
    assignedVehicleId: "v8", assignedVehicle: "Toyota Corolla · ABJ-421PQ",
    rating: 4.78, totalRides: 411, earningsThisWeek: 52300, joinedDate: "2025-09-22",
    sparkline: spark(5200),
    currentRide: { pickup: "Alausa Secretariat", dropoff: "Ikeja City Mall", eta: "7 mins", fare: 3200 },
  },
  {
    id: "d7", name: "Folake Babatunde", phone: "+234 814 *** 8823", photo: "",
    status: "on_trip", verificationStatus: "approved",
    assignedVehicleId: "v9", assignedVehicle: "BYD Atto 3 · LND-510EV",
    rating: 4.91, totalRides: 278, earningsThisWeek: 41700, joinedDate: "2025-10-05",
    sparkline: spark(4100),
    currentRide: { pickup: "Lekki Phase 1", dropoff: "Victoria Island", eta: "14 mins", fare: 4800 },
  },
  {
    id: "d8", name: "Yusuf Bello", phone: "+234 816 *** 2241", photo: "",
    status: "on_trip", verificationStatus: "approved",
    assignedVehicleId: "v10", assignedVehicle: "Honda Accord · KJA-118RT",
    rating: 4.65, totalRides: 523, earningsThisWeek: 58100, joinedDate: "2025-07-18",
    sparkline: spark(5800),
    currentRide: { pickup: "Garki Area 11", dropoff: "Maitama District", eta: "5 mins", fare: 2800 },
  },
  {
    id: "d9", name: "Ngozi Udeh", phone: "+234 818 *** 7712", photo: "",
    status: "on_trip", verificationStatus: "approved",
    assignedVehicleId: "v11", assignedVehicle: "Hyundai Elantra · LND-330GH",
    rating: 4.83, totalRides: 189, earningsThisWeek: 29600, joinedDate: "2026-01-02",
    sparkline: spark(2900),
    currentRide: { pickup: "Maryland Mall", dropoff: "Ojodu Berger", eta: "18 mins", fare: 3500 },
  },
  // ── Online / Available ────────────────────────────────────────────────
  {
    id: "d2", name: "Adaeze Okoro", phone: "+234 802 *** 6789", photo: "",
    status: "online", verificationStatus: "approved",
    assignedVehicleId: "v2", assignedVehicle: "BYD Seal · LND-291KA",
    rating: 4.92, totalRides: 287, earningsThisWeek: 38900, joinedDate: "2025-12-03",
    sparkline: [3800, 3900, 4000, 4100, 4200, 4300, 4400],
  },
  {
    id: "d4", name: "Chioma Eze", phone: "+234 805 *** 8765", photo: "",
    status: "online", verificationStatus: "approved",
    assignedVehicleId: "v5", assignedVehicle: "Toyota Corolla · LND-098HJ",
    rating: 4.95, totalRides: 156, earningsThisWeek: 31400, joinedDate: "2026-02-01",
    sparkline: [3100, 3200, 3300, 3400, 3500, 3600, 3700],
  },
  {
    id: "d10", name: "Abubakar Sani", phone: "+234 807 *** 3398", photo: "",
    status: "online", verificationStatus: "approved",
    assignedVehicleId: "v12", assignedVehicle: "Toyota Camry · ABJ-256MK",
    rating: 4.72, totalRides: 445, earningsThisWeek: 47800, joinedDate: "2025-08-30",
    sparkline: spark(4700),
  },
  {
    id: "d11", name: "Blessing Okafor", phone: "+234 809 *** 4456", photo: "",
    status: "online", verificationStatus: "approved",
    assignedVehicleId: "v13", assignedVehicle: "Kia K5 · LND-712JN",
    rating: 4.88, totalRides: 312, earningsThisWeek: 36200, joinedDate: "2025-11-28",
    sparkline: spark(3600),
  },
  {
    id: "d12", name: "Kunle Fashola", phone: "+234 811 *** 1190", photo: "",
    status: "online", verificationStatus: "approved",
    assignedVehicleId: "v14", assignedVehicle: "Honda Civic · KJA-890VW",
    rating: 4.69, totalRides: 267, earningsThisWeek: 28400, joinedDate: "2025-12-14",
    sparkline: spark(2800),
  },
  {
    id: "d13", name: "Halima Abdullahi", phone: "+234 817 *** 5567", photo: "",
    status: "online", verificationStatus: "approved",
    assignedVehicleId: "v15", assignedVehicle: "BYD Dolphin · LND-604EV",
    rating: 4.96, totalRides: 98, earningsThisWeek: 24100, joinedDate: "2026-02-18",
    sparkline: spark(2400),
  },
  {
    id: "d14", name: "Segun Ajayi", phone: "+234 803 *** 8834", photo: "",
    status: "online", verificationStatus: "approved",
    assignedVehicleId: "v16", assignedVehicle: "Toyota Camry · ABJ-179PL",
    rating: 4.74, totalRides: 501, earningsThisWeek: 55600, joinedDate: "2025-06-10",
    sparkline: spark(5500),
  },
  {
    id: "d15", name: "Amina Garba", phone: "+234 810 *** 2278", photo: "",
    status: "online", verificationStatus: "approved",
    assignedVehicleId: "v17", assignedVehicle: "Hyundai Ioniq 5 · LND-445KL",
    rating: 4.81, totalRides: 204, earningsThisWeek: 33100, joinedDate: "2025-12-22",
    sparkline: spark(3300),
  },
  // ── Offline ───────────────────────────────────────────────────────────
  {
    id: "d3", name: "Tunde Adeyemi", phone: "+234 803 *** 4321", photo: "",
    status: "offline", verificationStatus: "approved",
    assignedVehicleId: "v3", assignedVehicle: "Honda Accord · LND-156BT",
    rating: 4.71, totalRides: 198, earningsThisWeek: 22100, joinedDate: "2026-01-10",
    sparkline: [2200, 2300, 2400, 2500, 2600, 2700, 2800],
    lastSeen: "2h ago",
  },
  {
    id: "d16", name: "Olumide Coker", phone: "+234 815 *** 6643", photo: "",
    status: "offline", verificationStatus: "approved",
    assignedVehicleId: "v18", assignedVehicle: "Kia Sportage · LND-881AB",
    rating: 4.58, totalRides: 378, earningsThisWeek: 18200, joinedDate: "2025-10-01",
    sparkline: spark(1800, 400),
    lastSeen: "3d ago",
  },
  {
    id: "d17", name: "Fatima Yusuf", phone: "+234 812 *** 9901", photo: "",
    status: "offline", verificationStatus: "approved",
    assignedVehicleId: "v19", assignedVehicle: "Toyota Corolla · KJA-334DE",
    rating: 4.63, totalRides: 231, earningsThisWeek: 12800, joinedDate: "2025-11-05",
    sparkline: spark(1200, 300),
    lastSeen: "1h ago",
  },
  {
    id: "d18", name: "Chukwuma Ibe", phone: "+234 808 *** 4423", photo: "",
    status: "offline", verificationStatus: "approved",
    assignedVehicleId: "v20", assignedVehicle: "Honda Accord · ABJ-567FG",
    rating: 4.77, totalRides: 445, earningsThisWeek: 8900, joinedDate: "2025-08-14",
    sparkline: spark(900, 200),
    lastSeen: "5d ago",
  },
  {
    id: "d19", name: "Damilola Oni", phone: "+234 806 *** 7781", photo: "",
    status: "offline", verificationStatus: "approved",
    assignedVehicleId: "v21", assignedVehicle: "BYD Seal · LND-298EV",
    rating: 4.84, totalRides: 167, earningsThisWeek: 15400, joinedDate: "2026-01-19",
    sparkline: spark(1500, 300),
    lastSeen: "2h ago",
  },
  {
    id: "d20", name: "Maryam Aliyu", phone: "+234 819 *** 1134", photo: "",
    status: "offline", verificationStatus: "approved",
    assignedVehicleId: "v22", assignedVehicle: "Hyundai Elantra · KJA-445HJ",
    rating: 4.59, totalRides: 89, earningsThisWeek: 0, joinedDate: "2026-02-25",
    sparkline: spark(0, 100),
    lastSeen: "4d ago",
  },
  {
    id: "d21", name: "Ifeanyi Nnamdi", phone: "+234 804 *** 3367", photo: "",
    status: "offline", verificationStatus: "approved",
    assignedVehicleId: "v23", assignedVehicle: "Toyota Camry · LND-901KL",
    rating: 4.66, totalRides: 302, earningsThisWeek: 21700, joinedDate: "2025-09-08",
    sparkline: spark(2100, 400),
    lastSeen: "3h ago",
  },
  {
    id: "d22", name: "Grace Obi", phone: "+234 811 *** 8890", photo: "",
    status: "offline", verificationStatus: "approved",
    assignedVehicleId: "v24", assignedVehicle: "Kia K5 · ABJ-623MN",
    rating: 4.73, totalRides: 134, earningsThisWeek: 9200, joinedDate: "2026-01-30",
    sparkline: spark(900, 200),
    lastSeen: "2d ago",
  },
  // ── Suspended ─────────────────────────────────────────────────────────
  {
    id: "d23", name: "Osagie Ehigiator", phone: "+234 802 *** 5501", photo: "",
    status: "suspended", verificationStatus: "approved",
    assignedVehicleId: "v25", assignedVehicle: "Honda Civic · LND-112PQ",
    rating: 3.92, totalRides: 567, earningsThisWeek: 0, joinedDate: "2025-05-20",
    sparkline: spark(0, 50),
    lastSeen: "1w ago",
  },
  // ── Pipeline: Verification ────────────────────────────────────────────
  {
    id: "d5", name: "Ibrahim Musa", phone: "+234 806 *** 1234", photo: "",
    status: "offline", verificationStatus: "under_review",
    assignedVehicleId: null, assignedVehicle: null,
    rating: 0, totalRides: 0, earningsThisWeek: 0, joinedDate: "2026-03-10",
    sparkline: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "d24", name: "Kemi Adebayo", phone: "+234 815 *** 2298", photo: "",
    status: "offline", verificationStatus: "docs_submitted",
    assignedVehicleId: null, assignedVehicle: null,
    rating: 0, totalRides: 0, earningsThisWeek: 0, joinedDate: "2026-03-12",
    sparkline: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "d25", name: "Suleiman Danladi", phone: "+234 808 *** 6634", photo: "",
    status: "offline", verificationStatus: "under_review",
    assignedVehicleId: null, assignedVehicle: null,
    rating: 0, totalRides: 0, earningsThisWeek: 0, joinedDate: "2026-03-08",
    sparkline: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "d26", name: "Nkechi Onyema", phone: "+234 812 *** 9945", photo: "",
    status: "offline", verificationStatus: "docs_submitted",
    assignedVehicleId: null, assignedVehicle: null,
    rating: 0, totalRides: 0, earningsThisWeek: 0, joinedDate: "2026-03-14",
    sparkline: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "d27", name: "Abdulrahman Balogun", phone: "+234 819 *** 1178", photo: "",
    status: "offline", verificationStatus: "under_review",
    assignedVehicleId: null, assignedVehicle: null,
    rating: 0, totalRides: 0, earningsThisWeek: 0, joinedDate: "2026-03-06",
    sparkline: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "d28", name: "Titilayo Fagbemi", phone: "+234 804 *** 5523", photo: "",
    status: "offline", verificationStatus: "rejected",
    assignedVehicleId: null, assignedVehicle: null,
    rating: 0, totalRides: 0, earningsThisWeek: 0, joinedDate: "2026-02-28",
    sparkline: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "d29", name: "Obinna Eze", phone: "+234 816 *** 3312", photo: "",
    status: "offline", verificationStatus: "docs_submitted",
    assignedVehicleId: null, assignedVehicle: null,
    rating: 0, totalRides: 0, earningsThisWeek: 0, joinedDate: "2026-03-13",
    sparkline: [0, 0, 0, 0, 0, 0, 0],
  },
  {
    id: "d30", name: "Hauwa Mohammed", phone: "+234 807 *** 7756", photo: "",
    status: "offline", verificationStatus: "under_review",
    assignedVehicleId: null, assignedVehicle: null,
    rating: 0, totalRides: 0, earningsThisWeek: 0, joinedDate: "2026-03-09",
    sparkline: [0, 0, 0, 0, 0, 0, 0],
  },
];

export const MOCK_PAYOUTS: FleetPayout[] = [
  { id: "p1", amount: 187500, date: "7 Mar 2026", status: "completed", bankAccount: "••••• 4521 · GTBank" },
  { id: "p2", amount: 203200, date: "28 Feb 2026", status: "completed", bankAccount: "••••• 4521 · GTBank" },
  { id: "p3", amount: 168900, date: "21 Feb 2026", status: "completed", bankAccount: "••••• 4521 · GTBank" },
  { id: "p4", amount: 195400, date: "14 Feb 2026", status: "completed", bankAccount: "••••• 4521 · GTBank" },
  { id: "p5", amount: 178200, date: "7 Feb 2026", status: "completed", bankAccount: "••••• 4521 · GTBank" },
  { id: "p6", amount: 212100, date: "31 Jan 2026", status: "completed", bankAccount: "••••• 4521 · GTBank" },
  { id: "p7", amount: 191800, date: "24 Jan 2026", status: "completed", bankAccount: "••••• 4521 · GTBank" },
  { id: "p8", amount: 156300, date: "17 Jan 2026", status: "completed", bankAccount: "••••• 4521 · GTBank" },
  { id: "p9", amount: 184700, date: "10 Jan 2026", status: "completed", bankAccount: "••••• 4521 · GTBank" },
  { id: "p10", amount: 201500, date: "3 Jan 2026", status: "completed", bankAccount: "••••• 4521 · GTBank" },
  { id: "p11", amount: 143600, date: "27 Dec 2025", status: "completed", bankAccount: "••••• 4521 · GTBank" },
  { id: "p12", amount: 167800, date: "20 Dec 2025", status: "completed", bankAccount: "••••• 4521 · GTBank" },
];

export const MOCK_WEEKLY_CHART = [
  { week: "W1 Jan", amount: 156300 },
  { week: "W2 Jan", amount: 184700 },
  { week: "W3 Jan", amount: 191800 },
  { week: "W4 Jan", amount: 212100 },
  { week: "W1 Feb", amount: 178200 },
  { week: "W2 Feb", amount: 195400 },
  { week: "W3 Feb", amount: 168900 },
  { week: "W4 Feb", amount: 203200 },
  { week: "W1 Mar", amount: 187500 },
  { week: "W2 Mar", amount: 137600 },
];

export const MOCK_DAILY_CHART = [
  { day: "Mon", amount: 28400 },
  { day: "Tue", amount: 32100 },
  { day: "Wed", amount: 27800 },
  { day: "Thu", amount: 35600 },
  { day: "Fri", amount: 41200 },
  { day: "Sat", amount: 48900 },
  { day: "Sun", amount: 22300 },
];

// ─── Notifications ──────────────────────────────────────────────────────────
// Source: notification_events table (event_type, entity_id, fleet_owner_id, timestamp, read)

export type NotifCategory = "earnings" | "drivers" | "vehicles" | "system";

export interface FleetNotification {
  id: string;
  category: NotifCategory;
  title: string;
  body: string;
  timestamp: string;       // relative, e.g. "2m ago"
  read: boolean;
  /** Deep-link target inside fleet shell */
  action?: {
    nav: "dashboard" | "drivers" | "vehicles" | "earnings" | "settings";
    /** Optional sub-tab or entity focus */
    tab?: string;
    entityId?: string;
  };
  /** Visual accent override (defaults by category) */
  accent?: string;
}

export const MOCK_NOTIFICATIONS: FleetNotification[] = [
  {
    id: "n1",
    category: "earnings",
    title: "Payout Sent",
    body: "₦187,500 deposited to GTBank ••••4521",
    timestamp: "12m ago",
    read: false,
    action: { nav: "earnings", tab: "payouts" },
  },
  {
    id: "n2",
    category: "drivers",
    title: "Driver Milestone",
    body: "Emeka Obi completed 500th ride this month",
    timestamp: "1h ago",
    read: false,
    action: { nav: "drivers", entityId: "d1" },
  },
  {
    id: "n3",
    category: "earnings",
    title: "Weekly Summary Ready",
    body: "₦137,600 earned across 142 rides (W2 Mar)",
    timestamp: "3h ago",
    read: false,
    action: { nav: "earnings", tab: "overview" },
  },
  {
    id: "n4",
    category: "vehicles",
    title: "Inspection Due",
    body: "Toyota Camry (LND-841KJ) — inspection in 3 days",
    timestamp: "5h ago",
    read: true,
    action: { nav: "vehicles", entityId: "v2" },
  },
  {
    id: "n5",
    category: "earnings",
    title: "Top Earner Alert",
    body: "Adaeze Nwosu earned ₦42,800 this week — fleet best",
    timestamp: "6h ago",
    read: true,
    action: { nav: "earnings", tab: "drivers" },
  },
  {
    id: "n6",
    category: "drivers",
    title: "KYC Approved",
    body: "Ngozi Eze verification approved — ready for dispatch",
    timestamp: "8h ago",
    read: true,
    action: { nav: "drivers", entityId: "d5" },
  },
  {
    id: "n7",
    category: "system",
    title: "Commission Rate Update",
    body: "JET platform fee drops to 18% effective April 1",
    timestamp: "1d ago",
    read: true,
    action: { nav: "settings" },
  },
  {
    id: "n8",
    category: "earnings",
    title: "Payout Processed",
    body: "₦203,200 deposited to GTBank ••••4521",
    timestamp: "1d ago",
    read: true,
    action: { nav: "earnings", tab: "payouts" },
  },
  {
    id: "n9",
    category: "vehicles",
    title: "New Vehicle Added",
    body: "Hyundai Ioniq 5 (ABJ-102EV) registered to fleet",
    timestamp: "2d ago",
    read: true,
    action: { nav: "vehicles", entityId: "v5" },
  },
  {
    id: "n10",
    category: "drivers",
    title: "Driver Went Offline",
    body: "Uche Adigwe hasn't gone online in 48 hours",
    timestamp: "2d ago",
    read: true,
    action: { nav: "drivers", entityId: "d6" },
  },
];

export const MOCK_FLEET_OWNER: FleetOwnerData = {
  id: "fo1",
  businessName: "Metro Express Fleet",
  ownerName: "Chidi Okonkwo",
  email: "chidi@metroexpress.ng",
  phone: "+234 802 345 6789",
  commissionRate: 20,
  fleetShare: 15,
  payoutSchedule: "weekly",
  bankAccount: "••••• 4521 · GTBank",
  status: "active",
  inviteLink: "jet.ng/join/metro-express",
  vehicles: MOCK_VEHICLES,
  drivers: MOCK_DRIVERS,
  earnings: {
    today: 36200,
    thisWeek: 137600,
    thisMonth: 582400,
    allTime: 2847500,
    nextPayout: { amount: 137600, date: "14 Mar 2026" },
    payouts: MOCK_PAYOUTS,
    dailyChart: MOCK_DAILY_CHART,
  },
};