# Security Assessment Report — The Third Place

## 1. Scope Audited
- Public routes (`/`, `/story`, `/menu`, `/play-read`, `/events`, `/events/[slug]`, `/space`, `/gallery`, `/contact`)
- Admin routes (`/admin/login`, `/admin/dashboard`, `/admin/menu`, `/admin/events`, `/admin/gallery`, `/admin/content`, `/admin/messages`, `/admin/settings`)
- API routes (`/api/upload`) and all Server Actions (`src/actions/*`)
- Supabase PostgreSQL schema & RLS (`supabase/migrations/001_initial_schema.sql`, `002_security_hardening.sql`)
- Next.js configuration (`next.config.mjs`, `src/proxy.js`), environment variables, and client components.

## 2. Findings & Remediation Status

| ID | Severity | Finding | Status | Remediation |
| :--- | :--- | :--- | :--- | :--- |
| SEC-01 | **Critical** | `/api/upload` relied only on client-supplied `file.type` MIME header without binary content verification or prefix check on `DELETE`. | **Fixed & Tested** | Added magic-byte inspection (`fileValidation.js`), 10 MB cap, executable/SVG blocking, same-origin check, rate limiting, and `the-third-place/` prefix validation. |
| SEC-02 | **High** | Missing HTTP security headers & Content Security Policy in `next.config.mjs`. | **Fixed** | Added CSP, HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and `poweredByHeader: false`. |
| SEC-03 | **High** | No rate limiting on admin login, password reset, customer enquiries, or image uploads. | **Fixed & Tested** | Implemented sliding-window rate limiter (`src/lib/security/rateLimit.js`) across auth, enquiries, and uploads. |
| SEC-04 | **High** | No database-level trigger preventing profile role self-escalation and no immutable audit log table. | **Fixed (SQL Migration Ready)** | Created `002_security_hardening.sql` with `guard_profile_role_change()` trigger and append-only `audit_logs` table. |
| SEC-05 | **Medium** | Server Actions returned raw Supabase error strings and lacked UUID validation on ID parameters. | **Fixed & Tested** | Added `isValidUuid()`, granular `requirePermission()`, safe generic error messages, and audit logging across all Server Actions. |
| SEC-06 | **Medium** | Potential open redirect via `?next=` query parameter on `/admin/login`. | **Fixed & Tested** | Added `sanitizeRedirectPath()` restricting redirects to internal relative paths. |
| SEC-07 | **Low** | In-memory rate limiter resets across serverless cold starts / multi-region edge instances. | **Pending (Production Recommendation)** | For high-traffic production on Vercel, back `rateLimit.js` with Upstash Redis. |
| SEC-08 | **Informational** | Live Supabase RLS & MFA verification requires deployed Supabase project credentials. | **Pending (Staging/Prod Setup)** | Execute migrations `001` & `002` in Supabase and run the live RLS verification queries in `DATABASE_SECURITY.md`. |
