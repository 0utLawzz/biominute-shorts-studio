# BioMinute Production Log

Persistent tracker for all BioMinute reel/short episodes. **Read this file before starting any new episode** — it holds status, timing/style decisions, and the queue so nothing is re-guessed from scratch.

> **Format note:** The generic video-js skill defaults to 16:9 widescreen motion pieces. **BioMinute is 9:16 vertical** (1080×1920 YouTube Shorts). Always keep the vertical aspect ratio in `artifacts/biominute-reels`.
>
> **Repo policy:** every completed episode's `episode.mp4` and `thumbnail.png` are committed to its `exports/Episode-NN-slug/` folder so the repo stays self-contained and portable across accounts. Re-importing into any Replit account should still show working video previews in `exports/dashboard.html`.

| Episode # | Title | Status | Date Completed | Export Folder | Notes |
|---|---|---|---|---|---|
| 1 | Walk After Meals | Complete | 2026-07-12 | `exports/Episode-01-Walk-After-Meals/` | Exported via `pnpm run export-video` (Playwright + ffmpeg pipeline) at verified 1080x1920. `episode.mp4` in place. `thumbnail.png` still pending — user provides separately. Durations: 4500/7000/4000/3000/5000/5000/4000ms. CTA: "Do you walk after meals, or sit right down?" |
| 2 | Drink Water Before Your Morning Coffee | Complete | 2026-07-13 | `exports/Episode-02-drink-water-before-your-morning/` | Rebuilt 2026-07-13: Scene1 replaced (was stale EP5 sleep content); config.ts updated with EP2 durations (4500/7000/6000/5000/6500/6000ms = 35s). Scene0,2,3,4,5 were already correct EP2 content. CTA: "Do you reach for water or coffee first thing?" |
| 3 | Are You Eating Protein at the Wrong Time? | Complete | 2026-07-13 | `exports/Episode-03-are-you-eating-protein-at/` | Exported at 1080x1920 (37.8s). 5 scenes + 2s thumbnail end card. Durations: 4500/7000/6000/5000/6500/2000ms. CTA: "Which meal has the most protein for you right now?" Export script now reads duration from config.ts as fallback + runs headless Chromium. Pushed to GitHub on 2026-07-13. |
| 4 | Is 10,000 Steps Actually a Myth? | Complete | 2026-07-13 | `exports/Episode-04-is-10-000-steps-actually/` | Exported at 1080x1920 (41.2s). Durations: 4500/4500/7000/5000/6500/5000ms (6 scenes). CTA: "How many steps do you average each day?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 5 | Why Sleep Matters More Than You Think | Complete | 2026-07-13 | `exports/Episode-05-why-sleep-matters-more-than/` | Exported at 1080x1920 (39.8s). Durations: 2500/6500/6500/4000/6500/5000ms (6 scenes). CTA: "What time did you go to bed last night?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 6 | Why Are You Still Hungry Right After Eating? | Complete | 2026-07-13 | `exports/Episode-06-why-are-you-still-hungry-right/` | Exported at 1080x1920 (41.0s). Durations: 3000/6500/6500/5000/6500/5000ms (6 scenes). CTA: "What food keeps you full the longest?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 7 | How Deep Breathing Reduces Stress | Complete | 2026-07-13 | `exports/Episode-07-how-deep-breathing-reduces-stress/` | Exported at 1080x1920 (42.3s). Durations: 3000/6000/6500/6500/5000/5000ms (6 scenes). CTA: "Try it now: in for 4, out for 6. How do you feel?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 8 | Does Drinking Water Really Boost Metabolism? | Complete | 2026-07-13 | `exports/Episode-08-does-drinking-water-really-boost/` | Exported at 1080x1920 (38.5s). Durations: 3000/6000/5000/6000/5000/5000ms (6 scenes). CTA: "How much water do you drink in a day?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 9 | Morning Sunlight for Better Sleep | Complete | 2026-07-13 | `exports/Episode-09-morning-sunlight-for-better-sleep/` | Exported at 1080x1920 (39.8s). Durations: 3000/6000/6500/5000/5000/5000ms (6 scenes). CTA: "Do you get outside in the first hour after waking?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 10 | Can You Build Muscle Without Supplements? | Complete | 2026-07-13 | `exports/Episode-10-can-you-build-muscle-without/` | Exported at 1080x1920 (37.9s). Durations: 2500/4000/6500/5000/5000/5000ms (6 scenes). CTA: "Food first or protein shakes, which do you prefer?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 11 | Are Healthy Snacks Secretly Making You Gain Weight? | Complete | 2026-07-14 | `exports/Episode-11-are-healthy-snacks-secretly-making/` | Exported at 1080x1920 (35.5s). Durations: 4500/7000/6500/6000/6500/5000ms (6 scenes). CTA: "What's your favorite healthy snack?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 12 | Sitting Too Long Harms Your Body | Complete | 2026-07-14 | `exports/Episode-12-sitting-too-long-harms-your/` | Exported at 1080x1920 (35.5s). Durations: 4500/7000/6500/6000/6500/5000ms (6 scenes). CTA: "How many hours are you sitting right now?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 13 | Is Breakfast Really the Most Important Meal? | Complete | 2026-07-14 | `exports/Episode-13-is-breakfast-really-the-most/` | Exported at 1080x1920 (35.5s). Durations: 4500/7000/6500/6000/6500/5000ms (6 scenes). CTA: "Breakfast every day, or do you skip it?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 14 | Do You Really Need 8 Glasses of Water a Day? | Complete | 2026-07-14 | `exports/Episode-14-do-you-really-need-8/` | Exported at 1080x1920 (36.5s). Durations: 4500/7000/6500/6500/7000/5000ms (6 scenes). CTA: "What's your hydration check today? 😅" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 15 | Does Eating Late at Night Cause Weight Gain? | Complete | 2026-07-14 | `exports/Episode-15-does-eating-late-at-night/` | Exported at 1080x1920 (35.5s). Durations: 4500/7000/6500/6000/6500/5000ms (6 scenes). CTA: "Are you a morning eater or a late-night snacker?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 16 | Can You Lose Belly Fat with Ab Exercises? | Complete | 2026-07-14 | `exports/Episode-16-can-you-lose-belly-fat/` | Exported at 1080x1920 (35.5s). Durations: 4500/7000/6500/6000/6500/5000ms (6 scenes). CTA: "Which exercise do you enjoy the most?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 17 | What's the Best Food to Eat Before a Workout? | Complete | 2026-07-14 | `exports/Episode-17-whats-the-best-food-to/` | Exported at 1080x1920 (35.5s). Durations: 4500/7000/6500/6000/6500/5000ms (6 scenes). CTA: "What's your go-to pre-workout snack?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 18 | Does More Sweat Mean More Fat Burned? | Complete | 2026-07-14 | `exports/Episode-18-does-more-sweat-mean-more/` | Exported at 1080x1920 (35.5s). Durations: 4500/7000/6500/6000/6500/5000ms (6 scenes). CTA: "Did this myth surprise you?" Exported with Playwright + ffmpeg pipeline; includes background music. |
| 19 | Can You Lose Fat Without Doing Cardio? | Uncomplete | — | `exports/Episode-19-can-you-lose-fat-without/` | Planned post date: Fri, Aug 21, 2026 |
| 20 | How Much Protein Do You Really Need? | Uncomplete | — | `exports/Episode-20-how-much-protein-do-you/` | Planned post date: Mon, Aug 24, 2026 |
| 21 | Does Lifting Weights Make Women Bulky? | Uncomplete | — | `exports/Episode-21-does-lifting-weights-make-women/` | Planned post date: Wed, Aug 26, 2026 |
| 22 | Is Creatine Safe? | Uncomplete | — | `exports/Episode-22-is-creatine-safe/` | Planned post date: Fri, Aug 28, 2026 |
| 23 | Why Is Sleep Secretly Affecting Your Fitness? | Uncomplete | — | `exports/Episode-23-why-is-sleep-secretly-affecting/` | Planned post date: Mon, Aug 31, 2026 |
| 24 | Is Stretching Before Exercise Enough? | Uncomplete | — | `exports/Episode-24-is-stretching-before-exercise-enough/` | Planned post date: Wed, Sep 2, 2026 |
| 25 | Can You Turn Fat Into Muscle? | Uncomplete | — | `exports/Episode-25-can-you-turn-fat-into/` | Planned post date: Fri, Sep 4, 2026 |
| 26 | Should You Work Out Every Day? | Uncomplete | — | `exports/Episode-26-should-you-work-out-every/` | Planned post date: Mon, Sep 7, 2026 |
| 27 | Why Does Your Weight Change Overnight? | Uncomplete | — | `exports/Episode-27-why-does-your-weight-change/` | Planned post date: Wed, Sep 9, 2026 |
| 28 | Can Your Metabolism Be "Broken"? | Uncomplete | — | `exports/Episode-28-can-your-metabolism-be-broken/` | Planned post date: Fri, Sep 11, 2026 |
| 29 | Are Eggs Actually Bad for Your Heart? | Uncomplete | — | `exports/Episode-29-are-eggs-actually-bad-for/` | Planned post date: Mon, Sep 14, 2026 |
| 30 | Do Detox Drinks Really Clean Your Body? | Uncomplete | — | `exports/Episode-30-do-detox-drinks-really-clean/` | Planned post date: Wed, Sep 16, 2026 |
| 31 | Should You Eat Before or After a Workout? | Uncomplete | — | `exports/Episode-31-should-you-eat-before-or/` | Planned post date: Fri, Sep 18, 2026 |
| 32 | Does Coffee Help You Burn Fat? | Uncomplete | — | `exports/Episode-32-does-coffee-help-you-burn/` | Planned post date: Mon, Sep 21, 2026 |
| 33 | What's the Healthiest Cooking Oil? | Uncomplete | — | `exports/Episode-33-whats-the-healthiest-cooking-oil/` | Planned post date: Wed, Sep 23, 2026 |
| 34 | Is Walking Enough to Stay Healthy? | Uncomplete | — | `exports/Episode-34-is-walking-enough-to-stay/` | Planned post date: Fri, Sep 25, 2026 |
| 35 | What's the Biggest Nutrition Mistake After Age 40? | Uncomplete | — | `exports/Episode-35-whats-the-biggest-nutrition-mistake/` | Planned post date: Mon, Sep 28, 2026 |
| 36 | What's the #1 Habit That Improves Your Health? | Uncomplete | — | `exports/Episode-36-whats-the-1-habit-that/` | Planned post date: Wed, Sep 30, 2026 |

## Style & timing decisions log

Record exact constants and creative choices here so future episodes don't drift. **Re-use these values unless the master plan explicitly calls for a different treatment.**

### Episode 5 ("Why Sleep Matters More Than You Think") — current canonical template

- **Format:** 9:16 vertical, 1080×1920 target. No 16:9 scene compositions.
- **Scene durations (ms):** `0: 4500`, `1: 9000`, `2: 8000`, `3: 5500`, `4: 7500`, `5: 6000`. Total loop ≈ **40.5s**.
- **Scene transition:** 0.8s fade/blur exit with slight scale-up (`exit={{ opacity: 0, filter: 'blur(10px)', scale: 1.1 }}`).
- **Framer Motion springs:**
  - `SPRING_SNAPPY` = `{ type: 'spring', stiffness: 400, damping: 30 }` — for logo pops, badges, icons, CTAs.
  - `SPRING_SMOOTH` = `{ type: 'spring', stiffness: 120, damping: 25 }` — for headlines, text blocks, larger panels.
- **Intra-scene pacing:** first beat fires at 0.8–1.0s, subsequent beats every 1.5–1.6s, final beat reserved for citation or CTA.
- **Typography:** `Outfit` for display/headlines, `Plus Jakarta Sans` for body. Display headline sizes scale by `vh` units (e.g. `5.5vh` for main hook, `2.5vh` for badges).
- **Color lock:** navy `#0F172A`, teal `#14b8a6`, emerald `#10b981`, orange `#f97316`, blue `#2F6FED`. No red.
- **Audio:** background music at `volume: 0.35`, scene-change SFX at `volume: 0.6`, preview starts muted, export path forced unmuted.
- **Citation treatment:** small, low-contrast text appears in the final 1–2s of a scene, not a full-screen card.
- **Outro:** BioMinute logo + gradient wordmark + CTA line, no clickable buttons.

### Decisions to log as new episodes are built

- Any deviation from the durations above.
- Any new spring/transition values or custom easing curves.
- New recurring components (e.g. "stat card", "progress bar", "citation chip") so they can be reused consistently.
- Color/icon changes that become part of the brand language.

## Brand reference
- Logo/banner theme: dark navy/slate background (#0F172A-ish), teal-to-emerald gradient wordmark ("BioMinute"), DNA-helix + heartbeat-pulse motif, small orange accent dot. Never use red.
- Thumbnail spec (from master plan): 1080x1920 vertical, dark slate bg (#0F172A), bold white headline, one keyword highlighted in emerald (#10B981) or orange (#F97316), one simple rounded flat icon, soft blue (#2F6FED) gradient glow, Kurzgesagt-inspired flat design, generous negative space, no stock photos.

## Full source data
- Full spreadsheet with scripts, visual direction, citations, descriptions, hashtags, CTAs, and thumbnail prompts for every episode: `attached_assets/BioMinute-Episode-Master-Plan_1783643847514.xlsx` (sheet "Content_Master"). Re-read this sheet's row for an episode's exact script/citation before producing — do not rely on the title alone.
