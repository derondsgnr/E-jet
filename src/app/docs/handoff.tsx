 /**
 * ============================================================================
 * DEVELOPER HANDOFF DOCUMENT
 * ============================================================================
 *
 * This document is updated as we go. It captures implementation decisions,
 * patterns, and notes for the engineering team receiving the UI.
 *
 * ============================================================================
 * LAST UPDATED: 2026-03-03
 * ============================================================================
 *
 * 1. TECH STACK
 * -------------
 * - React 18 + TypeScript
 * - Tailwind CSS v4 (no tailwind.config — uses CSS-based config)
 * - shadcn/ui components (Radix primitives)
 * - React Router v7 (data mode with createBrowserRouter)
 * - Motion (formerly Framer Motion) for animations
 * - Lucide React for icons
 *
 * 2. TYPOGRAPHY
 * -------------
 * - Headlines: Montserrat (Google Fonts, variable 100-900)
 * - Body: Manrope (Google Fonts, variable 200-800)
 * - Header kerning: h1 -0.03em, h2/h3 -0.02em, h4 -0.01em
 * - Max 3 active weights per font (medium, semibold for headlines; regular, medium for body)
 * - All base typography defined in /src/styles/theme.css @layer base
 *
 * 3. COLOR SYSTEM
 * ---------------
 * - Vercel/shadcn semantic tokens (--background, --foreground, --primary, etc.)
 * - Jet brand tokens (--jet-green, --jet-green-dark, --jet-black, --jet-light)
 * - Green tint scale: --jet-green-50 through --jet-green-400
 * - Light + Dark mode supported via .dark class
 * - Supporting colors and greys will be finalized from reference exploration
 *
 * 4. COMPONENT ARCHITECTURE
 * -------------------------
 * - /src/app/components/ui/        → shadcn primitives (do not modify directly)
 * - /src/app/components/shared/    → Cross-dashboard reusable components
 * - /src/app/components/layouts/   → Layout shells per dashboard type
 * - /src/app/components/[feature]/ → Feature-specific components
 * - Components are designed for Figma auto-layout export compatibility
 *
 * 5. ROUTING STRUCTURE
 * --------------------
 * - /                  → Website / landing
 * - /rider/*           → Rider mobile app screens
 * - /driver/*          → Driver mobile app screens
 * - /fleet/*           → Fleet owner dashboard
 * - /hotel/*           → Hotel partner dashboard
 * - /admin/*           → Admin dashboard
 *
 * 6. LAYOUT PATTERNS
 * ------------------
 * - Dashboards (fleet, hotel, admin): Sidebar + topbar + content
 *   - Sidebar collapses on tablet, hidden on mobile
 *   - Bottom nav on mobile screens
 * - Mobile apps (rider, driver): Full-bleed mobile patterns
 *   - Bottom sheets, bottom nav, map-centric layouts
 * - All layouts use flex/grid — no absolute positioning unless unavoidable
 * - 4px spacing grid
 *
 * 7. MOTION SYSTEM
 * ----------------
 * - Micro (150ms): buttons, toggles, checkboxes
 * - Standard (250ms): panels, nav, cards
 * - Emphasis (400ms): page transitions, modals
 * - Spring (stiffness 400, damping 30): playful elements
 * - Motion serves comprehension, never decoration
 *
 * 8. STATE HANDLING PATTERNS
 * --------------------------
 * - Every data-driven view must handle: loading, empty, error states
 * - Skeleton loading (Linear/Vercel style) preferred over spinners
 * - Error states include retry affordance
 * - Empty states include illustration + CTA
 *
 * 9. FIGMA EXPORT NOTES
 * ---------------------
 * - Layouts use flexbox/grid → maps to Figma auto-layout
 * - Consistent gap/padding values on 4px grid
 * - Avoid nested absolute positioning
 * - Component naming follows kebab-case file names
 *
 * 10. DARK MODE
 * -------------
 * - Toggled via .dark class on root
 * - All colors defined as CSS custom properties with dark overrides
 * - Components use semantic tokens (bg-background, text-foreground, etc.)
 * - Never hardcode colors — always use token classes
 *
 * 11. BRAND ASSETS
 * ----------------
 * - Logo component: /src/app/components/brand/jet-logo.tsx
 * - Variants: "full" (SVG wordmark), "icon" (chevrons PNG), "wordmark-png" (raster)
 * - Modes: "dark" (for light bg), "light" (for dark bg), "auto" (uses currentColor)
 * - SVG paths: /src/imports/svg-9oy2kbm1fd.ts
 * - PNG assets: imported via figma:asset scheme
 *
 * 12. DESIGN LAB SYSTEM (SUNSET)
 * ---------------------
 * - Design Lab has been sunset — all screens now use a single locked spine.
 * - The A/B/C variation workflow was used during exploration and is no longer active.
 * - Locked spines:
 *     Home          → C "Bold"          (rider-home-c.tsx)
 *     Destination   → C "Command"       (destination-search-c.tsx)
 *     Booking       → B "Split"         (booking-flow-b.tsx)
 *     Approach      → A "Tracker"       (driver-approach-a.tsx)
 *     Onboarding    → C "Veil"          (onboarding-c.tsx)
 *     Scheduled     → B "Hero+Timeline" (scheduled-rides-b.tsx)
 *
 * 13. UX INTEGRITY PATTERNS
 * -------------------------
 * - Confirmations on destructive/irreversible actions (delete, cancel ride, etc.)
 * - Immediate visual feedback for every user action
 * - Affordances: interactive elements look interactive
 * - Cross-platform state sync where dashboards share context
 * - Error recovery: never dead-ends, always offer a path forward
 * - Optimistic UI where appropriate (with rollback on failure)
 *
 * ============================================================================
 * ONGOING NOTES (append as we build)
 * ============================================================================
 *
 * [2026-03-03] ALIGNMENT RULES FOR CARD INTERIORS
 * ─────────────────────────────────────────────────
 * These are recurring patterns. Follow them everywhere:
 *
 * A. ICON BOX + TWO-LINE TEXT (saved places, list items, recent places)
 *    - Use `items-center` on the row flex container
 *    - Add `self-center` on the icon box for explicit centering
 *    - Ensure padding is symmetric (py-3 not py-2.5) so the icon
 *      and text group float in equal vertical space
 *    - If icon box height ≠ text block height, bias toward centering
 *      the icon to the text group, not the card edges
 *
 * B. ROUTE VISUALIZATION (origin dot → line → destination dot)
 *    - Use `flex-col items-center` with NO fixed heights on the line
 *    - The line is `flex-1 my-1` with a `minHeight` — it GROWS to match
 *      the text block next to it, not a fixed `h-5`
 *    - Dots are 8px (w-2 h-2), not 10px — tighter, more refined
 *    - Border width on origin dot: 1.5px, not 2px
 *    - Add `paddingTop: "2px"` on the route viz column to align
 *      the top dot with the first text baseline
 *
 * C. STAT VALUE + TREND BADGE (metric cards)
 *    - Use `items-baseline` on the row
 *    - The trend text gets `position: relative; top: -1px` to
 *      optically correct the baseline alignment between 22px heading
 *      and 11px body text (different fonts have different baselines)
 *    - Both elements share `lineHeight: 1.2` to keep baselines predictable
 *
 * D. GENERAL RULES
 *    - Never mix `items-start` with centered-looking content — pick one
 *    - When icon height ≈ text block height (±4px), use items-center
 *    - When icon height < text block height (>4px diff), use items-start
 *      on the row and manually pad the icon with self-center
 *    - Always verify alignment at both font sizes (mobile + desktop)
 *    - Touch targets: icons in interactive rows get min 44px hit area
 *
 * [2026-03-03] LIGHT MODE MAP STRATEGY
 * ─────────────────────────────────────
 * When integrating a real map SDK (Google Maps / Mapbox):
 * - Use the SDK's native dark/light map styles per color mode
 * - Google Maps: map styles array or Cloud Map IDs
 * - Mapbox: mapbox://styles/mapbox/dark-v11 vs light-v11
 * - Apple MapKit: colorScheme property
 * - This eliminates the need for gradient veils in light mode entirely
 * - Until then, our simulated map uses a single clean gradient fade
 *   from dark map to solid #FAFAFA (no translucent white veils)
 *
 * [2026-03-03] LOCKED DESIGN SPINES — RIDER APP
 * ──────────────────────────────────────────────
 * The following screen variations are locked as the design spine:
 *
 * | Screen              | Locked Variation      | File                          |
 * |---------------------|-----------------------|-------------------------------|
 * | Home                | C "Bold"              | rider-home-c.tsx              |
 * | Destination Search  | C "Command"           | destination-search-c.tsx      |
 * | Booking Flow        | B "Split"             | booking-flow-b.tsx            |
 * | Driver Approach     | A "Tracker"           | driver-approach-a.tsx         |
 *
 * Unlocked variation files (B/C approach, etc.) have been deleted.
 * Lab toggles remain on Home and Destination for reference browsing.
 *
 * [2026-03-03] RIDER JOURNEY FLOW (WIRED)
 * ────────────────────────────────────────
 * The main rider flow in RiderShell is:
 *   Home → Destination Search (C) → Booking (B) → Approach (A) → Complete
 *
 * - Search bar tap on Home → opens DestinationSearchC
 * - Quick destination tap → skips search, goes straight to BookingFlowB
 * - Place select in search → advances to BookingFlowB
 * - Booking "Book" CTA → matching → driver assigned → DriverApproachA
 * - OTP verified + "Start ride" → in-progress → complete → back to tabs
 *
 */

export {};