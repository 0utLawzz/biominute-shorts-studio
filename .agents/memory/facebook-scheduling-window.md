---
name: Facebook scheduling window
description: Facebook Graph API behavior when scheduled dates are beyond the page's currently allowed scheduling window.
---

# Facebook Scheduling Window

Facebook's Graph API can reject a scheduled video with `(#100) The specified scheduled publish time is invalid` when the requested date is too far in the future, even when the date is later than the minimum lead time and the slot is otherwise open.

**Why:** A batch targeting September dates was rejected from a July 29 run, while a nearer August 26 post succeeded. The rejection occurred during the Facebook finish call before the episode database row was updated.

**How to apply:** Before retrying a rendered Facebook batch, check the current date against the requested slots and retry only when each slot is within Facebook's accepted window. Preserve the existing YouTube IDs/dates and reuse the local MP4s; do not re-render unless validation fails.