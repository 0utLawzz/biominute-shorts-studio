---
name: Dashboard pipeline status header
description: Live pipeline status in the publishing dashboard Navbar, driven by /api/episodes/stats.
---

## Rule

The publishing dashboard Navbar (`artifacts/publishing-dashboard/src/components/Navbar.tsx`) displays a live pipeline status bar using `useGetEpisodeStats()` from `/api/episodes/stats`.

It shows:
- A system-health readout that changes based on the current pipeline state (e.g., "SYSTEM READY", "2 RENDERING", "5 QUEUED", "12 NEED BUILD", "ALL PUBLISHED").
- Compact count pills for Published, Approved, Building, and Scheduled episodes, each with a color and a link to the relevant page.

## Why

The original header only showed a static "STATUS REPORT" badge. The live bar gives the user an at-a-glance view of what needs attention without opening the full dashboard.

## How to apply

If you add a new status to the episodes schema, update the `STATUS_PILLS` array in the Navbar and ensure the stats endpoint returns a count for it. Keep the health readout logic deterministic: prioritize building, then scheduled, then approved, then published.
