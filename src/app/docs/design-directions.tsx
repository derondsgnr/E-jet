 /**
 * ============================================================================
 * JET — DESIGN DIRECTIONS JOURNAL
 * ============================================================================
 *
 * Living document that captures each design variation explored,
 * its visual DNA, rationale, and evaluation against northstars.
 *
 * Updated as we build — always come back here to compare directions.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// RIDER HOME SCREEN — 3 Variations
// ---------------------------------------------------------------------------
// Surface: Rider mobile app
// Screen: Home / Booking
// Date explored: March 2026
// Route: /rider
// ---------------------------------------------------------------------------

export const RIDER_HOME_DIRECTIONS = {
  screen: "Rider Home",
  surface: "Rider App (mobile-first)",
  context:
    "The hero screen of the entire product — what riders see every time they open Jet. Map-centric, booking-first, must convey premium + trust instantly.",

  sharedDNA: {
    mapTreatment: "Full-bleed aerial map as background — map is first-class citizen, not decorative",
    glassmorphism:
      "Core surface material for all overlays: header, bottom sheet, floating badges, cards. Three recipes: map-dark (dark bg), map-light (light bg), dark/light (general surfaces).",
    greenUsage:
      "Green as scalpel — ONLY on CTAs, active/selected states, status indicators, EV badges. Never as background fill or decorative element.",
    atmospherics:
      "Radial green glows at 4-8% opacity (bottom-center, top-right). Noise texture at 3% mix-blend. Gradient overlays for depth layering.",
    typography: {
      headlines: "Montserrat, medium/semibold weight, -0.03em tracking",
      body: "Manrope, regular/medium weight, -0.02em tracking",
      uiText: "1.4 line-height for density",
      paragraphs: "1.5 line-height for readability",
    },
    motion:
      "Staggered entrance on mount (40ms stagger). Emphasis timing (350ms) for main panels. Standard timing (220ms) for content items. Location pulse animation (2s infinite).",
    colorModes:
      "Dark and light are NOT inversions of each other — they are two equally considered designs. Dark: glass surfaces float in darkness, blur creates depth. Light: the spatial composition changes — map peeks at the top, one clean gradient fades to solid #FAFAFA, and content sits on opaque white surfaces with micro-shadows (Linear/Vercel approach). Glass translucency only works on dark; light mode uses elevation instead.",
  },

  variations: {
    A: {
      name: "Clean",
      philosophy: "Classic ride-hailing structure. Spatial clarity above all. Nothing competes for attention.",
      strengths: [
        "Immediately familiar — users know what to do",
        "Maximum map visibility (smallest bottom sheet)",
        "Quick action pills give clear mode separation (ride now / schedule / reserve)",
        "Saved places as compact paired cards — efficient use of space",
        "Floating EV badge adds character without noise",
      ],
      weaknesses: [
        "Could feel generic — similar to Uber/Bolt",
        "Less brand personality in the UI itself",
        "Greeting is subtle, may feel impersonal",
      ],
      northstarAlignment: {
        apple: "Spatial clarity, purposeful emptiness",
        linear: "Density-friendly without clutter",
        uber: "Familiar booking paradigm (but elevated)",
      },
      verdict: "Safe, polished, highly usable. The 'get it right' choice.",
      lightModeNotes:
        "Translates cleanly — white glass sheet feels Apple Maps-like. Green accents pop more on light backgrounds. Map needs stronger white gradient overlay for content readability.",
    },

    B: {
      name: "Immersive",
      philosophy: "Warm, personal, destination-first. The app greets you and asks where you're going — feels like a conversation.",
      strengths: [
        "Hero-sized 'Where are you headed?' creates emotional connection",
        "Search is impossible to miss — very prominent with green icon",
        "Ride type cards as horizontal scroll — discovery-friendly",
        "Ride types show ETAs inline — reduces decision friction",
        "Most personal-feeling variation",
      ],
      weaknesses: [
        "Larger bottom sheet covers more map",
        "Ride type cards may add cognitive load for quick bookings",
        "Section label styling could feel heavy-handed",
      ],
      northstarAlignment: {
        luma: "Warm, inviting, event-booking energy",
        airbnb: "Progressive disclosure, trust through transparency",
        apple: "Hero text as spatial anchor",
      },
      verdict: "Most differentiated. Strong brand vehicle. Best for 'premium' positioning.",
      lightModeNotes:
        "Warm tone translates well to light — feels like a morning greeting. Green search icon container becomes the primary focal point. Ride type cards need slightly more border contrast in light mode.",
    },

    C: {
      name: "Bold",
      philosophy: "Dashboard energy on a mobile screen. Information-dense, data-forward, shows the user they're in control.",
      strengths: [
        "34px greeting is unmistakably premium — largest type hierarchy",
        "Mini stat cards (rides/carbon) add depth and engagement hooks",
        "Recent rides with route visualization (dots + line) — unique differentiator",
        "Fares shown inline — transparency builds trust (Airbnb principle)",
        "EV badges on rides reinforce sustainability story",
        "Most content per pixel — rewards power users",
      ],
      weaknesses: [
        "Content-heavy — may overwhelm new users",
        "Map is most obscured (68% content area)",
        "Takes longer to reach the booking action",
        "Scrollable content area may feel less native on mobile",
      ],
      northstarAlignment: {
        linear: "Information density done right, dashboard energy",
        vercel: "Metric cards, monochrome confidence",
        airbnb: "Fare transparency, trust signals",
      },
      verdict: "Most unique, most opinionated. The 'power user' choice. Could work as a hybrid — show stats on repeat visits only.",
      lightModeNotes:
        "Translates surprisingly well — the glass cards with subtle shadows feel very Apple/Linear. Route visualization dots need slightly more contrast in light mode. Green CTA arrow button is the strongest focal point across all 3 variations in light mode.",
    },
  },

  // ---------------------------------------------------------------------------
  // OPEN QUESTIONS
  // ---------------------------------------------------------------------------
  openQuestions: [
    "Which variation best serves first-time riders vs. power users?",
    "Should we A/B test variation A (safe) vs B (differentiated) in production?",
    "Can we create a hybrid: A's simplicity with C's stat cards shown conditionally?",
    "Does the 'Where are you headed?' greeting (B) resonate more than 'Where to?' (A)?",
    "Should light mode be the default for daytime use, with auto-switching?",
    "How do these translate to the Driver app home screen?",
  ],

  // ---------------------------------------------------------------------------
  // COLOR MODE EVALUATION
  // ---------------------------------------------------------------------------
  colorModeAnalysis: {
    dark: {
      strengths: [
        "More dramatic, premium feel",
        "Map reads better — feels like a real navigation screen",
        "Glass surfaces have more depth and sophistication",
        "Green accents glow beautifully against dark",
        "Battery-friendly for OLED screens (Nigeria market consideration)",
      ],
      bestFor: "Evening/night use, premium positioning, EV/sustainability narrative",
    },
    light: {
      strategy:
        "Completely different spatial composition. Map stays dark but is a PEEK at the top of the screen. One clean gradient fades to solid #FAFAFA by ~50% screen height. Content sits on the solid background. Bottom sheets are opaque white with soft top shadows (Apple Maps approach). Cards are solid white with micro-shadows and crisp borders (Linear/Vercel). Glass translucency is abandoned in light mode — it creates muddy contrast over a dark map. This isn't laziness; it's what the best studios do.",
      surfaceTreatment: {
        header: "rgba(255,255,255,0.95) + blur — nearly opaque frosted panel on the map peek zone",
        bottomSheet: "Solid #FFFFFF with shadow: 0 -1px 20px rgba(0,0,0,0.06) — fully opaque, lifted",
        contentCards: "rgba(255,255,255,0.97) with 1px border at rgba(0,0,0,0.06) + micro-shadow: 0 1px 3px rgba(0,0,0,0.04)",
        mapPeekElements: "Nearly opaque frosted white — EV badge, floating controls",
      },
      textHierarchy: {
        primary: "#0B0B0D — solid dark for headings, impeccable contrast on white",
        secondary: "rgba(11,11,13,0.75) — comfortable reading weight on solid backgrounds",
        tertiary: "rgba(11,11,13,0.45) — clearly supporting",
        muted: "rgba(11,11,13,0.35) — quiet meta text, labels",
        faint: "rgba(11,11,13,0.25) — whisper-quiet (timestamps, arrows)",
        fare: "rgba(11,11,13,0.55) — prices: readable but not dominant",
        greenAccent: "rgba(29,185,84,0.6-0.7) — green pops more on white so slightly dialed back",
      },
      strengths: [
        "Text is perfectly legible — dark on solid white, not dark on translucent muddy gray",
        "Feels bright, airy, confident — like a well-designed morning",
        "Micro-shadows create natural depth hierarchy without border-heaviness",
        "Apple Maps quality — map above, clean sheet below, zero ambiguity",
        "Easier to read outdoors in Lagos sunlight",
        "White cards on #FAFAFA is the exact recipe Linear and Vercel use",
      ],
      bestFor: "Daytime use, first-time users, broader demographic appeal, accessibility",
    },
    recommendation:
      "Support both, default to system preference. Dark mode for marketing screenshots — it's more distinctive. Light mode should NOT attempt to show the dark map through translucent white surfaces. That creates muddy, low-contrast, tacky results. Instead: map peeks at the top, solid surfaces below. Two different compositions, equal craft.",
  },
} as const;

// ---------------------------------------------------------------------------
// FUTURE SCREENS — Placeholder for upcoming explorations
// ---------------------------------------------------------------------------

export const UPCOMING_EXPLORATIONS = [
  {
    screen: "Rider — Destination Search",
    surface: "Rider App",
    status: "active" as const,
    notes: "3 variations built. A: Focused (Apple Maps full takeover). B: Contextual (map visible + rising sheet + filter pills). C: Command (Linear energy, big type, inline fares/ETA/EV savings). Route: /rider/destination",
  },
  {
    screen: "Rider — Ride Selection",
    surface: "Rider App",
    status: "queued" as const,
    notes: "Choose vehicle type. Pricing comparison. ETA. Fare estimate.",
  },
  {
    screen: "Driver — Home / Go Online",
    surface: "Driver App",
    status: "queued" as const,
    notes: "Similar map-centric pattern but earnings-focused. Big 'Go Online' CTA.",
  },
  {
    screen: "Landing Page — Hero",
    surface: "Website",
    status: "queued" as const,
    notes: "Brand-first. Motion-heavy. App download CTA. EV narrative.",
  },
  {
    screen: "Fleet Owner — Dashboard",
    surface: "Fleet Dashboard",
    status: "queued" as const,
    notes: "Data-dense. Multi-vehicle monitoring. Linear/Vercel metric cards.",
  },
  {
    screen: "Admin — Overview",
    surface: "Admin Dashboard",
    status: "queued" as const,
    notes: "Operations nerve center. Real-time metrics. User management.",
  },
] as const;