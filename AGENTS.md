# SLOWHRS Project Rules — for all AI agents

## Project
Next.js App Router. Components in `src/components/`. Routes in `app/`.
Assets in `public/assets/{logos,widgets,icons,characters,videos,events,drops,media}`.
Deployed at https://slowhrs.com via Vercel.

## Brand register
Editorial fashion society. Los Angeles. Private. Premium first, playful never.
References: Slam Jam, Mubi, Boiler Room, Phoebe Philo. NEVER: arcade game, hacker LARP, crypto.

## Sticker budget (HARD CAP)
≤ 10 visible pixel asset instances on the page at any scroll position.
Allowed: logo_main (×4), press_start, Onthelist, members_first, gone, locked, Access, TheListkeeper, vhscam_live. That's it.
Forbidden in current page: cart, heart_full, heart_empty, CD, slowhrs_folder, archive_pixel_border, savedisk.
Conditionally allowed: slowhrs_ticket — ONLY in AccessSection success state, never elsewhere.

## Forbidden copy patterns
- Sci-fi system labels: "SYS_", "SYSTEM BOOT", "SYS_VERSION", "[CAM 01]"
- Hacker-LARP: "[REC_FILE]", "[DATA_RESTRICTED]", ".dat" filenames, fake file sizes ("45MB"), "DECRYPT", "SECURE TRANSMISSION", "SIGNAL ACTIVE", "TRANSMISSION_LOG"
- Game-UI: "HP:", "FILE_#", inventory labels, "PRESS START" outside the loader
- Vague commerce: "PRICE TBA", "NO ITEMS"
- Repeated formula headlines: "The X Moves Y" (max 2 across the site)

## Asset reference map
Use these exact paths:
- /assets/events/block_party.mp4 (NOT /assets/media/...)
- /assets/drops/fast_life_reel.mp4 (substitute for the missing /assets/media/Clothing_reel.mp4)
- /assets/events/destroy_lonely.mp4
- /assets/events/newyears.mp4
- /assets/videos/hero-recap.mp4 (lobby only, do not duplicate)

## When in doubt
Cut. Never add a pixel asset to a section that didn't have one in the budget table.
The user's words: "i dont like how it look so goofy." That bar holds.
