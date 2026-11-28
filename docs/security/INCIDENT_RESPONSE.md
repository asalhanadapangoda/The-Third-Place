# Backup, Recovery & Incident Response Plan

## 1. Backup & Recovery Strategy

### Supabase PostgreSQL Backups
- Enable **Daily Automated Backups** (and Point-in-Time Recovery on Supabase Pro/Team plans) in **Supabase Dashboard → Database → Backups**.
- **Export Backup Manually (Before Major Migrations):**
  ```bash
  supabase db dump --db-url "$DATABASE_URL" -f backup-$(date +%Y%m%d).sql
  ```
- **Restore Procedure (Staging First):**
  1. Never restore directly over production without verifying on a staging branch/project.
  2. Restore via Supabase Dashboard Backups or `psql "$STAGING_DB_URL" < backup-YYYYMMDD.sql`.
  3. Verify row counts for `menu_items`, `events`, `gallery`, `pages`, `site_settings`, and confirm RLS is still enabled on every table.

### Cloudinary Media Asset Recovery
- Database backups store only `image_url` and `image_public_id` — they do **not** store the binary image files.
- Enable **Cloudinary Backup** in **Cloudinary Console → Settings → Upload → Auto-backup** so deleted or overwritten assets under `the-third-place/*` can be restored from Cloudinary's backup bucket.
- Keep original high-resolution brand kit and café photography archived in an encrypted team cloud drive.

## 2. Customer Enquiry Data Retention & Privacy
- Enquiries are stored only in `public.enquiries` (restricted to administrators via RLS).
- Never log customer email/phone/message content in application logs.
- Review and purge resolved enquiries older than 12 months via `/admin/messages` (or a scheduled Supabase SQL cleanup).

## 3. Security Incident Response Procedure
1. **Contain:** Revoke compromised Supabase user sessions (`auth.admin.signOut`), rotate exposed keys (`SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET`) immediately in Supabase/Cloudinary and Vercel.
2. **Investigate:** Review `public.audit_logs` for unauthorized actions (`auth.login_failed`, `profile.role_changed`, `cloudinary.delete`, `settings.updated`) and check Vercel/Supabase logs.
3. **Remediate:** Patch root cause, re-run `node --test tests/security.test.mjs`, and deploy.
4. **Recover & Review:** Restore any affected records from Supabase/Cloudinary backups and document post-incident improvements.
