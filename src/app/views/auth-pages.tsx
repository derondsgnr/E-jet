/**
 * AUTH PAGES — Route-level wrappers for shared auth components
 *
 * Each surface gets login, forgot-password, and reset-password pages.
 * All share the same components, branded per surface via props.
 *
 * Routes:
 *   /admin/login          → AdminLogin
 *   /admin/forgot-password → AdminForgotPassword
 *   /admin/reset-password  → AdminResetPassword
 *   /fleet/login          → FleetLogin
 *   /fleet/forgot-password → FleetForgotPassword
 *   /fleet/reset-password  → FleetResetPassword
 *   /hotel/login          → HotelLogin
 *   /hotel/forgot-password → HotelForgotPassword
 *   /hotel/reset-password  → HotelResetPassword
 */

import { useNavigate } from "react-router";
import { AuthLogin, type AuthSurface } from "../components/auth/auth-login";
import { AuthForgotPassword } from "../components/auth/auth-forgot-password";
import { AuthResetPassword } from "../components/auth/auth-reset-password";
import { AdminThemeProvider } from "../config/admin-theme";

// ── Factories ──────────────────────────────────────────────────────────────

function makeLogin(surface: AuthSurface, basePath: string, shellPath: string) {
  return function LoginPage() {
    const navigate = useNavigate();
    return (
      <AdminThemeProvider>
        <AuthLogin
          surface={surface}
          onLogin={() => navigate(shellPath)}
          onForgotPassword={() => navigate(`${basePath}/forgot-password`)}
        />
      </AdminThemeProvider>
    );
  };
}

function makeForgot(surface: AuthSurface, basePath: string) {
  return function ForgotPage() {
    const navigate = useNavigate();
    return (
      <AdminThemeProvider>
        <AuthForgotPassword
          surface={surface}
          onBack={() => navigate(`${basePath}/login`)}
        />
      </AdminThemeProvider>
    );
  };
}

function makeReset(basePath: string) {
  return function ResetPage() {
    const navigate = useNavigate();
    return (
      <AdminThemeProvider>
        <AuthResetPassword
          onReset={() => {}}
          onBackToLogin={() => navigate(`${basePath}/login`)}
        />
      </AdminThemeProvider>
    );
  };
}

// ── Admin ──────────────────────────────────────────────────────────────────

export const AdminLoginPage = makeLogin("admin", "/admin", "/admin");
export const AdminForgotPasswordPage = makeForgot("admin", "/admin");
export const AdminResetPasswordPage = makeReset("/admin");

// ── Fleet ──────────────────────────────────────────────────────────────────

export const FleetLoginPage = makeLogin("fleet", "/fleet", "/fleet");
export const FleetForgotPasswordPage = makeForgot("fleet", "/fleet");
export const FleetResetPasswordPage = makeReset("/fleet");

// ── Hotel ──────────────────────────────────────────────────────────────────

export const HotelLoginPage = makeLogin("hotel", "/hotel", "/hotel");
export const HotelForgotPasswordPage = makeForgot("hotel", "/hotel");
export const HotelResetPasswordPage = makeReset("/hotel");
