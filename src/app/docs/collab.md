You are not to touch our existing designs yet. This is just explorations we will go through before we will then decide on what stays finally.
Please do not chnage the design of anything that is not mentioned here because these are specific changes to our current design,not a complete redesign

FIX 1 - Create this onboarding variation let me test

STATE 1 — SETUP / ONBOARDING
Current problem: Three variations exist (wizard, checklist card, right-panel checklist). None communicate what the platform will look like when live.
What to build:
Replace all three variations with one direction. Layout: full-screen centered content, map visible but ghosted/dimmed behind it as a preview.
Left side: vertical step progress (Zones → Drivers → Hotels opt → Fleet opt → Go Live). Active step is highlighted green. Completed steps show a checkmark. Optional steps are labelled "opt" in muted text.
Right side of each step: a preview card showing what that step unlocks on the live Command Center. Example — Zones step shows a miniature ghost version of the zone bubble map with placeholder bubbles. Drivers step shows a ghost KPI card for "Drivers Online." This teaches the admin what they're building toward.
Bottom of screen: "X of 3 required steps complete" progress bar. Only required steps count toward progress. Optional steps are bonus.
Empty state for the map: Keep the globe icon and "Configure zones to activate the map" copy. This is correct. Do not change it.

FIX 2 - create a variation

STATE 2 — ACTIVE COMMAND CENTER
2A. KPI Strip
Current problem: 8 metrics, inconsistent health labelling, no clear action hierarchy.
What to change:
Reduce to 5 metric groups in this exact order:

Drivers Online — "847 of 1214 · 70% online" — health tag: "Below target" in amber
Active Rides — "12,481" — health tag: "Normal" in green
Match Time — "42s" — health tag: "Healthy" in green
Issues — "3 urgent of 15" — health tag: none, red dot on the number 3
Revenue Today — "₦14.2M · +8%" — health tag: "On target" in green

Remove from strip: Hotel Rides, Fleet Util, Completion rate. These move to Analytics.
Health colour sits on the group container, not just the label text. Amber group has a subtle amber left border. Red group has a red left border. Green has no border treatment — green is the default, only exceptions are highlighted.
Clicking an amber or red KPI group scrolls the Decisions panel to the related item and briefly highlights it (300ms). No new surface opens.

2B. Decisions Panel
Current problem: Single flat list, no priority structure, action buttons say "open" or nothing.
What to build:
Two sections, always in this order:
Section 1 — Handle Now (red items only)
Each item has: coloured severity dot · title · one-line description · timestamp · category tag · one action button with a verb label.
Action button labels must be specific verbs: "Investigate", "Review", "Approve", "Resolve". Never "Open" or "View."
Section 2 — Handle Today (orange and blue items)
Same structure. Orange items appear before blue items within this section.
Divider between sections is a simple 1px rule with the section label in muted small caps.
Empty state for "Handle Now": When no red items exist, show: "Platform running smoothly" in muted text with a small green dot. No icon, no illustration. One line.
Each item's action button opens a drawer from the right that overlays the Command Center. The map and KPI strip remain visible behind it. A clear "← Back" or X closes the drawer and returns to the Command Center exactly as left.
Do not wire cross-surface navigation yet. The drawer is self-contained for now.
2C. KPI → Panel Connection
When "Drivers Online" KPI is amber and user clicks it, the Decisions panel scrolls to and highlights the relevant supply item for 300ms. Same behaviour for any non-green KPI. This is a scroll + highlight only. No modal, no new page.

WHAT NOT TO TOUCH

Nav rail and its badge counts
The map itself and drill-down behaviour
The bottom ticker bar
The breadcrumb navigation (Nigeria → FCT Abuja → Zone)
The zone bubble map and tooltip cards
Rides surface
Any other surface

TONE CHECK
Every label, status word, and button text must be plain English. No jargon. "Handle Now" not "Critical Queue." "Drivers Online" not "Supply Utilisation Rate." "Below target" not "Suboptimal."