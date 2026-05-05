# AGENTS.md — SLOWHRS v2.0

## Brand

SLOWHRS is a private creative society in Los Angeles built around fashion, film, nightlife, and member access. The site is an immersive, art-first web experience — a building with five rooms.

## Architecture

```
/                  → Threshold (interactive entry — "what time is it")
/events            → Cinema room (event recaps, nightlife, documented rooms)
/drops             → Showroom (member-first clothing drops)
/inquiries         → Direct line (production, event, collab, casting requests)
/news              → Feed (recaps, announcements, proof the room happened)
/membership        → The card (heart-meter system, application, tier progression)
```

## Threshold Logic

| Answer        | Routes to    |
|---------------|-------------|
| `late`        | `/events`   |
| `early`       | `/drops`    |
| `i don't know`| `/news`    |

Stored in `localStorage` key: `slowhrs_entry`. Return visitors get a greeting and skip the question.

## Pixel Asset Budget (6 max)

| Asset | Where |
|---|---|
| `logo_main.png` | Threshold, nav, footer |
| `gone.png` | Sold-out drop cards only |
| `members_first.png` | One priority drop card |
| `TheListkeeper.png` | `/events`, ambient bottom-right, half-cropped |
| `Onthelist.png` | Beneath Listkeeper, one instance |
| CSS dot+ring cursor | Custom cursor, desktop only |

## Forbidden Assets

Never reference in JSX: `press_start`, `Access.png`, `locked.png`, `vhscam_live`, `cart.png`, `heart_full`, `heart_empty`, `CD.png`, `slowhrs_folder`, `archive_pixel_border`, `savedisk`, `slowhrs_ticket`, `be-camera-ready`, `no-energy-no-entry`, `waitlist`, `keycard-chip`, `files-tab`, `approved.png`, `click-burst`, `red_explode`.

## Forbidden Copy

Never use in any copy:
`SYS_099`, `SYS_VERSION`, `SYSTEM BOOT_`, `END OF TAPE`, `DECRYPT FULL`, `SECURE TRANSMISSION`, `SIGNAL ACTIVE`, `TRANSMISSION_LOG`, `FILE_04: LISTKEEPER`, `HP: 66`, `PRICE TBA`, `NO ITEMS`, `NO FOOTAGE`, `[REC_FILE]`, `[DATA_RESTRICTED]`, `[CAM 01]`, `PRESS START`, `TERMINAL FEED`, `MEMBER EXCLUSIVE`, `ARCHIVE PROCESSING`, `CAMERA READY ONLY`.

Never use words: `transmission`, `signal`, `terminal`, `channel`, `decrypt`.

Only fake-tech words allowed: `live`, `loading`, `gone` (all literal, not metaphor).

## Voice Rules

- Hero lines: lowercase italic Cormorant Garamond
- Labels and metadata: mono uppercase Courier Prime
- Never invent system-LARP text
- Never use emoji
- No NYC. SLOWHRS is Los Angeles.

## Animation Libraries

| Library | Purpose |
|---|---|
| GSAP 3 + ScrollTrigger | Entry sequence, scroll-pinned moments, text reveals, card breathing |
| Motion (Framer Motion) | Component animations: hovers, form states, page transitions, layoutId |
| Lenis | Smooth scroll desktop only (disabled on mobile) |

## Performance

- Lighthouse Performance ≥ 90 mobile
- LCP < 2.5s
- All animations gate on `prefers-reduced-motion: no-preference`
- Videos: `preload="metadata"`, lazy via IntersectionObserver
- Pixel PNGs: max 64px via `next/image` with `unoptimized`, `image-rendering: pixelated`

## Data Layer

- `src/lib/membership.ts` — mock member data, swappable with Posh later
- `src/lib/events.ts` — event data with real video paths
- `src/lib/drops.ts` — product data
- `src/lib/news.ts` — feed entries
- `src/lib/constants.ts` — nav links, threshold answers, tier defs
