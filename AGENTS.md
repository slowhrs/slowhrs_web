# SLOWHRS Project Rules — for all AI agents

## Project
Next.js 15 App Router. Components in `src/components/`. Routes in `app/`.
Backend: Supabase Auth + Postgres. Email: Resend. Ticketing: Partiful (external).
Deployed at https://slowhrs.com via Vercel.

## Brand voice
SLOWHRS = private creative society in Los Angeles.
Voice: observational, slightly cool, written by someone who's been in the room.
NEVER: AI fortune-cookie lines, "drop alert," sci-fi system labels, hacker-LARP, crypto-bro,
direct "for women" copy on public pages, emojis, title-case headlines, apostrophe-stuffed taglines.

## Visual rules
- Black + red dominant. Cream on /drops + /news only. Rose accent on /membership only.
- Fonts: Cormorant italic, Playfair Display italic 800, Courier Prime. NO VT323 / pixel display.
- Stickers: max 8 visible at any scroll. Budget defined in v2 build prompt.
- Headlines lowercase. Body lowercase except proper nouns.
- VHS REC dot, scanlines, timecode → cinema entry only, never persistent.

## Routes (5 public + admin)
/ /events /drops /news /inquire /membership (+ /membership/dashboard) (+ /admin/*)
NO /services. NO price tier page anywhere.

## Tier system
01 the line  → 0 hearts, signed up
02 the room  → 1+ hearts (1 event)
03 the regular → 3+ hearts
04 the inner room → 5 hearts AND is_contributor flag
05 the architects → invitation only (is_architect flag)
Hearts capped at 5. Auto-recompute via Postgres trigger on attendance change.

## Backend rules
- service_role key NEVER in client components or page.tsx
- All admin/write ops via Server Actions ('use server')
- Public can: insert applications, insert inquiries, read public events
- Authenticated members: read own member row + own attendances
- All other reads/writes via service_role server-side only

## Asset paths (do not invent new ones)
- /assets/events/{block_party,destroy_lonely,newyears}.mp4
- /assets/drops/fast_life_reel.mp4
- /assets/videos/hero-recap.mp4
- /assets/logos/logo_main.png
- /assets/logos/slowhrs-cursive.png
- /assets/characters/TheListkeeper.png
- /assets/widgets/{Onthelist,members_first,gone,locked,keycard-chip}.png
- /assets/icons/vhscam_live.png

## Partiful integration
- Pull events via Open Graph metadata fetch (NOT API, NOT scraper)
- Admin pastes URL → server fetches og: tags → inserts into events table
- Public site reads from Supabase events table

## When in doubt
Cut. Editorial first. Never add a pixel sticker beyond budget.
The user said "i dont like how it look so goofy" and "the copy is just ass."
Hold those bars.
