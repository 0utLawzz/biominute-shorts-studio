---
name: Social platforms setup guide
description: Where to find and how to extend the social platform connection guide for BioMinute.
---

## Rule

`docs/Social-Platforms-Setup.md` is the canonical reference for connecting social platforms to the BioMinute pipeline. It covers:

- YouTube — fully integrated, requires Google Cloud OAuth + refresh token + channel ID + playlist IDs.
- Facebook — currently disabled in code; kept as a historical note.
- TikTok — not directly integrated, requires manual upload or a third-party scheduler.
- Instagram Reels — not directly integrated, requires Meta Business app + manual fallback.
- X / Twitter — not directly integrated, recommended as a link-drop workflow.
- LinkedIn — not directly integrated, recommended as a link-drop workflow.

## Why

YouTube is the only platform the API server can publish to automatically. The other platforms either have restricted APIs, require business-level approvals, or do not have a native Shorts surface. Centralizing the setup steps prevents secret sprawl and makes it easy to add new platforms later.

## How to apply

When adding a new platform, extend the guide with the required app, scopes, token type, and a sample API route. Always store credentials in Replit Secrets, never in code, and restart the API server after adding or rotating a secret.
