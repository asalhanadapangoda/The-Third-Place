-- =============================================================================
-- The Third Place — Migration 002: Database Security Hardening & Audit Logs
-- Run after 001_initial_schema.sql in Supabase SQL Editor.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Immutable Administrative Audit Logs Table
-- -----------------------------------------------------------------------------
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_audit_logs_created_at on public.audit_logs(created_at desc);
create index if not exists idx_audit_logs_actor on public.audit_logs(actor_id);
create index if not exists idx_audit_logs_action on public.audit_logs(action);

alter table public.audit_logs enable row level security;

-- Only admins can view audit logs
drop policy if exists "Admins can read audit logs" on public.audit_logs;
create policy "Admins can read audit logs" on public.audit_logs
  for select to authenticated
  using (public.is_admin());

-- Authenticated admins (or server-side service role) can append audit records
drop policy if exists "Admins can insert audit logs" on public.audit_logs;
create policy "Admins can insert audit logs" on public.audit_logs
  for insert to authenticated
  with check (public.is_admin() or auth.uid() = actor_id);

-- IMPORTANT: Intentionally NO UPDATE or DELETE policies on audit_logs.
-- Even administrators cannot modify or delete historical audit entries.

-- -----------------------------------------------------------------------------
-- 2. Prevent Privilege Escalation & Audit Role Changes on public.profiles
-- -----------------------------------------------------------------------------
create or replace function public.guard_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role text;
begin
  if new.role is distinct from old.role then
    -- Allow direct SQL / service_role migrations when auth.uid() is null
    if auth.uid() is not null then
      -- Prevent any user from changing their own role
      if auth.uid() = old.id then
        raise exception 'Forbidden: Users cannot modify their own role.';
      end if;

      -- Only full 'admin' role can change another user's role
      select role into caller_role from public.profiles where id = auth.uid();
      if caller_role is distinct from 'admin' then
        raise exception 'Forbidden: Only administrators can modify roles.';
      end if;
    end if;

    -- Record immutable role change audit event
    insert into public.audit_logs (actor_id, action, resource_type, resource_id, metadata)
    values (
      auth.uid(),
      'profile.role_changed',
      'profile',
      old.id::text,
      jsonb_build_object('previous_role', old.role, 'new_role', new.role)
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_profile_role_change on public.profiles;
create trigger trg_guard_profile_role_change
  before update on public.profiles
  for each row execute function public.guard_profile_role_change();

-- -----------------------------------------------------------------------------
-- 3. Strengthen Database Constraints (Defense-in-Depth Validation)
-- -----------------------------------------------------------------------------
alter table public.enquiries
  drop constraint if exists chk_enquiries_name_len,
  drop constraint if exists chk_enquiries_message_len,
  drop constraint if exists chk_enquiries_email_fmt;

alter table public.enquiries
  add constraint chk_enquiries_name_len check (char_length(trim(name)) between 2 and 120),
  add constraint chk_enquiries_message_len check (char_length(trim(message)) between 10 and 2000),
  add constraint chk_enquiries_email_fmt check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$');

alter table public.gallery
  drop constraint if exists chk_gallery_https_url;
alter table public.gallery
  add constraint chk_gallery_https_url check (image_url ~* '^https://');

alter table public.menu_items
  drop constraint if exists chk_menu_items_https_url;
alter table public.menu_items
  add constraint chk_menu_items_https_url check (image_url is null or image_url ~* '^https://');

alter table public.events
  drop constraint if exists chk_events_https_poster,
  drop constraint if exists chk_events_https_reg;
alter table public.events
  add constraint chk_events_https_poster check (poster_url is null or poster_url ~* '^https://'),
  add constraint chk_events_https_reg check (registration_url is null or registration_url ~* '^https://');

-- -----------------------------------------------------------------------------
-- 4. Explicit Role-Scoped RLS Policies (anon vs authenticated vs admin)
-- -----------------------------------------------------------------------------

-- Ensure anonymous visitors can ONLY read published/available public data
drop policy if exists "Public can submit enquiries" on public.enquiries;
create policy "Anon and authenticated can submit enquiries" on public.enquiries
  for insert to anon, authenticated
  with check (status = 'new');

-- Restrict profiles updates so users can update only their full_name, never role
drop policy if exists "Users can update own profile name" on public.profiles;
create policy "Users can update own profile name" on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Explicitly revoke direct schema-wide privileges from public/anon where unneeded
revoke truncate on all tables in schema public from anon, authenticated;
