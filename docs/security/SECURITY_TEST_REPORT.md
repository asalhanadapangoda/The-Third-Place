# Security Test Report — The Third Place

## 1. Automated Security Test Results
Executed via `node --test tests/security.test.mjs`:

- **Total Tests:** 8
- **Passed:** 8
- **Failed:** 0

| # | Test Case | Status |
| :--- | :--- | :--- |
| 1 | Genuine JPEG, PNG, WebP, AVIF binary headers accepted | **PASS** |
| 2 | Spoofed Windows PE `.exe`, ELF binary, `<svg>` XSS, forbidden extensions, and >10 MB uploads rejected | **PASS** |
| 3 | RBAC permission boundaries (`admin`, `editor`, `staff`, `public`) enforced | **PASS** |
| 4 | Open-redirect sanitizer blocks `https://`, `//`, and `/\` external redirects | **PASS** |
| 5 | UUID validator rejects SQLi (`' OR 1=1 --`) and path traversal (`../../etc/passwd`) | **PASS** |
| 6 | Sliding-window rate limiter enforces cap and returns `retryAfterSeconds` | **PASS** |
| 7 | Zod schemas reject invalid emails and negative LKR prices | **PASS** |
| 8 | Static scan confirms zero `"use client"` files reference `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`, or `createServiceRoleClient` | **PASS** |

## 2. Static Code & Lint Verification
- `npm run lint` (`eslint` with `eslint-config-next/core-web-vitals`): **PASS** (0 errors, 0 warnings).

## 3. Live Staging / Production Manual Verification Plan (Pending Live Credentials)
Execute these against your staging Supabase + Cloudinary environment before production launch:
- **Authentication:** Access `/admin/dashboard` and `POST /api/upload` without session (expect redirect / HTTP 401); test 6 consecutive failed logins (expect rate-limit block); test password recovery email; test TOTP MFA login; test logout invalidation.
- **Database RLS:** Verify anonymous read cannot see `enquiries` or `is_available = false` menu items; verify `staff` user cannot delete events or escalate own role in `profiles`; verify `admin` cannot `DELETE` from `audit_logs`.
- **Upload & Deletion:** Upload valid photo to `/api/upload` (HTTP 201), attempt deleting a `publicId` outside `the-third-place/` (expect HTTP 400).
- **Headers & TLS:** Verify live Vercel response headers via `curl -I` for `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy`.
