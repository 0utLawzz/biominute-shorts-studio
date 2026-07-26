---
name: YouTube refresh token lifecycle
description: How to handle expired/revoked YouTube refresh tokens and regenerate them for the BioMinute pipeline.
---

## Rule

When the YouTube API returns `invalid_grant`, the stored `YOUTUBE_REFRESH_TOKEN` is revoked or expired. The only fix is to generate a new one.

## How to regenerate

Run the loopback OAuth helper:

```bash
pnpm --filter @workspace/scripts exec tsx ./src/youtube-reauth.ts
```

1. Make sure `YOUTUBE_CLIENT_ID` and `YOUTUBE_CLIENT_SECRET` are set in Replit Secrets.
2. Add `http://localhost:4080/oauth/callback` as an authorized redirect URI in Google Cloud Console.
3. Open the URL printed by the script, approve access.
4. Copy the printed refresh token.
5. Paste it into Replit Secrets as `YOUTUBE_REFRESH_TOKEN`.
6. Restart the API Server workflow.

## Why

Google refresh tokens stop working when the app is revoked in the user's account, the consent is changed, or the token was issued by an old OAuth app. The API cannot recover from `invalid_grant` automatically; a new consent flow is required.

## How to apply

Before any YouTube upload or verification script that calls the Data API, check that the token is valid. If the script fails with `invalid_grant`, do not retry — run `youtube-reauth.ts` first. Never commit the refresh token to the repo.
