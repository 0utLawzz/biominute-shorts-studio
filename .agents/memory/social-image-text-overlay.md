---
name: Social image text overlay
description: For promotional raster graphics, generate the visual background separately and add exact marketing copy programmatically.
---

**Rule:** Keep generated imagery text-free, then composite the headline, feature labels, CTA, and contact details with a deterministic SVG or image-processing layer.

**Why:** AI-generated background text is unreliable, and transparent SVG compositing must be rasterized as an overlay before combining or the background can disappear.

**How to apply:** Generate a background asset first, render the exact typography as a transparent overlay, composite the two layers, inspect the final image, and verify its dimensions before presenting it.