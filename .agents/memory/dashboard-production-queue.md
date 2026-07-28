---
name: Dashboard Production Queue
description: The publishing dashboard uses a live-backed Production Queue layout derived from the approved canvas mockup.
---

The dashboard's main surface is an action-first Production Queue: a compact status summary, three upcoming episodes in an “Action Required” panel, and a dense searchable/filterable library. Queue actions navigate to the existing episode detail workflow rather than duplicating mutation logic.

**Why:** The approved canvas direction improves producer scanability while preserving the existing API, authentication, navigation, and episode workflows.

**How to apply:** Preserve this hierarchy and connect future dashboard actions to the existing routes/hooks. Keep episode timestamps formatted with `formatPKT`, and keep the dashboard free of audio controls or playback.