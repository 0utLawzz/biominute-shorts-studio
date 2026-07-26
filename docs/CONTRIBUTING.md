# BioMinute Shorts Studio — Bug & Suggestion Form

Use this file to report bugs, code-smell issues, and improvement ideas without fixing them in code. Keep the list factual and cite file paths / line numbers where possible.

---

## How to file a bug or suggestion

Copy the template below and add it to the appropriate section.

```markdown
### <Short title>

- **Type:** Bug / Suggestion / Code smell
- **File(s):** `path/to/file.ts` (line ~NN)
- **Description:** What is wrong or what could be better?
- **Impact:** What breaks or slows down because of it?
- **Proposed fix (optional):** High-level idea, do not implement unless asked.
```

---

## Current known issues and suggestions

### Audio desync risk in export pipeline — RESOLVED

- **Type:** Suggestion
- **File(s):** `scripts/src/export-video.ts` (~line 87–95)
- **Status:** Fixed. The export script reads the canonical duration from `artifacts/biominute-reels/src/lib/video/config.ts` (`SCENE_DURATIONS`) and records the Playwright video for that length plus a small buffer. The `-shortest` audio flag is still present but is bounded by the scene manifest, so the looped background track cannot run longer than the visuals.
- **Impact:** Audio/video timing is now deterministic per episode.

### Hardcoded export fallback duration — RESOLVED

- **Type:** Code smell
- **File(s):** `scripts/src/export-video.ts` (~line 31)
- **Status:** Fixed. `FALLBACK_DURATION_MS` is only a last-resort safety net when the config read fails; the primary duration is derived from `SCENE_DURATIONS` in `config.ts`.
- **Impact:** Episodes with non-standard durations are handled via the scene manifest.

### Duplicate audio handling across scene components

- **Type:** Code smell
- **File(s):** `artifacts/biominute-reels/src/components/video/video_scenes/*.tsx` (many files)
- **Description:** Each scene component manages its own `audioRef` and `play()` logic instead of delegating to the `AudioEngine`.
- **Impact:** Race conditions, duplicate SFX triggers, and inconsistent mute behavior during rapid scene scrubbing.
- **Proposed fix:** Centralize SFX triggers in a hook or event bus inside `AudioEngine`.

### Missing guard for critical environment variables

- **Type:** Code smell
- **File(s):** `artifacts/api-server/src/index.ts` and related DB init code
- **Description:** The server throws on missing `PORT`, but other critical variables such as `DATABASE_URL` rely on implicit failures deeper in the stack.
- **Impact:** Misleading error messages when a secret is missing.
- **Proposed fix:** Add explicit, early validation for `DATABASE_URL`, `SESSION_SECRET`, and YouTube secrets before starting the server.

### Scene component duplication

- **Type:** Suggestion
- **File(s):** `artifacts/biominute-reels/src/components/video/video_scenes/`
- **Description:** Many `epNN_SceneX.tsx` files repeat the same animation patterns and audio boilerplate.
- **Impact:** Hard to maintain; changing a common animation requires editing many files.
- **Proposed fix:** Introduce a higher-order component or a JSON-driven scene generator for common patterns.

### Master sheet / sheet-name mismatch — RESOLVED

- **Type:** Bug / Documentation
- **File(s):** `scripts/src/seed-episodes.ts`, `scripts/src/read-master-sheet.ts`, `exports/production-log.md`
- **Status:** Fixed. The latest workbook is `attached_assets/BioMinute-Master-Workbook_1785093582748.xlsx` with sheets `Production`, `Social`, `Schedule`. All seed/read scripts point to the current workbook. Older workbook references should be considered deprecated.
- **Description:** Older references used different file names or sheet names, which caused confusion.
- **Impact:** Outdated references can cause confusion or silent failures if a tool reads the wrong sheet.
- **Proposed fix:** Audit all references and align them to the current workbook and sheets.

### Export pipeline dependency on system libraries

- **Type:** Suggestion
- **File(s):** `scripts/src/export-video.ts`, `replit.nix`
- **Description:** The export pipeline depends on system-level `ffmpeg`, `xvfb`, and several headless-browser libraries. Environment differences can break exports.
- **Impact:** Export may fail on new machines or after system updates.
- **Proposed fix:** Document dependencies more thoroughly or containerize the export pipeline.

### Redundant audio asset files

- **Type:** Code smell
- **File(s):** `artifacts/biominute-reels/public/audio/`
- **Description:** `pop.mp3` and `swoosh.mp3` may be redundant given the `sfx-` prefixed versions used in the code.
- **Impact:** Unused assets increase bundle size and confusion.
- **Proposed fix:** Remove unused assets after confirming they are not referenced.

### Boilerplate `hello.ts` script

- **Type:** Code smell
- **File(s):** `scripts/src/hello.ts`
- **Description:** A leftover boilerplate/test file with no production purpose.
- **Impact:** Adds noise to the scripts package.
- **Proposed fix:** Remove or convert into a real health-check script.

---

## Submitting changes

1. Add a new entry to this file using the template above.
2. Do **not** fix the issue unless explicitly asked — keep this file as a single source of truth for pending work.
3. If you open a Pull Request, reference the relevant entry here.
