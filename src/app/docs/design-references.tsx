 /**
 * ============================================================================
 * JET — DESIGN REFERENCE ANALYSIS
 * ============================================================================
 *
 * Deep analysis of ~30 reference images (primarily rondesignlab studio work)
 * across logistics, transport, fleet management, wellness, and energy dashboards.
 *
 * LAST UPDATED: 2026-03-03
 *
 * ============================================================================
 * 1. LAYOUT & COMPOSITION
 * ============================================================================
 *
 * DASHBOARD LAYOUTS:
 * - Card-based grid systems: 2-3 column grids with varying card heights
 * - Cards are the atomic unit — each card has ONE clear job
 * - Left sidebar nav (icon-only, collapsed) — content area takes ~85% width
 * - Maps are primary visual anchors: 40-60% of screen real estate
 * - Information hierarchy: large metric → supporting label → trend/sparkline
 * - Progressive disclosure everywhere — summary first, detail on interaction
 * - Tight but breathable whitespace — dense enough to feel professional,
 *   loose enough to not overwhelm
 *
 * MOBILE LAYOUTS:
 * - Full-bleed hero areas with large display typography
 * - Bottom sheet patterns for secondary information
 * - Horizontal scrollable pill/tab navigation for filtering
 * - Cards with generous corner radius (16-20px)
 * - Bottom navigation bar (icon + label)
 * - Vertical flow with clear section breaks
 *
 * GRID DISCIPLINE:
 * - 8px base grid visible in all spacing decisions
 * - Card internal padding: 16-24px
 * - Card gap: 12-16px
 * - Header areas: compact but clear, never cramped
 *
 * → JET APPLICATION:
 *   Admin/Fleet/Hotel dashboards: sidebar + card grid + map canvas
 *   Rider/Driver mobile: full-bleed map + bottom sheet + pill nav
 *   Landing page: large sections, generous spacing, card showcases
 *
 * ============================================================================
 * 2. TYPOGRAPHY PATTERNS
 * ============================================================================
 *
 * DISPLAY/HEADLINES:
 * - MASSIVE display text as section anchors ("Loads available", "Parking zone")
 * - Mix: thin/light for oversized display, medium/semibold for functional headers
 * - Very tight tracking on large text (-0.02em to -0.04em)
 * - Selective ALL CAPS for category/section labels (sparingly, with wide tracking)
 *
 * BODY/UI TEXT:
 * - Small, confident, high-contrast body text
 * - Labels: lighter weight, smaller, muted color — clearly subordinate
 * - Metric numbers displayed LARGE (32-48px) with unit/label small beside or below
 * - Monospace or tabular figures for data values (alignment)
 *
 * HIERARCHY IS RUTHLESS — 3 RULES:
 * 1. Maximum 3-4 levels in any single card
 * 2. Size jumps are significant (not incremental) — creates unmistakable priority
 * 3. Color + size + weight work together (never rely on just one)
 *
 * → JET APPLICATION:
 *   Key metrics: 32-48px Montserrat medium
 *   Card titles: 14-16px Montserrat medium, letter-spacing -0.02em
 *   Card body/values: 13-14px Manrope regular
 *   Labels/captions: 11-12px Manrope regular, muted-foreground
 *   Pill/badge text: 11px Manrope medium, uppercase where appropriate
 *
 * ============================================================================
 * 3. COLOR & PALETTE STRATEGY
 * ============================================================================
 *
 * THE CORE PRINCIPLE: COLOR RESTRAINT
 * - Brand accent appears on ~5-10% of total surface area
 * - Everything else is monochrome grayscale
 * - This makes the accent POWERFUL when it appears (CTAs, active states, key data)
 *
 * LIGHT MODE (primary reference):
 * - Background: subtle cool gray (#F7F7F8 to #FAFAFA)
 * - Cards: pure white, subtle shadow OR 1px border (never both)
 * - Primary accent: sparingly — CTAs, active indicators, key metrics
 * - Data colors: muted, desaturated (blue, green, amber, red — never saturated)
 * - Status: small colored dots or pills, never large color blocks
 *
 * DARK MODE (secondary reference):
 * - Background: NOT flat black — layered atmospheric depth
 *   - Deep base (#0B0B0D to #111114)
 *   - Subtle radial gradients from corners: brand green / blue / purple at 3-8% opacity
 *   - Creates a sense of "environment" — light reacts to content
 *   - Some screens have gradient meshes: color pools that shift subtly across the bg
 * - Cards: elevated gray (#1A1A1E to #222226) — or GLASS (see below)
 * - Borders: 1px, white at 8-12% opacity
 * - Accents pop more — green/blue/amber used for emphasis
 * - Subtle noise/grain texture on dark surfaces (barely perceptible, adds materiality)
 *
 * LIGHT MODE BACKGROUNDS:
 * - Not pure flat either — subtle warmth gradient on some surfaces
 * - Prevents clinical feeling from going cold
 * - Background: #F7F7F8 to #FAFAFA with occasional subtle radial warm tint
 *
 * MOBILE BACKGROUNDS:
 * - Map IS the background — UI elements float over it, map isn't in a card
 * - Rich gradient meshes: warm amber → deep crimson → black (wellness refs)
 * - Dark base with muted color pools (logistics mobile refs)
 * - The background is a living surface, not a container
 *
 * STATUS / SEMANTIC COLORS (observed across references):
 * - Success/active: green (our #1DB954 maps perfectly)
 * - Warning/pending: warm amber (#F59E0B range), desaturated for backgrounds
 * - Error/alert: red (#EF4444 range), used with restraint
 * - Info/neutral: blue (#3B82F6 range), for links and informational states
 * - Each status color has: dot, pill-bg (10% opacity), pill-text (full), border (20%)
 *
 * → JET GREY SCALE TO SYSTEMIZE:
 *   50:  #FAFAFA (page background light)
 *   100: #F5F5F5 (card hover, subtle fill)
 *   200: #E5E5E5 (borders, dividers light)
 *   300: #D4D4D4 (disabled borders)
 *   400: #A3A3A3 (placeholder text)
 *   500: #737373 (muted-foreground / secondary text)
 *   600: #525252 (body text secondary)
 *   700: #404040 (dark mode card background alt)
 *   800: #262626 (dark mode card background)
 *   900: #171717 (dark mode page background)
 *   950: #0B0B0D (true black, our brand black)
 *
 * → JET GREEN USAGE RULES:
 *   #1DB954 at 100%: CTAs, active nav, key metric accents, status dots
 *   #1DB954 at 10-20%: pill backgrounds, card highlights, hover tints
 *   #046538: secondary emphasis, icon fills, header accents
 *   Never: large color blocks, full-width bars, entire card backgrounds
 *
 * ============================================================================
 * 4. SURFACE TREATMENTS & MATERIALS
 * ============================================================================
 *
 * CARDS:
 * - Shadow style: barely-there `0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)`
 * - OR: no shadow + 1px border at 6-8% opacity (pick one per mode, stay consistent)
 * - Corner radius: 12-16px for cards, 8-10px for inner elements (inputs, pills)
 * - Mobile cards: 16-20px radius
 * - Hover: slight elevation or border-color shift (never dramatic)
 *
 * GLASSMORPHISM — A PRIMARY SURFACE MATERIAL (not just "sparingly"):
 * Used across both mobile AND dashboard contexts in the references.
 * It is a core material in this design language.
 *
 * WHERE IT APPEARS:
 * - Sidebar navigation: frosted glass sidebars over map/dark bg — content bleeds through
 * - Bottom sheets (mobile): ride detail, route info, driver cards — all glass over map
 * - Floating info cards on maps: route summaries, ETA bubbles, fare cards
 * - Modal overlays: frosted layers that maintain spatial awareness of what's behind
 * - Header/toolbar areas: nav bars that blur content scrolling beneath them
 * - Dashboard overlay panels: stats overlaying map canvas, sidebar on dark bg
 *
 * THE RECIPE (from references):
 * - On dark backgrounds:
 *   backdrop-filter: blur(16-24px)
 *   background: rgba(255,255,255, 0.06-0.12)
 *   border: 1px solid rgba(255,255,255, 0.08-0.15)
 *   Optional: subtle inner highlight at top edge ("glass lip")
 *
 * - On light backgrounds:
 *   backdrop-filter: blur(16-24px)
 *   background: rgba(255,255,255, 0.70-0.85)
 *   border: 1px solid rgba(0,0,0, 0.06-0.10)
 *   Creates "frosted paper" feeling over content
 *
 * - On map surfaces (critical for Jet):
 *   backdrop-filter: blur(20px)
 *   background: rgba(0,0,0, 0.5-0.7) — dark glass over map
 *   OR rgba(255,255,255, 0.8-0.9) — light glass over map
 *   border: 1px solid rgba(255,255,255, 0.1)
 *   Map context stays visible, UI feels floating and spatial
 *
 * WHEN TO USE OPAQUE vs GLASS:
 * - Opaque cards: data-dense grids with lots of text (readability priority)
 * - Glass cards: overlaying rich content (maps, images, gradients)
 * - Glass sidebars: when sidebar sits over full-bleed map/canvas
 * - Glass bottom sheets: always on mobile map views
 * - Glass headers: when content scrolls beneath fixed header
 *
 * MAPS:
 * - Custom muted map styles (desaturated base)
 * - Route lines in brand color with weight variation (active vs planned)
 * - Custom minimal pins/markers
 * - Map is a first-class UI element, not an afterthought in a corner
 *
 * 3D ELEMENTS (observed):
 * - Isometric vehicle models for parking/fleet views
 * - 3D terrain for spatial dashboards
 * - Always purposeful (conveys spatial info), never decorative
 * - Consider for Jet: 3D map view for fleet positioning, isometric car/EV renders
 *
 * → JET APPLICATION:
 *   Light mode: 1px border (#E5E5E5), no shadow, 12px radius
 *   Dark mode: 1px border (white 8%), no shadow, 12px radius
 *   Mobile: 16px radius, subtle shadow on floating elements
 *   Map: custom muted style, green route lines, minimal markers
 *
 * ============================================================================
 * 5. CONTRAST & READABILITY
 * ============================================================================
 *
 * TEXT CONTRAST LADDER:
 * - Primary (light bg): #0B0B0D — maximum contrast, headlines + key text
 * - Secondary (light bg): #525252-#737373 — body text, descriptions
 * - Tertiary (light bg): #A3A3A3 — captions, timestamps, metadata
 * - Primary (dark bg): #FFFFFF — headlines + key text
 * - Secondary (dark bg): #A1A1AA — body text, descriptions
 * - Tertiary (dark bg): #63636E — captions, metadata
 *
 * ELEMENT CONTRAST:
 * - CTAs: filled buttons, high contrast (white on brand, brand on white)
 * - Secondary actions: ghost/outline, lower visual weight
 * - Active/selected: clear differentiation (fill + color, never ambiguous)
 * - Disabled: 40-50% opacity, never invisible but clearly inert
 *
 * DATA VISUALIZATION:
 * - Chart colors are distinct and accessible
 * - Grid lines: 2-4% opacity (barely visible, just enough for alignment)
 * - Legend uses color + position (never color alone)
 *
 * ============================================================================
 * 6. INTERACTION PATTERNS & AFFORDANCES
 * ============================================================================
 *
 * NAVIGATION:
 * - Icon sidebar with hover tooltips (Linear style)
 * - Breadcrumb or back-arrow for drill-down flows
 * - Tabs/pills for view switching (not dropdowns — visibility > compactness)
 * - Search: prominent, large target area, top of screen
 *
 * CARDS AS INTERACTIVE UNITS:
 * - Tappable cards have hover/press states
 * - Primary CTA prominent and high-contrast ("Accept", "Book Transport")
 * - Secondary actions via overflow/more menu
 * - Status badges always visible (not hidden behind interaction)
 *
 * FILTERS:
 * - Horizontal pill/chip filters (scrollable on mobile)
 * - Active filter: filled background
 * - Removable: X icon on active chip
 * - Filter count badge when active
 *
 * DATA DISPLAY PATTERNS:
 * - Big number + small label (the "Linear metric card" pattern)
 * - Sparklines for trends in summary views (not full charts)
 * - Thin, elegant progress bars
 * - Timeline/route: connected dots with status color
 * - Route visualization: origin → waypoints → destination with distance/time
 *
 * → JET SPECIFIC PATTERNS TO BUILD:
 *   Ride card: pickup/dropoff + map preview + fare + status + accept CTA
 *   Driver metric card: large earnings number + period + sparkline
 *   Fleet vehicle card: vehicle image + status dot + key stats
 *   Route timeline: connected dots, ETA, distance, status per stop
 *   Filter bar: location, vehicle type, time range as horizontal pills
 *
 * ============================================================================
 * 7. MOTION LANGUAGE (derived from references)
 * ============================================================================
 *
 * PRINCIPLES:
 * - Motion serves comprehension — it shows relationships, not decoration
 * - Transitions feel physical — ease-out curves, subtle overshoot
 * - Stagger reveals create reading order (cards enter top→bottom, left→right)
 * - State changes are smooth but fast (never sluggish, never jarring)
 *
 * TIMING (refined from initial system):
 * - Micro (120-150ms): button press, toggle, checkbox — instant feedback
 * - Standard (200-250ms): panel slide, card hover, nav highlight — smooth
 * - Emphasis (300-400ms): page transition, modal enter, sheet slide — dramatic
 * - Stagger: 30-50ms between items in a list/grid
 *
 * CURVES:
 * - Default: cubic-bezier(0.16, 1, 0.3, 1) — fast-out, slow-settle (Vercel style)
 * - Spring: stiffness 400, damping 30 — for playful/bouncy (mobile gestures)
 * - Linear: only for progress bars and continuous animations
 *
 * SPECIFIC ANIMATIONS:
 * - Cards: fade-in + slight y-translate (8-12px) with stagger
 * - Modals/sheets: slide from bottom + fade backdrop
 * - Numbers: count-up animation for metrics on load
 * - Map: smooth pan/zoom transitions
 * - Skeleton → content: crossfade with slight scale (0.98 → 1.0)
 * - Tab switch: crossfade content, slide indicator
 *
 * ============================================================================
 * 8. WHAT MAKES THESE REFERENCES EXCELLENT — THE DESIGN DNA
 * ============================================================================
 *
 * 1. RUTHLESS HIERARCHY
 *    You always know what to look at first. No visual competition between
 *    elements at the same level. Size jumps are dramatic, not timid.
 *
 * 2. DENSITY WITHOUT CLUTTER
 *    Packed with information but never overwhelming because of:
 *    - Consistent spacing rhythm
 *    - Clear visual grouping (proximity + card containment)
 *    - Muted supporting elements that don't fight for attention
 *
 * 3. COLOR RESTRAINT (THE BIG ONE)
 *    Brand color on ~5-10% of surface. Everything else monochrome.
 *    This makes the accent devastatingly effective when it appears.
 *    Jet must follow this: green is a scalpel, not a paintbrush.
 *
 * 4. TYPOGRAPHY AS ARCHITECTURE
 *    Text sizes CREATE the spatial structure. Remove all borders and lines
 *    and you'd still understand the hierarchy from type alone.
 *
 * 5. PROFESSIONAL CONFIDENCE
 *    Nothing trying too hard. No gratuitous gradients, no decoration,
 *    no "look at me" moments. Every element earns its place or it's gone.
 *
 * 6. MAPS AS FIRST-CLASS CITIZENS
 *    In transport contexts, the map isn't stuffed in a corner. It's the
 *    primary canvas. Critical for Jet's rider and driver experiences.
 *
 * 7. CARD-BASED MODULARITY
 *    Every piece of information in a self-contained card that can be
 *    rearranged, resized, recontextualized. Figma composability in action.
 *
 * 8. WARM IMMERSION FOR MOBILE
 *    Mobile experiences allow richer treatments — glassmorphism, gradients,
 *    large imagery — because the context is personal and focused.
 *    Dashboards stay clinical. Mobile can be emotional.
 *
 * 9. BACKGROUNDS ARE ALIVE
 *    Dark backgrounds aren't flat — they have subtle radial gradients,
 *    color pools, and noise texture that create environment and depth.
 *    Light backgrounds have subtle warmth. Maps ARE the background on
 *    transport screens. The surface beneath the UI matters.
 *
 * 10. GLASS IS A CORE MATERIAL
 *     Glassmorphism isn't a gimmick used occasionally — it's a primary
 *     surface material. Sidebars, bottom sheets, map overlays, floating
 *     cards, headers — all use glass when sitting over rich content.
 *     It maintains spatial awareness and creates depth hierarchy.
 *
 * ============================================================================
 * 9. JET EXECUTION RULES (derived from analysis)
 * ============================================================================
 *
 * GREEN IS A SCALPEL:
 * - #1DB954 appears only on: CTAs, active indicators, key metrics, status dots
 * - Never on: large fills, full card backgrounds, decorative areas
 * - Tints (5-20% opacity) for: selected card backgrounds, hover states, pill fills
 *
 * CARDS ARE EVERYTHING:
 * - Every piece of dashboard information lives in a card
 * - Cards have consistent padding (16-20px), radius (12px), and treatment
 * - One shadow/border system per mode, never mixed
 *
 * TYPE DOES THE WORK:
 * - 3-4 type levels per card maximum
 * - Size jumps ≥ 4px between levels (never 1-2px incremental)
 * - Metric numbers are always the largest element in their card
 *
 * MAPS ARE PRIMARY:
 * - Rider/Driver: map takes 60-70% of screen
 * - Fleet dashboard: map is the hero card in the grid
 * - Custom muted style, Jet green for routes
 *
 * MOBILE = EMOTIONAL, DASHBOARD = CLINICAL:
 * - Rider/Driver apps can use richer surfaces (gradients, blur, imagery)
 * - Admin/Fleet/Hotel dashboards are clean, monochrome, data-dense
 * - Both share the same component DNA, just different surface treatments
 *
 * MOTION BUILDS TRUST:
 * - Every state change is animated (never jump-cuts)
 * - Skeleton → content transitions
 * - Staggered card reveals
 * - Number count-ups for metrics
 * - Map transitions smooth and continuous
 *
 * ============================================================================
 */

export {};