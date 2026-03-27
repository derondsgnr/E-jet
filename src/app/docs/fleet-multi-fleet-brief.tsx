/**
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  MULTI-FLEET + VEHICLE OWNERSHIP — Systems Design Brief            │
 * │  Date: 14 Mar 2026 (updated)                                       │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * ══════════════════════════════════════════════════════════════════════
 * 1. VEHICLE OWNERSHIP — WHO REGISTERS? WHO OWNS?
 * ══════════════════════════════════════════════════════════════════════
 *
 * QUESTION: Should vehicles be registered by the fleet owner or the
 * driver? Who "owns" the entity? Can drivers move between vehicles?
 *
 * ANSWER: Vehicle is a FLEET-level entity. Always.
 *
 *   ┌─────────────────────────────────────────────────────────────────┐
 *   │  FLEET (Metro Lagos)                                           │
 *   │                                                                 │
 *   │  VEHICLES (fleet-owned)         DRIVERS (fleet-assigned)       │
 *   │  ┌──────────────────┐           ┌──────────────────┐          │
 *   │  │ Toyota Camry     │──assigned──│ Emeka A.         │          │
 *   │  │ LND-284EP        │           │ Online           │          │
 *   │  └──────────────────┘           └──────────────────┘          │
 *   │  ┌──────────────────┐           ┌──────────────────┐          │
 *   │  │ Kia EV6          │──assigned──│ Tunde O.         │          │
 *   │  │ ABJ-991FX        │           │ On trip          │          │
 *   │  └──────────────────┘           └──────────────────┘          │
 *   │  ┌──────────────────┐                                          │
 *   │  │ Honda Accord     │── unassigned (no driver)                │
 *   │  │ LND-502GH        │                                          │
 *   │  └──────────────────┘                                          │
 *   └─────────────────────────────────────────────────────────────────┘
 *
 * WHY FLEET-OWNED (not driver-owned):
 *
 *   1. In Nigeria's fleet model, the fleet owner typically BUYS or
 *      LEASES the vehicles. The driver operates, not owns.
 *
 *   2. When a driver leaves, the vehicle stays with the fleet.
 *      If vehicle was driver-owned, you'd orphan the entity.
 *
 *   3. Fleet owner needs to manage vehicle lifecycle independently:
 *      insurance, inspection, maintenance, depreciation.
 *
 *   4. A vehicle can exist WITHOUT a driver (new purchase, between
 *      assignments, under maintenance). A driver-owned model breaks here.
 *
 *   5. Fleet owner can REASSIGN drivers between vehicles at any time.
 *      Driver A leaves → assign Driver B to same vehicle. Clean.
 *
 * ══════════════════════════════════════════════════════════════════════
 * BUT WHAT ABOUT OWNER-OPERATORS?
 * ══════════════════════════════════════════════════════════════════════
 *
 * Some drivers own their vehicle and operate independently, then
 * decide to join a fleet for better ride volume. In this case:
 *
 *   • Driver registers vehicle during THEIR onboarding as personal
 *   • Driver joins a fleet → vehicle gets LINKED to that fleet
 *   • Fleet owner can see it but doesn't "own" it
 *   • If driver leaves fleet, vehicle goes with them
 *
 * This is a DIFFERENT relationship: vehicle.ownership = "driver"
 * vs vehicle.ownership = "fleet". The system supports both.
 *
 *   ┌──────────────────────────────────────────────────┐
 *   │  vehicle.ownership_type                          │
 *   │                                                  │
 *   │  "fleet"  → fleet owner registered it            │
 *   │           → stays with fleet if driver leaves     │
 *   │           → fleet owner manages lifecycle        │
 *   │                                                  │
 *   │  "driver" → driver registered it                 │
 *   │           → linked to fleet but driver retains   │
 *   │           → leaves with driver if they exit      │
 *   │           → driver manages lifecycle             │
 *   └──────────────────────────────────────────────────┘
 *
 * ══════════════════════════════════════════════════════════════════════
 * DRIVER ↔ VEHICLE ASSIGNMENT RULES
 * ══════════════════════════════════════════════════════════════════════
 *
 *   • One driver → one vehicle at a time (1:1 active assignment)
 *   • Fleet owner can reassign at any time (when driver is offline)
 *   • Assignment history is tracked (audit trail)
 *   • Vehicle can be unassigned (parked, maintenance, new)
 *   • Driver can be unassigned (between vehicles, onboarding)
 *
 * ══════════════════════════════════════════════════════════════════════
 * WHAT THIS MEANS FOR ONBOARDING
 * ══════════════════════════════════════════════════════════════════════
 *
 * FLEET OWNER ONBOARDING:
 *   1. Welcome
 *   2. Business Profile (name, email, location)
 *   3. Bank Account
 *   4. Add First Vehicle ← BACK IN. Fleet owner registers their vehicles.
 *   5. Invite First Driver (via email)
 *   6. Done
 *
 *   Vehicle step returns because in the primary fleet model, fleet
 *   owners provide the vehicles. The step is OPTIONAL — skip if
 *   your drivers bring their own vehicles.
 *
 * DRIVER ONBOARDING (when joining a fleet):
 *   • If fleet has unassigned vehicles → driver picks from list
 *   • If driver brings own vehicle → registers it, links to fleet
 *   • If fleet assigns later → driver skips vehicle step
 *
 * ══════════════════════════════════════════════════════════════════════
 * 2. MULTI-FLEET (unchanged from before)
 * ══════════════════════════════════════════════════════════════════════
 *
 * Each fleet = workspace. One account, multiple fleets.
 * Fleet switcher in top bar. "Add new fleet" option.
 *
 * Each fleet has own: vehicles, drivers, bank, earnings, zone.
 * Driver/vehicle can't be in two fleets simultaneously.
 * Owner CAN view aggregate across all fleets.
 */

export {};
