/**
 * HOTEL DASHBOARD — MOCK DATA
 *
 * All data traceable to real sources:
 *   - Hotel profile → hotel_partners table
 *   - Rides → trips table WHERE booking_source = 'hotel'
 *   - Billing → hotel_invoices table
 *   - Team → hotel_team_members table
 *   - Guests → hotel_guest_bookings table
 *
 * Data source annotations: [TABLE.column]
 */

// ── Types ───────────────────────────────────────────────────────────────────

export interface HotelRide {
  id: string;
  guestName: string;                // [hotel_guest_bookings.guest_name]
  roomNumber: string;               // [hotel_guest_bookings.room_number]
  pickup: string;                   // [trips.pickup_address]
  dropoff: string;                  // [trips.dropoff_address]
  status: "requested" | "driver_assigned" | "in_progress" | "completed" | "cancelled" | "reassigning";
  fare: number;                     // [trips.fare_amount]
  driverName: string | null;        // [drivers.full_name]
  driverRating: number;             // [drivers.rating]
  requestedAt: string;              // [trips.created_at]
  completedAt: string | null;       // [trips.completed_at]
  bookedBy: string;                 // [hotel_team_members.name] who booked
  vehicleType: "Standard" | "Premium" | "EV";
  paymentMethod: "hotel_account" | "guest_card";
  /** Reassignment metadata — present only when status = "reassigning" */
  reassignment?: {
    cancelledDriverName: string;    // [drivers.full_name] — driver who cancelled
    cancelReason: string;           // [trip_cancellations.reason]
    cancelledAt: string;            // [trip_cancellations.created_at]
    attempt: number;                // [trip_reassignments.attempt_number]
    maxAttempts: number;            // [config: REASSIGNMENT.maxAttempts]
    timeoutSeconds: number;         // [config: REASSIGNMENT.timeoutSeconds]
    elapsedSeconds: number;         // NOW() - trip_reassignments.created_at
  };
}

export interface HotelInvoice {
  id: string;
  period: string;                   // [hotel_invoices.billing_period]
  amount: number;                   // [hotel_invoices.total_amount]
  rideCount: number;                // [hotel_invoices.ride_count]
  status: "paid" | "pending" | "overdue";
  dueDate: string;                  // [hotel_invoices.due_date]
  paidDate: string | null;          // [hotel_invoices.paid_at]
}

export interface HotelTeamMember {
  id: string;
  name: string;                     // [hotel_team_members.name]
  role: "admin" | "concierge" | "front_desk";
  email: string;                    // [hotel_team_members.email]
  phone: string;
  status: "active" | "invited" | "deactivated";
  ridesBooked: number;              // COUNT(trips WHERE booked_by = member_id)
  lastActive: string;               // [hotel_team_members.last_active]
}

export interface HotelNotification {
  id: string;
  type: "ride_completed" | "ride_cancelled" | "invoice_due" | "team_joined" | "system";
  title: string;
  detail: string;
  time: string;
  read: boolean;
}

export interface HotelProfile {
  hotelName: string;               // [hotel_partners.name]
  address: string;                 // [hotel_partners.address]
  starRating: number;              // [hotel_partners.star_rating]
  contactName: string;             // [hotel_partners.contact_name]
  email: string;                   // [hotel_partners.email]
  phone: string;                   // [hotel_partners.phone]
  billingCycle: string;            // [hotel_partners.billing_cycle]
  creditLimit: number;             // [hotel_partners.credit_limit]
  creditUsed: number;              // SUM(hotel_invoices.total WHERE status='pending')
  corporateRate: string;           // [hotel_partners.rate_type]
  rides: HotelRide[];
  invoices: HotelInvoice[];
  team: HotelTeamMember[];
  notifications: HotelNotification[];
  // Computed / aggregated KPIs
  kpis: {
    ridesToday: number;            // COUNT(trips WHERE date=today)
    ridesThisWeek: number;         // COUNT(trips WHERE date IN this_week)
    ridesThisMonth: number;        // COUNT(trips WHERE date IN this_month)
    spendToday: number;            // SUM(fare WHERE date=today)
    spendThisWeek: number;         // SUM(fare WHERE date IN this_week)
    spendThisMonth: number;        // SUM(fare WHERE date IN this_month)
    avgFare: number;               // AVG(fare) this month
    avgRating: number;             // AVG(driver_rating) this month
    activeGuests: number;          // COUNT(DISTINCT guest WHERE ride active)
    weeklyChart: number[];         // 7 days of ride counts
  };
}


// ── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_RIDES: HotelRide[] = [
  {
    id: "hr-1", guestName: "Mr. James Wright", roomNumber: "1204",
    pickup: "Eko Hotels, V.I.", dropoff: "Murtala Muhammed Airport",
    status: "completed", fare: 18500, driverName: "Emeka Nwosu", driverRating: 4.9,
    requestedAt: "Today, 8:15 AM", completedAt: "Today, 9:02 AM",
    bookedBy: "Adaeze Okafor", vehicleType: "Premium", paymentMethod: "hotel_account",
  },
  {
    id: "hr-2", guestName: "Ms. Sarah Chen", roomNumber: "806",
    pickup: "Eko Hotels, V.I.", dropoff: "Lekki Conservation Centre",
    status: "in_progress", fare: 12800, driverName: "Chidi Obi", driverRating: 4.8,
    requestedAt: "Today, 10:30 AM", completedAt: null,
    bookedBy: "Kemi Adeyemi", vehicleType: "EV", paymentMethod: "hotel_account",
  },
  {
    id: "hr-3", guestName: "Dr. Olawale Bello", roomNumber: "1502",
    pickup: "Eko Hotels, V.I.", dropoff: "Civic Centre, V.I.",
    status: "driver_assigned", fare: 5200, driverName: "Ada Eze", driverRating: 4.7,
    requestedAt: "Today, 11:00 AM", completedAt: null,
    bookedBy: "Adaeze Okafor", vehicleType: "Standard", paymentMethod: "guest_card",
  },
  {
    id: "hr-4", guestName: "Mrs. Lisa Anderson", roomNumber: "910",
    pickup: "Eko Hotels, V.I.", dropoff: "National Theatre, Iganmu",
    status: "completed", fare: 9400, driverName: "Uche Nwobi", driverRating: 4.6,
    requestedAt: "Yesterday, 3:45 PM", completedAt: "Yesterday, 4:30 PM",
    bookedBy: "Front Desk", vehicleType: "Standard", paymentMethod: "hotel_account",
  },
  {
    id: "hr-5", guestName: "Mr. Ahmed Khalil", roomNumber: "1108",
    pickup: "Eko Hotels, V.I.", dropoff: "Landmark Beach, Oniru",
    status: "completed", fare: 4800, driverName: "Emeka Nwosu", driverRating: 4.9,
    requestedAt: "Yesterday, 10:00 AM", completedAt: "Yesterday, 10:25 AM",
    bookedBy: "Adaeze Okafor", vehicleType: "EV", paymentMethod: "hotel_account",
  },
  {
    id: "hr-6", guestName: "Ms. Rachel Kim", roomNumber: "704",
    pickup: "Murtala Muhammed Airport", dropoff: "Eko Hotels, V.I.",
    status: "completed", fare: 19200, driverName: "Chidi Obi", driverRating: 4.8,
    requestedAt: "2 days ago", completedAt: "2 days ago",
    bookedBy: "Kemi Adeyemi", vehicleType: "Premium", paymentMethod: "hotel_account",
  },
  {
    id: "hr-7", guestName: "Mr. David Okonkwo", roomNumber: "1305",
    pickup: "Eko Hotels, V.I.", dropoff: "Eko Atlantic City",
    status: "cancelled", fare: 0, driverName: null, driverRating: 0,
    requestedAt: "2 days ago", completedAt: null,
    bookedBy: "Front Desk", vehicleType: "Standard", paymentMethod: "hotel_account",
  },
  {
    id: "hr-8", guestName: "Mrs. Fatima Al-Hassan", roomNumber: "1410",
    pickup: "Eko Hotels, V.I.", dropoff: "The Palms Shopping Mall",
    status: "completed", fare: 7600, driverName: "Ada Eze", driverRating: 4.7,
    requestedAt: "3 days ago", completedAt: "3 days ago",
    bookedBy: "Adaeze Okafor", vehicleType: "Standard", paymentMethod: "hotel_account",
  },
  {
    id: "hr-9", guestName: "Mr. Tobias Meyer", roomNumber: "1601",
    pickup: "Eko Hotels, V.I.", dropoff: "Ikeja City Mall",
    status: "reassigning", fare: 14200, driverName: null, driverRating: 0,
    requestedAt: "Today, 11:45 AM", completedAt: null,
    bookedBy: "Kemi Adeyemi", vehicleType: "Premium", paymentMethod: "hotel_account",
    reassignment: {
      cancelledDriverName: "Tunde Bakare",
      cancelReason: "Vehicle breakdown",
      cancelledAt: "Today, 11:52 AM",
      attempt: 1,
      maxAttempts: 3,
      timeoutSeconds: 300,
      elapsedSeconds: 87,
    },
  },
];

const MOCK_INVOICES: HotelInvoice[] = [
  { id: "inv-1", period: "March 2026", amount: 482600, rideCount: 47, status: "pending", dueDate: "Apr 1, 2026", paidDate: null },
  { id: "inv-2", period: "February 2026", amount: 618400, rideCount: 62, status: "paid", dueDate: "Mar 1, 2026", paidDate: "Feb 28, 2026" },
  { id: "inv-3", period: "January 2026", amount: 534200, rideCount: 53, status: "paid", dueDate: "Feb 1, 2026", paidDate: "Jan 30, 2026" },
  { id: "inv-4", period: "December 2025", amount: 721800, rideCount: 78, status: "paid", dueDate: "Jan 1, 2026", paidDate: "Dec 30, 2025" },
];

const MOCK_TEAM: HotelTeamMember[] = [
  { id: "tm-1", name: "Adaeze Okafor", role: "admin", email: "adaeze@ekohotels.com", phone: "+234 801 234 5678", status: "active", ridesBooked: 124, lastActive: "Now" },
  { id: "tm-2", name: "Kemi Adeyemi", role: "concierge", email: "kemi@ekohotels.com", phone: "+234 802 345 6789", status: "active", ridesBooked: 89, lastActive: "2h ago" },
  { id: "tm-3", name: "Front Desk", role: "front_desk", email: "frontdesk@ekohotels.com", phone: "+234 803 456 7890", status: "active", ridesBooked: 45, lastActive: "5m ago" },
  { id: "tm-4", name: "Chioma Eze", role: "concierge", email: "chioma@ekohotels.com", phone: "+234 804 567 8901", status: "invited", ridesBooked: 0, lastActive: "—" },
];

const MOCK_NOTIFICATIONS: HotelNotification[] = [
  { id: "hn-1", type: "ride_completed", title: "Ride completed", detail: "Mr. James Wright → Airport · ₦18,500", time: "1h", read: false },
  { id: "hn-2", type: "ride_completed", title: "Guest picked up", detail: "Ms. Sarah Chen → Lekki Conservation · In progress", time: "30m", read: false },
  { id: "hn-3", type: "invoice_due", title: "Invoice ready", detail: "March 2026 — ₦482,600 · Due Apr 1", time: "1d", read: true },
  { id: "hn-4", type: "team_joined", title: "Team member joined", detail: "Kemi Adeyemi accepted invitation", time: "3d", read: true },
  { id: "hn-5", type: "system", title: "Credit limit updated", detail: "New limit: ₦500,000 / month", time: "5d", read: true },
];

export const MOCK_HOTEL: HotelProfile = {
  hotelName: "Eko Hotels & Suites",
  address: "Plot 1415, Adetokunbo Ademola Street, Victoria Island, Lagos",
  starRating: 5,
  contactName: "Adaeze Okafor",
  email: "concierge@ekohotels.com",
  phone: "+234 1 277 3000",
  billingCycle: "Monthly",
  creditLimit: 500000,
  creditUsed: 482600,
  corporateRate: "JET Standard",
  rides: MOCK_RIDES,
  invoices: MOCK_INVOICES,
  team: MOCK_TEAM,
  notifications: MOCK_NOTIFICATIONS,
  kpis: {
    ridesToday: 3,                  // [COUNT(trips WHERE date=today)]
    ridesThisWeek: 18,              // [COUNT(trips WHERE date IN this_week)]
    ridesThisMonth: 47,             // [COUNT(trips WHERE date IN this_month)]
    spendToday: 36500,              // [SUM(fare WHERE date=today)]
    spendThisWeek: 186400,          // [SUM(fare WHERE date IN this_week)]
    spendThisMonth: 482600,         // [SUM(fare WHERE date IN this_month)]
    avgFare: 10268,                 // [AVG(fare) this month]
    avgRating: 4.78,                // [AVG(driver_rating) this month]
    activeGuests: 2,                // [COUNT(DISTINCT guest WHERE ride active)]
    weeklyChart: [5, 8, 4, 7, 6, 9, 3],
  },
};

export { MOCK_NOTIFICATIONS as HOTEL_NOTIFICATIONS };