---
name: Export folder naming convention
description: How episode export folders should be named in the exports/ directory.
---

## Rule

Every exported episode must live in a folder named `Episode-NN-<descriptive-slug>/`. The slug should be derived from the episode's hook title or YouTube title, never a generic placeholder like `build` or `temp`.

## Why

Generic folder names (`Episode-51-build`) make it impossible to identify the episode without opening the folder, and they break the `findVideoPath` helper used by upload scripts, which matches `Episode-${padded}-*`. A descriptive slug keeps the export directory readable and prevents accidental overwrites.

## How to apply

When exporting manually, set:

```bash
BIOMINUTE_EXPORT_DIR="exports/Episode-51-does-washing-your-hair-every-day-cause-baldness" pnpm run export-video
```

When renaming an existing folder, use the episode hook title converted to lowercase, with non-alphanumeric characters removed and words joined by hyphens. Keep it under 6 words.
