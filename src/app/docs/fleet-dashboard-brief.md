# Fleet Owner Dashboard — Product Thinking Brief

## What is this surface?
The Fleet Owner Dashboard is the **B2B supply-side partner portal** — a web-first dashboard where fleet owners manage their vehicles, drivers, earnings, and relationship with JET. It's their window into how their assets perform on the platform.

---

## Entity Context (from admin-architecture)

```
FLEET OWNER (B2B Partner)
├── Owns vehicles (assets)
├── Employs/contracts drivers
├── Earns via driver commission split
├── Has corporate account with JET
├── Payout schedule (weekly/daily)
└── Commission rate negotiated with JET
```

**Key relationship:** Fleet Owner → Vehicles → Drivers → Rides → Earnings
The fleet owner doesn't drive. They manage assets and people who generate revenue.

---

## Questions Before We Build

### 1. SCOPE — What are we building first?

The IA defines 7 sections:
| Section | Priority | Reasoning |
|---------|----------|-----------|
| Fleet Overview | P0 | First thing they see — how is my fleet doing? |
| Vehicle Management | P0 | Their primary assets — registration, status, EV tracking | - all riders will be verified and inspected by JET and whatevr third party they use for vehicle inspection
| Driver Roster | P0 | Their primary people — who's driving, who's idle |
| Earnings & Payouts | P0 | The money — why they're on JET |
| Performance Metrics | P1 | Optimization layer — utilization, efficiency |
| Support | P1 | Raise issues with JET |
| Settings & Profile | P1 | Account management |

**Question for you:** Full dashboard build (all 7), or phased starting with P0 (overview + vehicles + drivers + earnings)? - we are to build the entire application e2e but we will do it surface by surface flow by flow, ensuring we don't miss anything and we build a great system

### 2. INFORMATION ARCHITECTURE — How should the nav work?

**Option A: Sidebar nav (Linear/Vercel style)**
- Left rail with icon + label
- Consistent with admin dashboard pattern
- Scales well as sections grow

**Option B: Top tab nav (Stripe Dashboard style)**
- Horizontal tabs below header
- Simpler, fewer sections to manage
- Common for partner portals

**Question:** Same nav rail pattern as admin (familiar to our codebase), or do fleet owners deserve a lighter partner portal feel? - hm since it's not a lot. i think top nav bar works

### 3. THE OVERVIEW PAGE — What does the fleet owner care about at a glance?

**Proposed KPI strip (all traceable):**

| Metric | Data Source | How Generated |
|--------|------------|---------------|
| Active Vehicles | Vehicle registry → status = "approved" + assigned driver | Count of vehicles currently in service |
| Online Drivers | Driver roster → real-time status from dispatch | Count of drivers currently online |
| Rides Today | Trips table → driver_id IN fleet_drivers AND date = today | Count of completed + in-progress rides |
| Earnings Today | Trips table → fare × fleet_owner_share WHERE driver_id IN fleet_drivers | Sum of fleet owner's commission share |
| Fleet Utilization | Active vehicles ÷ Total approved vehicles × 100 | Percentage — shows asset efficiency |
| Avg Rating | Trips table → AVG(driver_rating) WHERE driver_id IN fleet_drivers | Rolling 30-day average |

**No vanity metrics.** Every number has a source and an action:
- Low utilization → investigate idle vehicles
- Low rating → identify underperforming drivers
- Earnings trend → understand revenue trajectory

### 4. VEHICLE MANAGEMENT — What states does a vehicle live in?

```
Registered → Pending Docs → Under Review → Inspection Scheduled → Approved → Active
                                                                          ↓
                                                                    Maintenance
                                                                          ↓
                                                                    Suspended
                                                                          ↓
                                                                    Deactivated
```

**EV-specific data points:**
- Battery level (from telematics/driver app)
- Range estimate
- Last charged timestamp
- Charging station proximity

**Question:** Do fleet owners add vehicles themselves (self-serve) or does admin add them on their behalf (as in the onboarding flow)? The onboarding instructions say "They add their vehicles and drivers" — so self-serve. - yes they onboard their own drivers, however JET doe sthe verification. Also is there a better way to handle this for the fleet owner? onboarding theri drivers can we make it more seamless and less traditional? if no, then we can just go with this

### 5. DRIVER ROSTER — What does the fleet owner manage?

Fleet owners need to:
- See all their drivers and their current status (online/offline/on-trip)
- See which vehicle each driver is assigned to
- See individual driver performance (rides, rating, earnings)
- Add new drivers (who then go through JET's verification pipeline)
- Reassign vehicles between drivers
- Deactivate a driver from their fleet

**Question:** Can a fleet owner remove a driver from their fleet, or only request removal through JET admin? - hm explore edge cases, concerns for both scenarios and lets see

### 6. EARNINGS & PAYOUTS — The money flow

```
Rider pays ₦1,000 for ride
├── JET commission (20%): ₦200
└── Driver + Fleet split (80%): ₦800
    ├── Fleet owner share: defined in fleet contract
    └── Driver share: remainder
```

**What the fleet owner sees:**
- Earnings by day/week/month (chart)
- Per-driver earnings breakdown
- Per-vehicle earnings breakdown
- Payout history (with status: pending, processing, completed)
- Next payout amount + date
- Commission rate with JET

**Question:** Is the fleet owner → driver commission split managed by JET or by the fleet owner? (i.e., does JET pay drivers directly, or does JET pay the fleet owner who then pays drivers?) - hm what would be a good business model. however they said their model is jet pays both directly

### 7. DESIGN DIRECTION

**This is NOT the admin dashboard.** Different user, different mental model:
- Admin = operator/god-mode, information density, dark theme
- Fleet Owner = business partner, clarity over density, likely light mode primary

**Northstar references for partner portals:** - include resend dashboard 
- Stripe Dashboard (financial clarity, payout visibility)
- Shopify Partners (B2B partner portal, clean tables, clear actions)
- Uber Fleet (direct competitor reference — what to beat)

**Question:** Same dark theme as admin, or do we establish a distinct partner portal theme (light mode default, same typography system)? - no, dark mode still. 

### 8. EMPTY STATES & ONBOARDING

The fleet owner arrives after accepting their invitation from admin. First login flow:

```
Email invitation → Set password → First login → Dashboard (empty)
```

**Empty dashboard should guide them to:**
1. Add their first vehicle
2. Add their first driver  
3. Assign vehicle to driver
4. Vehicle goes through inspection
5. Once approved → driver can go online

This is a mini onboarding thread (similar to admin's Setup Thread pattern).

---

## Decision Matrix — What I Need From You

| # | Question | Options |
|---|----------|---------|
| 1 | Scope | Full build (7 sections) or phased (P0 first)? |
| 2 | Nav pattern | Sidebar rail or top tabs? |
| 3 | Theme | Dark (match admin) or light (partner portal)? |
| 4 | Vehicle self-serve | Fleet owners add vehicles themselves? |
| 5 | Driver removal | Self-serve or admin-mediated? |
| 6 | Payment flow | JET pays drivers directly, or through fleet owner? |
| 7 | Route structure | `/fleet-dashboard` (standalone) or `/fleet-owner/...` (nested)? | - stand alone 

---

## Next Step
Once you answer these questions, I'll write the full frame-by-frame spec (same format as the onboarding instructions.md) and build.
