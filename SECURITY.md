# Security Policy — The Third Place

## Architecture & Security Overview
**The Third Place** (TRACE Expert City, Colombo 10, Sri Lanka) implements defense-in-depth security across Next.js App Router, Supabase PostgreSQL (RLS), Supabase Auth, and Cloudinary.

### Implemented Controls
1. **Authentication & Session Management:** Server-verified Supabase SSR authentication (`auth.getUser()`), secure `SameSite=Lax` & `Secure` production cookies, Next.js 16 `src/proxy.js` route guard, brute-force rate limiting, password recovery, and MFA support via Supabase Auth.
2. **RBAC Authorization:** Reusable server utilities (`requireAuthenticatedUser()`, `requireAdmin()`, `requirePermission()`, `hasPermission()`) enforcing least-privilege access on every admin page, Server Action, and API route.
3. **Database Security:** Row Level Security enabled on all 9 tables (`profiles`, `menu_categories`, `menu_items`, `events`, `gallery`, `pages`, `enquiries`, `site_settings`, `audit_logs`), role self-escalation prevention trigger, and strict DB constraints.
4. **Cloudinary Upload Security:** Admin-only `/api/upload` endpoint with same-origin CSRF check, rate limiting, binary magic-byte header verification, 10 MB size cap, executable/SVG rejection, and `the-third-place/` ownership prefix check on deletion.
5. **Application Hardening:** Content Security Policy (CSP), HSTS, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, Zod validation, honeypot spam protection, safe error boundaries, and immutable administrative audit logging.

### Related Documentation
- [Security Assessment](docs/security/SECURITY_ASSESSMENT.md)
- [Database Security & RLS](docs/security/DATABASE_SECURITY.md)
- [Authentication & RBAC](docs/security/AUTHENTICATION.md)
- [Cloudinary Upload Security](docs/security/CLOUDINARY_SECURITY.md)
- [Security Test Report](docs/security/SECURITY_TEST_REPORT.md)
- [Incident Response & Backups](docs/security/INCIDENT_RESPONSE.md)

### Reporting a Vulnerability
Please report security issues privately to the site administrator at `077 220 1989` rather than opening a public GitHub issue.
