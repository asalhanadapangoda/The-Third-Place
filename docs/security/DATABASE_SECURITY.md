# Database Security & Row Level Security (Supabase PostgreSQL)

## Migration Files
1. `supabase/migrations/001_initial_schema.sql` — Core tables, UUID PKs, foreign keys, indexes, `updated_at` triggers, `is_admin()` helper, and base RLS policies.
2. `supabase/migrations/002_security_hardening.sql` — Immutable `audit_logs` table, `guard_profile_role_change()` anti-escalation trigger, DB check constraints (email regex, length bounds, `https://` URL enforcement), and explicit role-scoped policies.

## RLS Policy Matrix

| Table | `anon` (Public Visitor) | `authenticated` (Non-Admin) | `admin` / `editor` |
| :--- | :--- | :--- | :--- |
| `profiles` | None | `SELECT` own row, `UPDATE` own `full_name` only (role locked by trigger) | `SELECT` all; only `admin` can modify other users' roles |
| `menu_categories` | `SELECT` where `is_active = true` | `SELECT` where `is_active = true` | Full CRUD |
| `menu_items` | `SELECT` where `is_available = true` | `SELECT` where `is_available = true` | Full CRUD |
| `events` | `SELECT` where `is_published = true` | `SELECT` where `is_published = true` | Full CRUD |
| `gallery` | `SELECT` where `is_published = true` | `SELECT` where `is_published = true` | Full CRUD |
| `pages` | `SELECT` where `is_published = true` | `SELECT` where `is_published = true` | Full CRUD |
| `enquiries` | `INSERT` only (`status = 'new'`) | `INSERT` only (`status = 'new'`) | `SELECT`, `UPDATE`, `DELETE` |
| `site_settings` | `SELECT` public business info | `SELECT` public business info | Full CRUD (restricted to `admin` role in Server Action) |
| `audit_logs` | None | None | `SELECT` & `INSERT` only (**NO UPDATE / NO DELETE**) |

## Privilege Escalation Protection
- Admin authorization is verified against `public.profiles.role` via `SECURITY DEFINER` function `public.is_admin()` — never trusting client-editable `user_metadata`.
- Trigger `trg_guard_profile_role_change` blocks any user from updating their own `role` and logs all valid admin role changes into `public.audit_logs`.
- Public signup defaults to `role = 'staff'`, which grants zero admin permissions.

## Live RLS Verification Checklist (Run in Supabase SQL Editor / Staging)
- As `anon`: verify `SELECT * FROM enquiries` returns `0` rows (permission denied / empty), `SELECT * FROM menu_items` excludes `is_available = false`, and `INSERT INTO menu_items` fails.
- As `authenticated` (`role = 'staff'`): verify `DELETE FROM events` fails and `UPDATE profiles SET role = 'admin'` raises `Forbidden: Users cannot modify their own role`.
- As `admin`: verify CRUD succeeds and `DELETE FROM audit_logs` fails (0 rows deleted / denied).
