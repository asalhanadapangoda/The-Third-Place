-- =============================================================================
-- The Third Place — Supabase PostgreSQL Schema & Row Level Security
-- Location: TRACE Expert City, Colombo 10, Sri Lanka
-- Run this migration in the Supabase SQL Editor or via Supabase CLI.
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Helper Trigger for updated_at
-- -----------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

-- -----------------------------------------------------------------------------
-- 2. Tables
-- -----------------------------------------------------------------------------

-- Profiles (linked to Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  full_name text,
  role text not null default 'staff' check (role in ('admin', 'editor', 'staff')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Helper function to check admin/editor privileges cleanly inside RLS policies
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'editor')
  );
$$;

-- Menu Categories
create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  display_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Menu Items (Prices in LKR)
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  name text not null,
  slug text not null unique,
  description text,
  price_lkr integer not null check (price_lkr >= 0),
  image_url text,
  image_public_id text,
  tag text,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  category text not null default 'Community',
  event_date date not null,
  end_date date,
  start_time text not null,
  end_time text,
  location text not null default 'The Third Place, TRACE Expert City, Colombo 10',
  poster_url text,
  poster_public_id text,
  registration_url text,
  capacity_label text,
  status text not null default 'draft' check (status in ('draft', 'published', 'completed', 'cancelled')),
  is_published boolean not null default false,
  is_featured boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Gallery
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  alt_text text not null,
  category text not null check (category in ('Coffee', 'Food', 'Interior', 'Community', 'Events', 'Lifestyle')),
  image_url text not null,
  image_public_id text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Dynamic Pages & Homepage Content
create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  hero_image_url text,
  hero_image_public_id text,
  body text,
  content jsonb not null default '{}'::jsonb,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Customer Enquiries (Contact & Space Booking)
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  topic text not null default 'General Enquiry',
  message text not null,
  event_date text,
  guest_count text,
  status text not null default 'new' check (status in ('new', 'in_progress', 'resolved')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Site Settings (Singleton row)
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default 'The Third Place',
  tagline text not null default 'Not Home. Not Work. Just Right.',
  phone text not null default '077 220 1989',
  whatsapp_number text not null default '94772201989',
  email text,
  address text not null default 'TRACE Expert City, Colombo 10, Sri Lanka',
  google_maps_embed_url text not null default 'https://www.google.com/maps?q=TRACE+Expert+City+Colombo+10+Sri+Lanka&output=embed',
  opening_hours jsonb not null default '[]'::jsonb,
  social_links jsonb not null default '{}'::jsonb,
  seo_title text not null default 'The Third Place — Coffee Shop & Community Space | TRACE Expert City, Colombo 10',
  seo_description text not null default 'Not Home. Not Work. Just Right. A welcoming specialty coffee shop and community space at TRACE Expert City, Colombo 10, Sri Lanka.',
  updated_at timestamptz not null default timezone('utc', now())
);

-- -----------------------------------------------------------------------------
-- 3. Indexes
-- -----------------------------------------------------------------------------
create index if not exists idx_menu_items_category on public.menu_items(category_id);
create index if not exists idx_menu_items_featured on public.menu_items(is_featured) where is_featured = true;
create index if not exists idx_events_date_status on public.events(event_date, status);
create index if not exists idx_events_published on public.events(is_published);
create index if not exists idx_gallery_category_order on public.gallery(category, display_order);
create index if not exists idx_enquiries_status_created on public.enquiries(status, created_at desc);

-- -----------------------------------------------------------------------------
-- 4. Triggers
-- -----------------------------------------------------------------------------
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles for each row execute function public.handle_updated_at();

drop trigger if exists trg_menu_categories_updated_at on public.menu_categories;
create trigger trg_menu_categories_updated_at before update on public.menu_categories for each row execute function public.handle_updated_at();

drop trigger if exists trg_menu_items_updated_at on public.menu_items;
create trigger trg_menu_items_updated_at before update on public.menu_items for each row execute function public.handle_updated_at();

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at before update on public.events for each row execute function public.handle_updated_at();

drop trigger if exists trg_gallery_updated_at on public.gallery;
create trigger trg_gallery_updated_at before update on public.gallery for each row execute function public.handle_updated_at();

drop trigger if exists trg_pages_updated_at on public.pages;
create trigger trg_pages_updated_at before update on public.pages for each row execute function public.handle_updated_at();

drop trigger if exists trg_enquiries_updated_at on public.enquiries;
create trigger trg_enquiries_updated_at before update on public.enquiries for each row execute function public.handle_updated_at();

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at before update on public.site_settings for each row execute function public.handle_updated_at();

-- Auto-create profile row when a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'staff')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 5. Row Level Security (RLS)
-- -----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.events enable row level security;
alter table public.gallery enable row level security;
alter table public.pages enable row level security;
alter table public.enquiries enable row level security;
alter table public.site_settings enable row level security;

-- Profiles: users can read own profile; admins can read/manage all
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "Admins can manage profiles" on public.profiles
  for all using (public.is_admin()) with check (public.is_admin());

-- Menu Categories: public read active, admin full CRUD
create policy "Public read active menu categories" on public.menu_categories
  for select using (is_active = true or public.is_admin());
create policy "Admins manage menu categories" on public.menu_categories
  for all using (public.is_admin()) with check (public.is_admin());

-- Menu Items: public read available, admin full CRUD
create policy "Public read available menu items" on public.menu_items
  for select using (is_available = true or public.is_admin());
create policy "Admins manage menu items" on public.menu_items
  for all using (public.is_admin()) with check (public.is_admin());

-- Events: public read published, admin full CRUD
create policy "Public read published events" on public.events
  for select using (is_published = true or public.is_admin());
create policy "Admins manage events" on public.events
  for all using (public.is_admin()) with check (public.is_admin());

-- Gallery: public read published, admin full CRUD
create policy "Public read published gallery" on public.gallery
  for select using (is_published = true or public.is_admin());
create policy "Admins manage gallery" on public.gallery
  for all using (public.is_admin()) with check (public.is_admin());

-- Pages: public read published, admin full CRUD
create policy "Public read published pages" on public.pages
  for select using (is_published = true or public.is_admin());
create policy "Admins manage pages" on public.pages
  for all using (public.is_admin()) with check (public.is_admin());

-- Enquiries: anyone can submit (insert), ONLY admins can read/update/delete
create policy "Public can submit enquiries" on public.enquiries
  for insert with check (true);
create policy "Admins manage enquiries" on public.enquiries
  for select using (public.is_admin());
create policy "Admins update enquiries" on public.enquiries
  for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins delete enquiries" on public.enquiries
  for delete using (public.is_admin());

-- Site Settings: public read, admin update
create policy "Public read site settings" on public.site_settings
  for select using (true);
create policy "Admins manage site settings" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. Initial Seed Data (Idempotent)
-- -----------------------------------------------------------------------------
insert into public.site_settings (site_name, tagline, phone, whatsapp_number, address)
select 'The Third Place', 'Not Home. Not Work. Just Right.', '077 220 1989', '94772201989', 'TRACE Expert City, Colombo 10, Sri Lanka'
where not exists (select 1 from public.site_settings);

insert into public.menu_categories (name, slug, description, display_order) values
  ('Hot Coffee', 'hot-coffee', 'Espresso classics and slow single-origin pours.', 1),
  ('Iced Coffee', 'iced-coffee', 'Chilled brews crafted for Colombo afternoons.', 2),
  ('Tea', 'tea', 'Ceylon single-estate teas, chai, and ceremonial matcha.', 3),
  ('Other Beverages', 'other-beverages', 'Botanical spritzers, hot chocolate, and house coolers.', 4),
  ('Food and Bakes', 'food-and-bakes', 'Warm sourdough tartines, pastries, and café plates.', 5),
  ('Special Items', 'special-items', 'Seasonal signatures and limited-batch creations.', 6)
on conflict (slug) do nothing;

insert into public.pages (slug, title, subtitle, body, content) values
  (
    'home',
    'Not Home. Not Work. Just Right.',
    'A warm specialty coffee shop and community space at TRACE Expert City, Colombo 10.',
    'Your welcoming third place in the heart of Colombo—crafted for slow coffee, real conversation, creative focus, books, board games, and community gatherings.',
    '{"promoBanner":"Located at TRACE Expert City, Colombo 10"}'::jsonb
  ),
  (
    'story',
    'The Philosophy of a Third Place',
    'First place: Home. Second place: Work. Third place: Where community comes alive.',
    'Sociologist Ray Oldenburg coined the term third place to describe the social anchor outside home and work. At TRACE Expert City in Colombo 10, we built The Third Place as an urban botanical sanctuary where founders, readers, creatives, and friends can pause, sip great coffee, and belong.'
  ),
  (
    'space',
    'Designed for Lingering',
    'Warm timber, natural light, quiet reading nooks, and open tables at TRACE Expert City.',
    'Whether you need a calm desk for morning deep work, a long walnut table for a team brainstorm, or armchairs for an evening board game session, every corner of The Third Place adapts to your rhythm.'
  ),
  (
    'community',
    'Chat, Connect & Collaborate',
    'Real conversations in the heart of Colombo.',
    'Great cities thrive on spaces where strangers can become collaborators and friends can meet without rushing. From casual coffee catch-ups to community workshops, connection is at the heart of everything we do.'
  )
on conflict (slug) do nothing;
