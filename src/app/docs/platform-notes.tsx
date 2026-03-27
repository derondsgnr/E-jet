 /**
 * ============================================================================
 * PLATFORM & CROSS-PLATFORM NOTES
 * ============================================================================
 *
 * Since dashboards are interconnected across web and mobile:
 *
 * WEB (Desktop + Responsive)
 * --------------------------
 * - Admin & Operator dashboards are web-first
 * - Rider & Driver have web fallbacks for account/settings
 * - Must scale cleanly: 1280px → 1920px+ (Linear-style fluid scaling)
 * - Sidebar navigation collapses gracefully on tablet
 *
 * MOBILE WEB
 * ----------
 * - Responsive breakpoints: 320px → 428px (standard phone range)
 * - Bottom navigation pattern for primary actions
 * - Sheets/drawers for secondary content
 * - Touch targets: minimum 44px (Apple HIG)
 *
 * NATIVE MOBILE (iOS / Android)
 * -----------------------------
 * - Web dashboards designed to be the blueprint for native
 * - Shared component language (same design tokens)
 * - Platform-specific patterns where needed (iOS sheets, Android FAB)
 *
 * FIGMA EXPORT CONSIDERATIONS
 * ---------------------------
 * - Components built with auto-layout-friendly structures
 * - Consistent spacing scale (4px grid)
 * - Named layers that map to Figma component structure
 * - Avoid absolute positioning where flex/grid achieves the same
 *
 * ============================================================================
 *
 * DROP YOUR PLATFORM-SPECIFIC NOTES BELOW:
 *
 */

export {};
