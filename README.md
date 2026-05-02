# Missing Link 🔗

> **Connecting youth to opportunity.** A structured opportunity discovery and distribution platform for jobs, internships, trainings, competitions, youth events, and sustainable development initiatives.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Backend / Auth | Supabase (PostgreSQL + Auth) |
| Data Fetching | TanStack Query v5 |
| Icons | Lucide React |

---

## Architecture Overview

```
missing-link/
├── supabase/
│   ├── migrations/
│   │   └── 001_schema.sql        ← Full schema, enums, triggers, RLS
│   └── seed.sql                  ← 5 sample opportunities
│
└── src/
    ├── app/
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   └── signup/page.tsx
    │   ├── browse/page.tsx
    │   ├── opportunity/[id]/page.tsx
    │   ├── saved/page.tsx
    │   ├── dashboard/
    │   │   ├── layout.tsx
    │   │   ├── page.tsx           ← Overview + stats
    │   │   ├── add/page.tsx
    │   │   └── manage/page.tsx
    │   ├── layout.tsx
    │   ├── page.tsx               ← Home / landing
    │   ├── globals.css
    │   └── providers.tsx          ← TanStack Query provider
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx
    │   │   └── Footer.tsx
    │   ├── opportunities/
    │   │   ├── OpportunityCard.tsx
    │   │   ├── OpportunityFilters.tsx
    │   │   └── OpportunityForm.tsx
    │   └── ui/
    │       ├── Badge.tsx
    │       └── LoadingSpinner.tsx
    │
    ├── hooks/
    │   ├── useAuth.ts             ← Session + profile state
    │   ├── useOpportunities.ts    ← TanStack Query read + mutation hooks
    │   └── useSaved.ts            ← Save / unsave hooks
    │
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts          ← Browser Supabase client
    │   │   └── server.ts          ← Server Supabase client (RSC + API routes)
    │   ├── queries/
    │   │   ├── opportunities.ts   ← Raw Supabase query functions
    │   │   └── saved.ts
    │   └── types.ts               ← All shared TypeScript types + label maps
    │
    └── middleware.ts              ← Auth guard + role-based redirects
```

---

## Database Schema

### Tables

**`profiles`**
```sql
id          UUID  PK (references auth.users)
full_name   TEXT  NOT NULL
role        ENUM  'user' | 'admin'   DEFAULT 'user'
created_at  TIMESTAMPTZ
```

**`opportunities`**
```sql
id                UUID  PK
title             TEXT  NOT NULL
description       TEXT  NOT NULL
opportunity_type  ENUM  job | internship | training | competition | youth_event
organization_type ENUM  company | ngo | university | government | startup
field             TEXT
country           TEXT
mode              ENUM  online | onsite | hybrid
job_time          ENUM  part-time | full-time  (nullable)
is_paid           BOOLEAN  DEFAULT false
organization      TEXT  NOT NULL
deadline          DATE
external_link     TEXT
is_featured       BOOLEAN  DEFAULT false
is_active         BOOLEAN  DEFAULT true
created_by        UUID  → profiles.id
created_at        TIMESTAMPTZ
updated_at        TIMESTAMPTZ  (auto-updated by trigger)
```

**`saved_opportunities`**
```sql
id              UUID  PK
user_id         UUID  → profiles.id
opportunity_id  UUID  → opportunities.id
created_at      TIMESTAMPTZ
UNIQUE(user_id, opportunity_id)
```

---

## Row Level Security Policies

| Table | Policy | Rule |
|---|---|---|
| `profiles` | SELECT own | `auth.uid() = id` |
| `profiles` | SELECT admin | role = 'admin' |
| `profiles` | UPDATE own/admin | own or role = 'admin' |
| `opportunities` | SELECT | `is_active = true` (public) |
| `opportunities` | SELECT | all rows for admins |
| `opportunities` | INSERT / UPDATE / DELETE | admin only |
| `saved_opportunities` | SELECT / INSERT / DELETE | own user only |

---

## Role-Based Access

| Action | User | Admin |
|---|---|---|
| Browse active opportunities | ✅ | ✅ |
| View opportunity detail | ✅ | ✅ |
| Save / unsave opportunities | ✅ | — |
| View /saved | ✅ | — |
| Access /dashboard | ❌ | ✅ |
| Add / edit / delete opportunities | ❌ | ✅ |
| Toggle is_active | ❌ | ✅ |

---

## Local Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New Project.

### 2. Run the migration

In **Supabase Dashboard → SQL Editor**, paste and run:

```
supabase/migrations/001_schema.sql
```

### 3. Clone and install

```bash
git clone <your-repo>
cd missing-link
npm install
```

### 4. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find these in: **Supabase Dashboard → Project Settings → API**.

### 5. Create your first admin user

**Option A — Supabase Dashboard:**
1. Go to **Authentication → Users → Invite user**
2. Sign them up via the app's `/signup` page
3. In SQL Editor, run:
```sql
UPDATE profiles SET role = 'admin' WHERE id = '<user-uuid>';
```

**Option B — Via SQL after signup:**
```sql
-- Find the user
SELECT id, full_name FROM profiles WHERE full_name ILIKE '%your name%';

-- Promote to admin
UPDATE profiles SET role = 'admin' WHERE id = '<uuid-here>';
```

### 6. Seed sample data

After creating an admin, run `supabase/seed.sql` in the SQL Editor.

### 7. Start development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (Vercel)

```bash
npx vercel
```

Set these environment variables in the Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Data Fetching Design

- All queries use **TanStack Query** with `staleTime: 0` — always fresh from Supabase.
- Every mutation invalidates the relevant query keys immediately.
- No mock data. Supabase is the single source of truth.
- Server components use `src/lib/supabase/server.ts`; client components use `src/lib/supabase/client.ts`.

---

## Pages Reference

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page with hero, categories, featured |
| `/browse` | Public | Full opportunity browser with filters |
| `/opportunity/[id]` | Public | Opportunity detail with save/apply |
| `/login` | Public (redirects if authed) | Sign in |
| `/signup` | Public (redirects if authed) | Create account |
| `/saved` | Protected (user) | Saved opportunities |
| `/dashboard` | Protected (admin) | Stats overview |
| `/dashboard/add` | Protected (admin) | Add opportunity form |
| `/dashboard/manage` | Protected (admin) | Edit / delete / toggle |

---

## Design System

**Colors:** Deep navy (`#080F1E` → `#253D69`) + Fresh green (`#22C55E` → `#4ADE80`)

**Typography:**
- Headings: [Syne](https://fonts.google.com/specimen/Syne) (display font — `font-display`)
- Body: [DM Sans](https://fonts.google.com/specimen/DM+Sans)

**Component classes (global):**
- `.card` — navy card with border
- `.btn-primary` — green CTA button
- `.btn-secondary` — muted secondary button
- `.btn-ghost` — text-only button
- `.btn-danger` — rose delete button
- `.input` — dark styled input
- `.label` — form field label
- `.page-container` — max-width centered layout
- `.section-title` — display heading

---

## License

MIT — built for youth empowerment. 🌱
