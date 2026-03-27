# JET Admin — Onboarding E2E Flow Map

Complete onboarding system as specified in `/src/app/docs/instructions.md`.

## Routes & Navigation

### 1. Welcome → Zone Setup
**Route:** `/onboarding-welcome`  
**Next:** `/onboarding-zones`  
- Full screen welcome
- Single CTA: "Set up service zones →"
- No nav rail, clean centered layout

### 2. Zone Configuration
**Route:** `/onboarding-zones`  
**Next:** `/dashboard-empty` (State A)  
- Two-column layout: Map (left) + Zone list (right)
- Pre-suggested zone chips
- Continue button disabled until ≥1 zone added

### 3. Dashboard Empty — State A
**Route:** `/dashboard-empty?state=A`  
**Setup Thread:** Pricing active (Go →)  
- Empty KPIs, static map, no decisions
- Right panel: Setup Thread with 5 steps
- **Next actions:**
  - Pricing [Go →] → `/settings-pricing`
  - Drivers [Review →] → `/drivers-verification` (disabled until pricing done)
  - Hotels [Add →] → `/hotels-empty`
  - Fleet [Add →] → `/fleet-empty`

### 4. Settings — Pricing
**Route:** `/settings-pricing`  
**Return:** `/dashboard-empty?state=B` (after save)  
- Zone-based pricing configuration
- Inline validation
- Reset to defaults modal (destructive)

### 5. Dashboard Empty — State B
**Route:** `/dashboard-empty?state=B`  
**Setup Thread:** Drivers active (Review →)  
- Pricing ✓ complete
- Drivers now actionable
- **Next:** `/drivers-verification`

### 6. Drivers — Verification
**Route:** `/drivers-verification`  
**Return:** `/dashboard-empty?state=C` (after first approval)  
- Kanban with empty state
- Driver detail drawer
- Approve/reject modals
- Document verification workflow

### 7. Dashboard Empty — State C
**Route:** `/dashboard-empty?state=C`  
**Setup Thread:** Core complete, optionals remain  
- Zones ✓, Pricing ✓, Drivers ✓
- Hotels and Fleet still available as optional
- Platform ready for rides

### 8. Hotels — Empty State
**Route:** `/hotels-empty`  
**Next:** `/hotels-new`  
- Centered empty state with explainer
- CTA: "Add hotel partner →"

### 9. Hotels — New Partner
**Route:** `/hotels-new`  
**Next:** `/hotels-profile?new=true`  
- Three-section form (Hotel Details, Contact, Commercial Terms)
- Inline validation
- Confirmation modal before creation

### 10. Hotels — Profile
**Route:** `/hotels-profile`  
- Two status states: Invited / Active
- Account details, contact info, commercial terms
- Empty states for rides and billing
- Resend invitation modal

### 11. Fleet — Empty State
**Route:** `/fleet-empty`  
**Next:** `/fleet-new`  
- Identical structure to hotels empty
- CTA: "Add fleet owner →"

### 12. Fleet — New Owner
**Route:** `/fleet-new`  
**Next:** `/fleet-profile?new=true`  
- Three sections: Owner Details, Payout Details, Commercial Terms
- Commission split validation (must = 100%)
- Bank account required

### 13. Fleet — Profile
**Route:** `/fleet-profile`  
- Two status states: Invited / Active
- Vehicle list (empty state + populated state with 3 vehicles)
- Drivers and Earnings sections (empty)

## Component Patterns Used

### Modals (AdminModal)
- **Confirmation:** Create partner, Approve driver
- **Destructive:** Reject driver, Reset pricing
- Center-screen, high-friction

### Drawers (AdminDrawer)
- **Driver detail:** Document review, inspection status, decision
- Side panel, low-friction, contextual

### Empty States
- Hotels/Fleet: Centered with icon, explainer, CTA, "How it works"
- Drivers Kanban: Centered with signup link
- Dashboard sections: Inline muted text

### Forms
- Inline validation with error messages
- Required field indicators (*)
- Disabled states with tooltips
- Auto-save vs. explicit save patterns

### Setup Thread (Dashboard Empty)
- Persistent right panel (not a drawer)
- Progress indicator: "2 of 5 complete"
- Three states based on completion
- Mix of [Go →], [Review →], [Add →] CTAs

## State Management

All state is URL-based:
- `/dashboard-empty?state=A|B|C` — Setup progression
- `/hotels-profile?new=true` — Show success banner
- `/fleet-profile?new=true` — Show success banner

No global state required. Each frame is self-contained with local React state for UI interactions (modals, forms, etc.).

## Design System Adherence

✅ Dark theme (primary)  
✅ Montserrat headlines (-0.03em tracking)  
✅ Manrope body (-0.02em tracking)  
✅ Green as scalpel (CTAs, active states, EV badges)  
✅ Glass surfaces (Admin theme tokens)  
✅ Motion stagger (40ms delays)  
✅ No spinners (skeletons or inline states)  
✅ Min 44px touch targets  
✅ Responsive (mobile-friendly where applicable)

## Edge Cases Handled

### Zones
- Can't continue without ≥1 zone
- >10 zones warning
- Remove all zones → button disables

### Pricing
- Min fare < base fare → inline error
- Per km = ₦0 → amber warning
- Unsaved changes → discard modal

### Drivers
- Approve disabled until docs + inspection complete
- Empty state with signup link
- Request missing document

### Hotels/Fleet
- Required field validation
- Email already exists check
- Unsaved changes modal
- Commission split validation (fleet only)

## Source of Truth

This implementation follows `/src/app/docs/instructions.md` exactly as specified. If approved, this becomes the canonical onboarding flow for JET Admin.

---

**Entry point:** `/onboarding-welcome`  
**Test flow:** Welcome → Zones → Dashboard (A) → Pricing → Dashboard (B) → Drivers → Dashboard (C) → Hotels/Fleet (optional)
