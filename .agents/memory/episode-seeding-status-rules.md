---
name: Episode seeding status rules
description: How seed-episodes.ts assigns DB status to episodes based on workbook content and existing DB state.
---

## Rule

When seeding episodes from the master workbook, `scripts/src/seed-episodes.ts` applies these status rules:

- Episodes 1–50 already in the DB keep their existing status if it is `published` or `scheduled`. Their post dates and `scheduledPublishAt` are also preserved so re-seeding does not wipe real publishing history.
- Episodes 51–65 are always set to `approved` (user directive), and their `scheduledPublishAt` is cleared because they are no longer scheduled.
- Episodes 66–100 are always set to `scripted`.
- Test episodes (998, 999) remain `approved`.

## Why

The workbook only marks episodes as "Scripted — ready to build", but the user wants the 51–65 batch queued for approval and the 66–100 batch kept as raw scripts for later production. This avoids every new episode entering the building pipeline at once and preserves the real YouTube publishing history for episodes 1–50.

## How to apply

When re-seeding from a new workbook, update the status override logic in `scripts/src/seed-episodes.ts` if the batch ranges change. Always preserve `published`/`scheduled` status for episodes that are already live in the pipeline, and never silently overwrite `youtubeVideoId` or `publishedAt` for published episodes.
