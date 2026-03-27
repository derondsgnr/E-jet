/**
 * ============================================================================
 * AUTH SURFACE AUDIT — Login / Logout / Reset Password
 * ============================================================================
 *
 * Audit date: March 17, 2026
 * Scope: All 6 surfaces — what exists, what's missing
 *
 * ============================================================================
 * LEGEND
 *   [x] = Exists and functional
 *   [~] = Partial (exists but incomplete)
 *   [ ] = Missing entirely
 * ============================================================================
 *
 *
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │  SURFACE          │ LOGIN  │ LOGOUT │ RESET PW  │ RESET PW  │ NOTES     │
 * │                   │        │        │ (OUTSIDE) │ (INSIDE)  │           │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │  RIDER            │  [~]   │  [ ]   │   [ ]     │   [ ]     │ 1         │
 * │  DRIVER           │  [~]   │  [ ]   │   [ ]     │   [ ]     │ 2         │
 * │  ADMIN            │  [ ]   │  [ ]   │   [ ]     │   [ ]     │ 3         │
 * │  FLEET OWNER      │  [ ]   │  [~]   │   [ ]     │   [~]     │ 4         │
 * │  HOTEL            │  [ ]   │  [~]   │   [ ]     │   [~]     │ 5         │
 * │  GUEST TRACKING   │  N/A   │  N/A   │   N/A     │   N/A     │ 6         │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ── NOTES ──────────────────────────────────────────────────────────────────
 *
 * 1. RIDER
 *    - Onboarding flow (/rider/onboarding) has phone auth + OTP step
 *    - This is SIGNUP, not login — no returning-user login screen
 *    - No logout button in account tab
 *    - No forgot password / reset flow (phone-based so OTP is the auth,
 *      but still need "change phone number" flow)
 *
 * 2. DRIVER
 *    - Onboarding flow (/driver/onboarding) has phone auth + OTP step
 *    - Same as rider — signup only, no returning-user login
 *    - No logout in account tab
 *    - No phone number change flow
 *
 * 3. ADMIN
 *    - No login page at all — goes straight to dashboard
 *    - No logout button in shell
 *    - No password reset (inside or outside)
 *    - HIGHEST PRIORITY — admin has the most sensitive data
 *
 * 4. FLEET OWNER
 *    - No login page — goes straight to fleet shell
 *    - Has logout button in shell nav (fleet-shell.tsx:714)
 *    - Has "Change password" button in settings (fleet-settings.tsx:482)
 *      but it just shows a toast — no actual flow
 *    - No standalone login or forgot-password page
 *
 * 5. HOTEL
 *    - No login page — goes straight to hotel shell
 *    - Has logout in user menu (hotel-shell.tsx:253)
 *    - Has "Change password" in settings (hotel-settings.tsx:439)
 *      but toast-only — no actual flow
 *    - No standalone login or forgot-password page
 *
 * 6. GUEST TRACKING
 *    - Public page, token-based access — no auth needed
 *    - Correct as-is
 *
 *
 * ── WHAT NEEDS TO BE BUILT ─────────────────────────────────────────────────
 *
 * SHARED (all web surfaces):
 *   ┌──────────────────────────────────────────────────────────┐
 *   │  1. Login page (email + password)                       │
 *   │     - Shared component, branded per surface             │
 *   │     - "Remember me" checkbox                            │
 *   │     - "Forgot password?" link → reset flow              │
 *   │     - Error states: wrong password, account locked,     │
 *   │       account not found                                 │
 *   │                                                         │
 *   │  2. Forgot password page (OUTSIDE — pre-auth)           │
 *   │     - Email input → send reset link                     │
 *   │     - Success: "Check your email" confirmation          │
 *   │     - Error: "Account not found"                        │
 *   │                                                         │
 *   │  3. Reset password page (from email link)               │
 *   │     - New password + confirm                            │
 *   │     - Password strength indicator                       │
 *   │     - Token validation (expired link handling)          │
 *   │                                                         │
 *   │  4. Change password (INSIDE — authenticated)            │
 *   │     - Current password + new password + confirm         │
 *   │     - In settings for fleet/hotel/admin                 │
 *   │     - Success confirmation                              │
 *   │                                                         │
 *   │  5. Logout                                              │
 *   │     - Confirmation dialog (destructive action)          │
 *   │     - Clear session → redirect to login                 │
 *   └──────────────────────────────────────────────────────────┘
 *
 * MOBILE (rider + driver):
 *   ┌──────────────────────────────────────────────────────────┐
 *   │  1. Returning user login                                │
 *   │     - Phone number → OTP (not email/password)           │
 *   │     - "Welcome back, [name]" if recognized device       │
 *   │     - Biometric option (Face ID / fingerprint)          │
 *   │                                                         │
 *   │  2. Logout in account tab                               │
 *   │     - Confirmation dialog                               │
 *   │     - Clear local data → redirect to onboarding/login   │
 *   │                                                         │
 *   │  3. Change phone number                                 │
 *   │     - In account settings                               │
 *   │     - Verify old phone OTP → enter new → verify new OTP │
 *   └──────────────────────────────────────────────────────────┘
 *
 *
 * ── IMPLEMENTATION PLAN ────────────────────────────────────────────────────
 *
 * PHASE 1 — Web surfaces (admin, fleet, hotel):
 *   [A] Shared auth components:
 *       - LoginPage (email/password, surface-branded)
 *       - ForgotPasswordPage (email input → confirmation)
 *       - ResetPasswordPage (new password from email link)
 *       - ChangePasswordModal (inside settings)
 *       - LogoutConfirmDialog
 *
 *   [B] Routes:
 *       /admin/login, /admin/forgot-password, /admin/reset-password
 *       /fleet/login, /fleet/forgot-password, /fleet/reset-password
 *       /hotel/login, /hotel/forgot-password, /hotel/reset-password
 *
 *   [C] Shell updates:
 *       - Admin shell: add logout to sidebar
 *       - Fleet shell: wire existing logout to confirmation dialog
 *       - Hotel shell: wire existing logout to confirmation dialog
 *
 * PHASE 2 — Mobile surfaces (rider, driver):
 *   [D] Add returning-user login to onboarding
 *   [E] Add logout to account tabs
 *   [F] Add change-phone-number flow
 *
 *
 * ── PRIORITY ORDER ─────────────────────────────────────────────────────────
 *
 *   P0: Admin login + logout (security critical)
 *   P0: Fleet login (business data)
 *   P0: Hotel login (guest PII adjacent)
 *   P1: Forgot/reset password for all web surfaces
 *   P1: Change password inside settings
 *   P2: Rider/driver returning user login
 *   P2: Rider/driver logout
 *   P3: Change phone number flows
 *
 * ============================================================================
 */

export {};
