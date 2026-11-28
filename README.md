# The Third Place — Coffee Shop & Community Space

> **"Not Home. Not Work. Just Right."**  
> TRACE Expert City, Colombo 10, Sri Lanka · Phone/WhatsApp: `077 220 1989`

A full-stack Next.js (JavaScript, App Router) application powering both the public website and secure admin dashboard for **The Third Place**, integrated with **Supabase** (PostgreSQL, Auth, Row Level Security) and **Cloudinary** (organized responsive image hosting).

---

## Tech Stack
- **Framework:** Next.js 16 (JavaScript, App Router, Server Components, Server Actions, Proxy)
- **Styling:** Tailwind CSS v4 + Centralized Brand Design System (`src/styles/tokens.css`)
- **Database & Auth:** Supabase PostgreSQL + `@supabase/ssr` + Row Level Security
- **Media:** Cloudinary (`the-third-place/{branding,coffee,beverages,food,cafe-interior,events,community,gallery}`)
- **Validation & Forms:** React Hook Form + Zod
- **Motion & Icons:** `motion/react` (reduced-motion aware) + `lucide-react`

---

## Brand System
- **Primary Green:** `#1E5D54`
- **Cream:** `#F1EBDE`
- **Coffee Brown:** `#3A2A14`
- **Terracotta:** `#A95F32`
- **Typography:** Arsenica (editorial headings, mapped to Cormorant Garamond until licensed `.woff2` files are placed in `public/fonts/`) & Poppins (body, nav, buttons, UI).
- **Official Logo:** Place your official SVG/PNG brand kit file at `public/logo/the-third-place-logo.svg`.

---

## Setup & Deployment

### 1. Environment Variables
Copy `.env.example` to `.env.local` and fill in your credentials:
```bash
cp .env.example .env.local
```

### 2. Supabase Database Migration
1. Open your Supabase project's **SQL Editor**.
2. Run [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql) to create all 8 tables (`profiles`, `menu_categories`, `menu_items`, `events`, `gallery`, `pages`, `enquiries`, `site_settings`), indexes, triggers, RLS policies, and seed data.
3. Create an admin user in **Supabase Auth → Users**, then promote that user in SQL:
```sql
update public.profiles set role = 'admin' where email = 'your-admin@example.com';
```

### 3. Run Locally
```bash
npm install
npm run dev
```
- Public website: `http://localhost:3000`
- Admin dashboard: `http://localhost:3000/admin`

### 4. Deploy to Vercel
1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Add all variables from `.env.example` in **Vercel → Project Settings → Environment Variables**.
4. Deploy.
