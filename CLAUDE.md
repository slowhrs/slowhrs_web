# CLAUDE.md — SLOWHRS Technical Specification

> Standalone context file. All coding agents must read this before touching any file.
> Last audited: 2026-05-16. Source of truth for architecture, rules, and pending work.

---

## 1. CORE TECH STACK

### Framework & Runtime

| Layer | Tech | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.4 |
| React | React + ReactDOM | 19.2.4 |
| Styling | Tailwind CSS v4 + vanilla CSS | ^4 |
| Animation | GSAP + `@gsap/react` + Framer `motion` | 3.15 / 12.38 |
| Smooth scroll | Lenis | 1.3.23 |
| Validation | Zod | 4.4.3 |
| Database | Supabase (`@supabase/supabase-js` + `@supabase/ssr`) | 2.105 / 0.10 |
| Email | Resend | 6.12.3 |
| Payments | Stripe | 22.1.1 |
| Deploy | Vercel | — |

### Visual Identity

- **Palette**: `--bg: #050505`, `--ink: #ededeb`, `--red: #e60016`. Black + red dominant. Cream accent on `/drops` + `/news` only. Rose accent on `/membership` only.
- **Fonts**: Cormorant Garamond (italic, 300/400/600), Courier Prime (mono), system sans-serif. **NO** VT323 / pixel display fonts.
- **Texture**: Film grain overlay (`overlay-grain`, SVG feTurbulence, 6% opacity), scanline overlay (`overlay-scan`, 12% opacity). Both `position:fixed; pointer-events:none`.
- **Motion**: Scroll reveal system (`.reveal` / `.reveal-left` + `.visible`), staggered delays `.reveal-d1` through `.reveal-d5`, ticker animation (50s linear infinite), blink/flicker keyframes, CTA breathe pulse, click burst effect.
- **Aesthetic**: Y2K dark minimalist. VHS REC dot + timecode only in `CinemaEntry.tsx`, never persistent. Headlines lowercase. Body lowercase except proper nouns. Max 8 pixel stickers visible at any scroll position.
- **Reduced motion**: Full `prefers-reduced-motion` support — kills all animation, grain, scanlines.

### Design Tokens (CSS Custom Properties in `app/globals.css`)

```
--bg, --bg-2, --ink, --ink-dim, --ink-faint
--red, --red-bright, --red-deep, --red-dim
--asphalt, --asphalt-2, --border, --border-2
--mono, --serif, --sans
```

Tailwind theme bridge in `@theme {}` block maps to `--color-brand-*` and `--font-*`.

---

## 2. BACKEND & DATA ARCHITECTURE

### Environment Variables (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=       # NEVER in client code
SUPABASE_JWT_SECRET=
RESEND_API_KEY=
RESEND_FROM_EMAIL=               # default: onboarding@resend.dev
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
ADMIN_PASSWORD=                  # password-gated admin panel
NEXT_PUBLIC_SITE_URL=https://slowhrs.com
INQUIRY_EMAIL_TO=                # default: hello@slowhrs.com
```

### Supabase Clients (3 tiers)

| File | Import | Use case | RLS |
|---|---|---|---|
| `src/lib/supabase/client.ts` | `createBrowserClient()` | Client components | Yes (anon key) |
| `src/lib/supabase/server.ts` | `createServerClient()` | Server Components, cookie-aware | Yes (anon key) |
| `src/lib/supabase/admin.ts` | `createAdminClient()` | Server Actions + API routes ONLY | Bypassed (service_role) |

**RULE**: `createAdminClient()` may ONLY be imported in files with `'use server'` directive or files inside `app/api/`. Never in `page.tsx` or client components.

### Database Schema (7 tables + `orders` pending)

#### `applications`
```sql
id UUID PK, created_at, email UNIQUE, full_name, instagram,
city DEFAULT 'Los Angeles', what_you_do, why_apply,
status CHECK ('pending','approved','denied'), reviewed_at, user_id FK→auth.users
```

#### `members`
```sql
user_id UUID PK FK→auth.users, application_id, full_name, instagram, city,
member_number INTEGER GENERATED ALWAYS AS IDENTITY,
hearts INTEGER DEFAULT 0, is_contributor BOOLEAN, is_architect BOOLEAN, joined_at
```

#### `events`
```sql
id UUID PK, created_at, name, date TIMESTAMPTZ, location, blurb,
partiful_url UNIQUE, cover_image, cover_video,
produced_by_slowhrs BOOLEAN, is_public BOOLEAN, is_upcoming BOOLEAN
```

#### `attendances`
```sql
id UUID PK, member_id FK→members, event_id FK→events, marked_at,
UNIQUE(member_id, event_id)
```

#### `broadcasts`
```sql
id UUID PK, created_at, subject, body,
recipient_tier CHECK ('all','room+','regular+','inner+','architects'),
sent_at, sent_count
```

#### `inquiries`
```sql
id UUID PK, created_at, category, name, email, instagram, details,
status CHECK ('new','replied','closed')
```
**NOTE**: Column is `details`, NOT `message`. No `date_or_project` column.

#### `chat_messages`
```sql
id UUID PK, created_at, user_id FK→auth.users, member_name, instagram,
content CHECK(char_length<=500),
channel CHECK ('general','the-room','inner-room','architects'),
is_pinned, pinned_at, is_deleted
```
Indexes on `(channel, created_at DESC)` and `(channel, is_pinned)`. Realtime enabled.

#### `orders` (referenced in webhook but NOT in migration — needs creation)
```sql
-- PENDING: create this table
stripe_session_id, product_id, size, product_title,
customer_email, amount_cents, currency, status
```

### Triggers

- `trigger_attendance_hearts`: After INSERT/DELETE on `attendances` → recalculates `members.hearts` via `recompute_member_hearts()`, capped at 5.

### Row Level Security (RLS) — All tables enabled

| Policy | Table | Operation | Who |
|---|---|---|---|
| `anon_insert_applications` | applications | INSERT | anon + authenticated |
| `anon_insert_inquiries` | inquiries | INSERT | anon + authenticated |
| `public_read_public_events` | events | SELECT | anon + authenticated (where `is_public=true`) |
| `member_read_own` | members | SELECT | authenticated (own row) |
| `member_read_own_attendances` | attendances | SELECT | authenticated (own row) |
| `members_read_chat` | chat_messages | SELECT | authenticated (where `is_deleted=false`) |
| `members_insert_chat` | chat_messages | INSERT | authenticated (own `user_id`) |
| `members_delete_own_chat` | chat_messages | UPDATE | authenticated (soft-delete own) |

All admin/write operations bypass RLS via `SUPABASE_SERVICE_ROLE_KEY` server-side.

### Tier System

| # | Name | Hearts | Flag |
|---|---|---|---|
| 01 | the line | 0 | — |
| 02 | the room | 1+ | — |
| 03 | the regular | 3+ | — |
| 04 | the inner room | 5 | `is_contributor=true` |
| 05 | the architects | — | `is_architect=true` (invite only) |

Logic in `src/lib/membership.ts` → `getTier()` and `nextTier()`.

---

## 3. INTEGRATIONS & AUTOMATION

### Resend Email Service (`src/lib/resend.ts`)

Lazy-initialized singleton. Falls back to mock logger if `RESEND_API_KEY` missing.

| Function | Trigger | Recipient |
|---|---|---|
| `sendApplicationReceipt()` | User submits application | Applicant |
| `sendApplicationNotification()` | User submits application | Owner (`INQUIRY_EMAIL_TO`) |
| `sendApprovalEmail()` | Admin approves | Applicant |
| `sendRejectionEmail()` / `sendDenial()` | Admin denies | Applicant |
| `sendInquiryNotification()` | User submits inquiry | Owner |
| `sendOrderNotification()` | Stripe webhook fires | Owner |
| `sendBroadcast()` | Admin sends broadcast | Batch (chunked 100) |

### Stripe Checkout Pipeline

1. User selects size → form POSTs to `POST /api/checkout`
2. Server validates product + size against `src/lib/data/drops.ts`
3. Creates `stripe.checkout.sessions.create()` with metadata `{product_id, size, drop_title}`
4. Redirects to Stripe hosted checkout
5. On success: Stripe fires `checkout.session.completed` → `POST /api/webhook/stripe`
6. Webhook writes to `orders` table + sends owner notification via Resend
7. **Fallback**: If Stripe not configured, redirects to inquiry form with product context

### Partiful Integration (`src/lib/partiful.ts`)

- Admin pastes Partiful URL → `fetchPartifulEvent()` fetches HTML, parses `og:title`, `og:description`, `og:image`
- Best-effort date regex from page body
- Inserts into `events` table. NOT a scraper — OG metadata fetch only.

### Admin Authentication

- Password-gated via `ADMIN_PASSWORD` env var
- HMAC-SHA256 hash stored in `sh_admin` cookie (httpOnly, secure, 7-day expiry)
- Middleware at `middleware.ts` (root) guards all `/admin/*` except `/admin/login`
- `src/lib/admin-auth.ts` handles `generateAdminHash()`, `verifyAdminAuth()`, `setAdminCookie()`, `clearAdminCookie()`

**NOTE**: There is a STALE duplicate middleware at `src/middleware.ts` using a different cookie name (`slowhrs_admin`) and simple string comparison. The ROOT `middleware.ts` is the active one.

### Webhook Targets (Future — Make.com)

Not yet wired. Planned routing:
- `applications.insert` → Make.com scenario → conditional delay (7 days) → auto-denial if no admin action
- `inquiries.insert` → Make.com → Slack/Discord notification
- `orders.insert` → Make.com → fulfillment pipeline
- Comms API targets: Resend (active), Twilio (planned for SMS), Meta (planned for IG DM)

---

## 4. PROJECT DIRECTORY TREE

```
slowhrs-app/
├── app/                          # Next.js App Router (routes)
│   ├── layout.tsx                # Root layout: fonts, overlays, schema.org
│   ├── page.tsx                  # Homepage: assembles all sections
│   ├── globals.css               # Design tokens, overlays, animations
│   ├── manifest.ts               # PWA manifest
│   ├── robots.ts                 # Robots.txt
│   ├── sitemap.ts                # Sitemap XML
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── login/                # Admin login page
│   │   ├── applications/         # Review applications
│   │   ├── inquiries/            # View inquiries
│   │   ├── members/              # Member management
│   │   ├── events/               # Event management
│   │   ├── attendance/           # Mark attendance
│   │   └── broadcasts/           # Email broadcasts
│   ├── api/
│   │   └── admin/
│   │       └── login/            # Admin login API
│   ├── community/                # Community page
│   ├── drops/                    # Drops/shop page
│   ├── events/                   # Events page
│   ├── inquire/                  # Inquiry form page
│   ├── membership/               # Membership application page
│   └── news/                     # News/transmissions page
│
├── src/
│   ├── components/               # All UI components
│   │   ├── AccessSection.tsx     # Membership application form
│   │   ├── ArchiveSection.tsx    # Photo archive grid
│   │   ├── CastingCalls.tsx      # Casting call cards
│   │   ├── CinemaEntry.tsx       # VHS-style intro overlay
│   │   ├── DropsSection.tsx      # Clothing drops grid
│   │   ├── EventPhotoCarousel.tsx# Carousel for event photos
│   │   ├── EventsSection.tsx     # Past events with video tiles
│   │   ├── Footer.tsx            # Footer (legacy)
│   │   ├── FooterSection.tsx     # Footer (active)
│   │   ├── GrainOverlay.tsx      # Grain overlay component
│   │   ├── HeroLobby.tsx         # Hero section with video
│   │   ├── HomepageHero.tsx      # Alternative hero (unused?)
│   │   ├── InquirySection.tsx    # Inquiry form section
│   │   ├── LazyVideo.tsx         # Lazy-loaded video component
│   │   ├── LenisProvider.tsx     # Lenis smooth scroll provider
│   │   ├── Loader.tsx            # Boot loader animation
│   │   ├── MouseCursor.tsx       # Custom cursor (disabled)
│   │   ├── Nav.tsx               # Navigation bar
│   │   ├── PersistentNav.tsx     # Sticky navigation variant
│   │   ├── PhotoCycle.tsx        # Photo cycling component
│   │   ├── ScrollReveal.tsx      # Scroll reveal wrapper
│   │   ├── ScrollRevealInit.tsx  # IO observer initializer
│   │   ├── SizePicker.tsx        # Size selector for drops
│   │   ├── StatusStrip.tsx       # Status indicator strip
│   │   ├── Ticker.tsx            # Scrolling ticker bar
│   │   ├── UpcomingEvents.tsx    # Upcoming event flyers
│   │   ├── UpdatesSection.tsx    # News/transmissions feed
│   │   ├── drops/
│   │   │   └── DropTile.tsx      # Individual drop card
│   │   ├── events/
│   │   │   └── EventTile.tsx     # Individual event card
│   │   └── news/
│   │       └── NewsItem.tsx      # Individual news item
│   │
│   ├── app/
│   │   ├── actions/              # Server Actions ('use server')
│   │   │   ├── apply.ts          # Submit membership application
│   │   │   ├── inquiry.ts        # Submit inquiry
│   │   │   ├── admin.ts          # Admin login/logout/review
│   │   │   ├── chat.ts           # Chat message actions
│   │   │   └── admin/
│   │   │       ├── approve.ts    # Approve/deny applications
│   │   │       ├── attendance.ts # Mark event attendance
│   │   │       ├── broadcast.ts  # Send email broadcasts
│   │   │       ├── contributor.ts# Toggle contributor flag
│   │   │       └── event.ts      # Create/edit events
│   │   ├── api/
│   │   │   ├── checkout/route.ts # Stripe checkout session
│   │   │   └── webhook/stripe/route.ts # Stripe webhook handler
│   │   └── order/success/        # Order success page
│   │
│   ├── lib/
│   │   ├── admin-auth.ts         # HMAC admin auth (Web Crypto)
│   │   ├── auth.ts               # Legacy auth helper (stale)
│   │   ├── constants.ts          # NAV_LINKS, SITE_META, ENTRY_VIDEOS, INQUIRY_CATEGORIES
│   │   ├── membership.ts         # Tier calculation logic
│   │   ├── partiful.ts           # Partiful OG metadata parser
│   │   ├── resend.ts             # Email service (all templates)
│   │   ├── data/
│   │   │   ├── casting.ts        # CastingCall[] — 5 calls
│   │   │   ├── drops.ts          # Drop[] — 9 products (Fast Life Collection)
│   │   │   ├── eventPhotos.ts    # EventPhotoSet[] — 4 sets
│   │   │   ├── flyers.ts         # Flyer[] — 3 upcoming
│   │   │   └── news.ts           # NewsItem[] — 7 transmissions
│   │   └── supabase/
│   │       ├── admin.ts          # Service role client (bypasses RLS)
│   │       ├── client.ts         # Browser client (anon key)
│   │       └── server.ts         # Server client (cookie-aware)
│   │
│   └── middleware.ts             # STALE — do not use. See root middleware.ts
│
├── middleware.ts                 # ACTIVE admin route guard
├── supabase/
│   ├── migrations/0001_initial.sql  # Base schema (6 tables)
│   └── RUN_THIS_IN_SUPABASE.sql    # Full schema (7 tables + RLS + realtime)
│
├── components/                   # LEGACY root components (stale copies)
│   ├── HeroLobby.tsx
│   └── StatusStrip.tsx
│
├── public/assets/
│   ├── casting/                  # Casting call flyer images
│   ├── characters/               # TheListkeeper.png
│   ├── drops/                    # Product videos + clothing/ subfolder
│   ├── events/                   # Event recap videos + photos/ subfolder
│   ├── flyers/                   # Upcoming event flyer images
│   ├── icons/                    # vhscam_live.png
│   ├── logos/                    # logo_main.png, slowhrs-cursive.png
│   ├── videos/                   # hero-recap.mp4
│   └── widgets/                  # Onthelist, members_first, gone, locked, keycard-chip .png
│
├── scripts/test-supabase.mjs     # DB connection test script
├── next.config.ts                # AVIF/WebP, security headers, asset caching
├── AGENTS.md                     # Project rules for AI agents
├── STRIPE_SETUP.md               # Stripe product + webhook setup guide
└── .env.local.example            # Environment variable template
```

---

## 5. PENDING TASKS & CRITICAL RULES

### Pending Milestones

| # | Task | Priority | Files Affected |
|---|---|---|---|
| 1 | **Create `orders` table in Supabase** — webhook writes to it but table doesn't exist in migrations | BLOCKER | `supabase/RUN_THIS_IN_SUPABASE.sql` |
| 2 | **Wire Stripe Price IDs** — all `stripe_price_id` fields in `drops.ts` are `null` | BLOCKER | `src/lib/data/drops.ts` |
| 3 | **Delete stale `src/middleware.ts`** — uses wrong cookie name `slowhrs_admin`, conflicts with root `middleware.ts` which uses `sh_admin` | HIGH | delete `src/middleware.ts` |
| 4 | **Delete stale `src/lib/auth.ts`** — legacy simple auth, replaced by `src/lib/admin-auth.ts` | HIGH | delete `src/lib/auth.ts` |
| 5 | **Delete stale `components/` root directory** — orphaned copies of HeroLobby + StatusStrip | HIGH | delete `components/` |
| 6 | **Fix `apply.ts` schema mismatch** — `.select('member_id')` on line 54 but `applications` table has no `member_id` column | HIGH | `src/app/actions/apply.ts` |
| 7 | **Fix `admin.ts` status mismatch** — checks `application.status !== 'tier_01'` but schema uses `'pending'` | HIGH | `src/app/actions/admin.ts` |
| 8 | **Video autoplay/loop audit** — all `<video>` tags must have `autoPlay muted loop playsInline` for mobile compatibility | MEDIUM | All components with `<video>` |
| 9 | **Preload critical assets** — hero video + logo should use `<link rel="preload">` in layout | MEDIUM | `app/layout.tsx` |
| 10 | **Wire Make.com webhooks** — Supabase → Make.com scenarios for application/inquiry/order automation | LOW | New webhook configs |
| 11 | **Twilio SMS integration** — application status change notifications | LOW | New `src/lib/twilio.ts` |
| 12 | **Meta IG DM integration** — casting call auto-responses | LOW | New service file |

### Critical Rules — DO NOT VIOLATE

1. **No file-overwrite loops**: Never replace an entire file to change a few lines. Use targeted edits. If Composer rewrites a file, diff it against `git show HEAD:<path>` before accepting.

2. **service_role key isolation**: `createAdminClient()` must ONLY appear in `'use server'` files or `app/api/` route handlers. A client component importing it is a security incident.

3. **No invented asset paths**: Only use paths listed in `AGENTS.md` asset section or confirmed in `public/assets/`. Do not fabricate filenames.

4. **Brand voice enforcement**: No AI fortune-cookie lines. No "drop alert". No sci-fi system labels. No hacker-LARP. No crypto-bro. No emojis. No title-case headlines. Headlines lowercase. Body lowercase except proper nouns.

5. **No new routes beyond the approved set**: `/ /events /drops /news /inquire /membership /community /admin/*`. NO `/services`. NO price tier page.

6. **Video elements**: Every `<video>` must include `autoPlay muted loop playsInline` attributes. Use `poster` attribute for first-frame fallback. Use `LazyVideo.tsx` wrapper for below-fold videos.

7. **Font discipline**: Cormorant Garamond (serif/italic), Courier Prime (mono), system sans. No other fonts. No VT323. No pixel display faces.

8. **Column name accuracy**: The inquiries table column is `details`, NOT `message`. The applications table has no `member_id` column. Always cross-reference `RUN_THIS_IN_SUPABASE.sql` before writing queries.

9. **Dual middleware danger**: Root `middleware.ts` is canonical (uses `sh_admin` cookie + HMAC). `src/middleware.ts` is stale and must be deleted. Do not modify `src/middleware.ts`.

10. **Build verification**: Run `next build` after any change batch. Do not push code that breaks the production build.

---

## 6. BRAND VOICE QUICK REFERENCE

```
GOOD: "we got your application. reviewing within 7 days."
BAD:  "🎉 Your application has been received! We'll get back to you ASAP!"

GOOD: "casting window open."
BAD:  "CASTING ALERT 🔥 Don't miss your chance to be part of something BIG!"

GOOD: "six pieces. three numbered. one sample that never prints again."
BAD:  "Introducing our EXCLUSIVE limited-edition drop — only available for a LIMITED TIME!"
```

Tone: observational, slightly cool, written by someone who's been in the room. Cut over add. Editorial over promotional.

---

## 7. NEXT.JS CONFIG NOTES

- `images.formats`: AVIF + WebP auto-conversion enabled
- `compress`: true
- `poweredByHeader`: false
- Security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1`, `Referrer-Policy: strict-origin-when-cross-origin`
- Static assets (`/assets/*`): `Cache-Control: public, max-age=31536000, immutable`
- Viewport locked: `maximumScale: 1` (prevents zoom on mobile inputs)
