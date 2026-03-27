# JET — E-Hailing Platform Guidelines

## Brand
- **Name:** JET
- **Industry:** Transportation / E-hailing (Nigeria)
- **Positioning:** Premium, reliable e-hailing service
- **Personality:** Confident, Efficient, Trustworthy, Premium
- **Fleet:** EVs + gas-based vehicles

## Design North Stars
Apple, Linear, Luma, Airbnb, Framer, Vercel, Figma

**What this means in practice:**
- Vercel/Linear: tight typography, monochrome confidence, information density done right
- Apple: spatial clarity, purposeful motion, hardware-level polish
- Airbnb: trust through transparency, progressive disclosure
- Framer/Luma: fluid motion that serves comprehension
- Figma: composable components, collaborative architecture

## Typography
- **Headlines:** Montserrat (medium/semibold, max 3 weights)
- **Body:** Manrope (regular/medium)
- **System:** Vercel/Linear hybrid — tight headline tracking, density-friendly body
- **Header kerning:** -0.02em to -0.03em (letter-spacing)
- **Body kerning:** -0.02em (letter-spacing)
- **Line heights:** Paragraphs 1.5 · UI text (labels, buttons, inputs) 1.4 · Headlines 1.2–1.4
- **Scale:** Disciplined — no more than 3 weights per font in active use

## Brand Colors
- Primary Green: `#1DB954` (+ tints at 50% or less)
- Dark Green: `#046538`
- Black: `#0B0B0D`
- Light Gray: `#F5F5F5`
- Supporting colors, greys will be explored via references then systemized

## Modes
- Light mode (primary)
- Dark mode (supported)

## User Types & Dashboards
1. **Rider** — Mobile app (mobile-first)
2. **Driver** — Mobile app (mobile-first)
3. **Fleet Owner** — Web dashboard
4. **Hotel** — Web dashboard
5. **Admin** — Web dashboard
6. **Landing page / Website** — Public-facing

## Layout & Responsiveness
- Auto-layout friendly (clean Figma export with proper auto-layout mapping)
- Use flexbox/grid — avoid absolute positioning unless necessary
- Linear-style fluid scaling across all breakpoints (320px → 2560px)
- Touch targets: min 44px on mobile (Apple HIG)
- 4px spacing grid

## Component Philosophy
- Build reusable, composable components — wire and modify per context
- Every component handles: loading, empty, error states gracefully
- Motion is intentional and serves comprehension (never decorative)
- Consistent feedback, affordances, edge case handling

## Design Lab Process
- **Critical pages get 3 variations** — inspired by references + similar products matching our baseline quality
- **Prototype, don't describe** — all variations are built and rendered, never just explained verbally
- A **Design Lab toggle** is built into the UI for switching between A/B/C variations in real-time
- Evaluate design problems against northstar products: how would Apple/Linear/Airbnb handle this?
- Motion language will be defined from references as they are provided

## Affordances & UX Integrity
- Always account for affordances in every interaction
- Sync state and patterns across all platforms where they share context
- Account for confirmations on destructive/irreversible actions
- Provide clear, immediate feedback for every user action
- Handle errors with grace — never dead-ends, always recovery paths
- Empty states are designed, not afterthoughts
- Loading states use skeletons (Linear/Vercel style), not spinners

## Code & Handoff
- UI built for clean Figma re-export (auto-layout structures, no absolute hacks)
- Developer handoff document updated as we go (`/src/app/docs/handoff.tsx`)
- Keep files small — helpers and sub-components in their own files
- Refactor as you go to maintain cleanliness

## Rules
- Do not bloat — every element earns its place
- Colors will evolve via references before being systemized
- Explore first, then lock the system
- Prototype variations, don't describe them
- Every design decision benchmarked against northstar products

## Design Spine Rule (LOCKED)
**Variation C "Bold" is the locked design spine for the Rider app.** Every new screen exploration — regardless of layout variation (A, B, or C) — MUST carry the C spine's visual DNA. Variations explore *layout and information architecture*, NOT surface materials or atmospheric treatment.

### What MUST be consistent across every Rider screen:
- **GlassPanel** as the card/surface material (dark: translucent glass + blur + border glow · light: opaque white + micro-shadow + crisp border)
- **MapCanvas** or equivalent atmospheric background — never a flat solid fill. Even utility screens (search, settings) maintain atmospheric depth.
- **Green ambient glows** — bottom-center and top-right radial gradients at low opacity
- **Noise texture overlay** at 3% mix-blend
- **Gradient depth system** — gradients that create layered depth, not flat surfaces
- **Typography hierarchy** — Montserrat 600 at -0.03em for headings, Manrope 500 at -0.02em for body
- **Green as scalpel** — only CTAs, active states, status indicators, EV badges
- **Motion stagger pattern** — entrance animations with 40ms stagger via MOTION config

### What CAN vary between explorations:
- Layout structure (full-screen vs. sheet vs. split)
- Information density and progressive disclosure strategy
- Content hierarchy and section ordering
- Interaction patterns (tabs vs. scroll vs. filters)
- Where the map appears (full-bleed, peek, strip) — but it must appear

### In short:
> The materials stay. The architecture explores.