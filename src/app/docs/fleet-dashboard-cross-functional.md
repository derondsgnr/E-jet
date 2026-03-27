# Fleet Owner Dashboard — Full Cross-Functional Review (Product OS)

## Your Answers (Locked)

| # | Decision | Your Call |
|---|----------|-----------|
| 1 | Scope | Full E2E, surface by surface, flow by flow |
| 2 | Nav | Top nav bar (not sidebar rail) |
| 3 | Theme | Dark mode (consistent with admin) |
| 4 | Vehicle/Driver onboarding | Fleet owner adds, JET verifies + inspects |
| 5 | Driver removal | Open — exploring edge cases below |
| 6 | Payment flow | JET pays both fleet owner AND driver directly |
| 7 | Route structure | Standalone (`/fleet-dashboard`) |
| 8 | Design refs | Stripe, Shopify Partners, Resend, Uber Fleet (to beat) |

---

## Cross-Functional Checklist (Product OS)

### ✅ DESIGN — Does this improve user experience?

**One job per screen?**
- Overview → "How is my fleet doing right now?"
- Vehicles → "What's the status of my assets?"
- Drivers → "Who's working, who's idle, who's performing?"
- Earnings → "How much am I making and when do I get paid?"
- Each screen has a single primary job. ✓

**30-second completion?**
- Overview: Scan KPIs + spot anomalies in <10s. ✓
- Add vehicle: Name, plate, type, docs — ~2min (acceptable for onboarding action)
- Earnings: Glanceable chart + next payout card — <10s for the core question. ✓

**Empty/error/loading states?**
- Every section needs: skeleton loading (Linear style), empty state with CTA, error with retry
- First-login empty dashboard needs Setup Thread (mini onboarding guide)
- Must design: "No vehicles yet", "No drivers yet", "No earnings yet", "No payouts yet"

**Accessibility?**
- Dark mode needs WCAG AA contrast ratios on all text
- Touch targets 44px min (even though web-first, fleet owners may use tablets at depots)
- All interactive elements keyboard-navigable

---

### ✅ PM — Does this move business metrics?

**North Star tie-in:**
JET's north star = ride completion rate. Fleet owners directly impact supply side:
- More vehicles approved → more driver supply → fewer rider cancellations → higher completion rate
- Fleet owner dashboard quality → partner retention → stable supply

**Success criteria:**
| Metric | Target | Source |
|--------|--------|--------|
| Fleet owner activation rate | 80% add first vehicle within 7 days | Onboarding funnel events |
| Vehicle approval time | <72h from registration to approved | Vehicle status timestamps |
| Fleet owner retention (30d) | 90%+ monthly active | Login events |
| Payout satisfaction | <2% support tickets about payouts | Support ticket categorization |

**RICE for building this surface:**
- Reach: Every fleet partner (starts small, scales with partnerships)
- Impact: High — fleet owners who can't see earnings or manage vehicles will churn to competitors
- Confidence: High — direct competitor feature parity (Uber Fleet, Bolt Fleet)
- Effort: Medium — 7 sections, reusable component patterns

---

### ✅ ENGINEERING — Is this technically sound?

**Architecture:**
- Standalone route `/fleet-dashboard` with its own shell component
- Top nav bar → simpler than admin's sidebar, fewer route children
- Shares admin theme system (dark mode, same tokens) but distinct shell
- Reuse existing component patterns: tables, cards, modals, drawers

**Data model awareness (for mock data):**
```
FleetOwner
├── id, name, businessName, email, phone
├── bankAccount (masked), commissionRate, payoutSchedule
├── status: invited | active | suspended
│
├── vehicles[] 
│   ├── id, make, model, year, plate, type (EV|Gas)
│   ├── status: registered | pending_docs | under_review | inspection_scheduled | approved | maintenance | suspended | deactivated
│   ├── assignedDriverId (nullable)
│   └── evData?: { batteryLevel, range, lastCharged }
│
├── drivers[]
│   ├── id, name, phone, photo
│   ├── status: pending_verification | verified | active | offline | on_trip | suspended
│   ├── assignedVehicleId (nullable)
│   ├── rating, totalRides, earningsThisWeek
│   └── verificationStatus: docs_submitted | under_review | approved | rejected
│
└── earnings
    ├── today, thisWeek, thisMonth, allTime
    ├── payouts[] { id, amount, date, status, bankAccount }
    └── nextPayout { amount, date }
```

**Performance budget:**
- Initial load: <2s (skeleton → data)
- Route transitions: <300ms
- Charts: lazy loaded, not blocking first paint

---

### ✅ SECURITY — Is this secure?

**Auth/Authz:**
- Fleet owner sees ONLY their own vehicles, drivers, earnings
- No cross-tenant data leakage (fleet owner A cannot see fleet owner B's data)
- Bank account details always masked (show last 4 digits only)
- Session management: auto-logout after inactivity

**Threat model:**
| Threat | Mitigation |
|--------|-----------|
| Fleet owner spoofs driver identity | Driver verification is JET-controlled, not fleet owner |
| Fleet owner inflates vehicle count | Each vehicle goes through JET inspection |
| Unauthorized payout changes | Bank account changes require email confirmation + admin approval |
| Data scraping (driver info) | Rate limiting, minimal PII exposed |

**NDPR compliance:**
- Driver phone numbers partially masked on fleet owner dashboard
- Driver earnings visible to fleet owner only in aggregate (they see their commission, not the driver's full take)

---

### ✅ MOTION — Does interaction feel right?

**Entrance pattern:**
- Page load: Skeleton → content fade-in (200ms ease-out)
- KPI cards: Stagger in 40ms apart (matches admin spine)
- Tab transitions: Cross-fade 200ms

**State transitions:**
- Vehicle status change: Smooth color transition on status badge
- Payout received: Subtle green pulse on earnings card
- Driver goes online/offline: Real-time status dot animation

**Reduced motion:** All animations respect `prefers-reduced-motion`

---

### ✅ BRAND — Is this on-brand?

**Core claim alignment:**
- JET = "Africa's most intelligent mobility platform"
- Fleet dashboard must feel intelligent: real-time data, proactive insights, not just tables
- Premium partner experience → fleet owners feel valued, not like they're using a back-office tool

**Sensory grammar:**
- Dark mode with green accents (scalpel, not paint)
- Montserrat 600 headings, Manrope 500 body
- Same typography hierarchy as admin
- No one-sided borders — use subtle full-border cards with micro-shadow

**Lexicon:**
- "Fleet" not "Company"
- "Drivers" not "Employees" (may be contracted)
- "Vehicles" not "Cars" (includes different types)
- "Earnings" not "Revenue" (fleet owner perspective)
- "Payouts" not "Payments" (money flowing TO them)

---

### ✅ MARKETING — Can we tell this story?

**Value proposition for fleet owners:**
"See everything. Control everything. Get paid on time."

**Key selling points (for fleet owner acquisition):**
- Real-time fleet visibility
- Transparent earnings with traceable data sources
- Seamless driver onboarding (JET handles verification)
- EV fleet support (battery monitoring, range tracking)

**Competitive positioning vs Uber Fleet / Bolt Fleet:**
- JET: EV-first tracking, Nigerian bank integration, transparent commission
- Premium feel (northstar design) vs utilitarian competitor dashboards

---

### ✅ FINANCE — Does the math work?

**Money flow (confirmed: JET pays both directly):**
```
Ride fare: ₦1,000
├── JET takes 20%: ₦200 (platform commission)
├── Fleet owner gets X%: negotiated per contract
└── Driver gets remainder
    
JET pays fleet owner on schedule (weekly/daily)
JET pays driver separately (instant/scheduled)
```

**Why JET pays both directly:**
- Reduces fleet owner's payroll burden
- JET maintains direct relationship with drivers
- Prevents fleet owners from withholding driver pay
- Simpler tax/compliance (JET as payment processor)

**Fleet owner's dashboard shows:**
- Their commission amount (not the full fare)
- Per-driver contribution to their earnings
- Payout history and upcoming payouts
- Commission rate (negotiated with JET admin)

---

## Open Questions — Deep Dives

### 🔍 Driver Removal: Self-serve vs Admin-mediated

**Scenario A: Fleet owner can remove drivers directly**

| Pro | Con |
|-----|-----|
| Fast — no waiting for admin | Fleet owner could remove driver mid-ride (edge case) |
| Fleet owner feels in control | Driver loses income immediately with no recourse |
| Reduces admin workload | Potential for abuse (punitive removal) |
| Standard in competitor platforms | No cooling-off period for disputes |

Edge cases:
- Driver is mid-ride → removal queued until ride completes
- Driver has pending payout → payout still processes
- Driver disputes removal → needs escalation path to JET admin

**Scenario B: Fleet owner requests removal, JET admin approves**

| Pro | Con |
|-----|-----|
| Protects driver from snap decisions | Slow — fleet owner waits for admin response |
| JET maintains control over supply | Creates admin backlog |
| Audit trail for every removal | Fleet owner feels powerless |
| Compliance-friendly | Doesn't scale with fleet growth |

Edge cases:
- Admin takes too long → fleet owner frustrated
- Multiple pending removals → queue management needed
- Urgent safety concern → needs fast-track path

**Recommendation: Hybrid approach**
- Fleet owner can **suspend** a driver from their fleet immediately (driver can't go online under that fleet)
- Fleet owner **requests removal** which JET processes within 24h
- Emergency removal (safety) → instant with mandatory reason + auto-escalation to admin
- Driver receives notification and has 48h to appeal to JET before removal is finalized

This gives fleet owners operational control while protecting drivers from abuse. - okay

---

### 🔍 Driver Onboarding: Can we make it less traditional?

**Traditional flow (what competitors do):**
```
Fleet owner fills form → enters driver details → driver gets SMS → driver downloads app → driver uploads docs → JET reviews → approved
```
Problems: Multi-step, fleet owner does data entry, high drop-off, errors in manual entry.

**Proposed JET flow: Invite Link + Self-Serve**
```
Fleet owner generates invite link/code → shares with driver → driver downloads JET app → 
enters fleet code during signup → auto-linked to fleet → driver completes their own 
verification → JET reviews → approved → vehicle assignment
```

**Why this is better:** - concern though, will the link be sent to their email? or how do they give the driver the link and code?
- Fleet owner's only action: generate link, share it
- Driver enters their own data (fewer errors, they own their profile)
- Verification is between driver and JET (fleet owner doesn't handle sensitive docs)
- Fleet owner sees real-time pipeline: "3 drivers invited, 2 docs submitted, 1 approved"
- Scales: fleet owner can send one link to 50 drivers

**What the fleet owner dashboard shows:**
```
DRIVER PIPELINE
──────────────────────────────────────
Invite link: jet.ng/join/metro-express     [Copy] [QR Code]

4 Invited → 3 Registered → 2 Docs Submitted → 1 Approved

Driver cards below showing each driver's stage
```

This mirrors the admin's driver verification Kanban but simplified — fleet owner sees status, JET handles the actual verification. Fleet owner's job is to recruit and monitor, not to verify.

**Bonus: Bulk invite**
- Fleet owner uploads CSV with driver names + phone numbers
- System sends SMS invites to all
- Dashboard shows bulk invite status

---

## Remaining Question for You

| # | Question |
|---|----------|
| 1 | Driver removal: Do you like the hybrid approach (suspend immediately, remove via 24h request)? |
| 2 | Driver onboarding: Invite link + self-serve flow — does this feel right? |
| 3 | Route structure: `/fleet-dashboard` as prefix, with child routes like `/fleet-dashboard/vehicles`, `/fleet-dashboard/drivers`, etc.? | yes please 
| 4 | Ready to write the frame-by-frame spec and start building? | Uhh let's reduce documentation; remember our approach is 3 variations per essential surfaces then we pick a direction and move
