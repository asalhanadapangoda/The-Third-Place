# Authentication & Authorization Guide

## Authentication Architecture
- **Provider:** Supabase Auth with `@supabase/ssr`.
- **Server Verification:** All protected routes, Server Actions, and API endpoints verify sessions via `supabase.auth.getUser()` (server-validated JWT check against Supabase Auth) — never trusting client-side `getSession()`.
- **Route Protection:** `src/proxy.js` refreshes auth cookies with `SameSite=Lax` and `Secure` (in production), and redirects unauthenticated requests on `/admin/*` to `/admin/login` using `sanitizeRedirectPath()`.
- **Brute-Force Defense:** `loginAdmin` enforces 5 attempts per 15 minutes per IP + email and logs failed attempts to `audit_logs`.
- **Password Recovery:** Built into `/admin/login` via `requestPasswordReset()` with rate limiting (3 / 15 min) and generic anti-enumeration responses.

## Trusted Initial Administrator Setup
1. Disable public self-signup in **Supabase Dashboard → Authentication → Providers → Email** (or keep all new users restricted to `role = 'staff'`).
2. Create the initial administrator account in **Supabase Auth → Users**.
3. Run in Supabase SQL Editor:
   ```sql
   update public.profiles set role = 'admin' where email = 'admin@yourdomain.com';
   ```
4. **Enable MFA (TOTP):** In **Supabase Dashboard → Authentication → MFA**, enable TOTP Authenticator App MFA and require AAL2 for administrator accounts.

## Reusable RBAC Utilities
- `requireAuthenticatedUser()` (`src/lib/supabase/admin.js`) — Verifies valid server session.
- `requireAdmin()` (`src/lib/supabase/admin.js`) — Verifies authenticated user with `admin` or `editor` role in `public.profiles`.
- `requirePermission(permission)` (`src/lib/supabase/admin.js`) — Enforces granular RBAC permission (`MANAGE_MENU`, `MANAGE_EVENTS`, `MANAGE_GALLERY`, `MANAGE_CONTENT`, `MANAGE_ENQUIRIES`, `MANAGE_SETTINGS`, `MANAGE_UPLOADS`, `VIEW_AUDIT_LOGS`, `MANAGE_ROLES`).
- `hasPermission(role, permission)` (`src/lib/security/permissions.js`) — Pure permission checker.
