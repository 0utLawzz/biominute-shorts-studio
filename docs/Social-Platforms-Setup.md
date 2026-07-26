# BioMinute — Social Platform Connection Guide

This guide explains how to connect each social platform to the BioMinute Shorts Studio pipeline so episodes can be published (or cross-posted) automatically. You only need to set up the platforms you actually plan to use.

---

## Table of Contents

1. [YouTube](#youtube) — primary publishing target (required)
2. [Facebook](#facebook) — optional, currently disabled in code
3. [TikTok](#tiktok) — research-only / direct upload workflow
4. [Instagram Reels](#instagram-reels) — direct upload / manual workflow
5. [X / Twitter](#x--twitter) — link-drop workflow
6. [LinkedIn](#linkedin) — link-drop workflow
7. [How credentials flow into the app](#how-credentials-flow-into-the-app)
8. [Troubleshooting checklist](#troubleshooting-checklist)

---

## YouTube

**Status:** Fully integrated. The dashboard can publish Shorts directly to YouTube.

### What you need

- A Google Cloud project
- YouTube Data API v3 enabled
- OAuth 2.0 credentials (Client ID + Client Secret)
- A refresh token for unattended publishing
- Your channel ID and handle

### Step-by-step

1. **Create or open a Google Cloud project**
   - Go to https://console.cloud.google.com/
   - Select your project (or create one). Note the project name.

2. **Enable the YouTube Data API v3**
   - In the navigation menu: **APIs & Services → Library**
   - Search for **YouTube Data API v3** and click **Enable**.

3. **Create OAuth 2.0 credentials**
   - Go to **APIs & Services → Credentials**
   - Click **Create Credentials → OAuth client ID**
   - Choose **Web application** (or **Desktop app** if you are generating the refresh token locally)
   - Add an authorized redirect URI. For local token generation, `http://localhost:8080` works.
   - Save the **Client ID** and **Client Secret**.

4. **Get a refresh token**
   - The app needs a **refresh token** (not an access token) because access tokens expire every hour.
   - Easiest way: use Google's OAuth Playground.
     - Open https://developers.google.com/oauthplayground
     - Click the gear icon, check **Use your own OAuth credentials**, enter your Client ID and Client Secret.
     - Select the scope `https://www.googleapis.com/auth/youtube.upload`
     - Click **Authorize APIs**, sign in with the channel owner account, and approve.
     - Click **Exchange authorization code for tokens**.
     - Copy the **Refresh token** (it is long and starts with a dot-like prefix).

5. **Collect the channel info**
   - Open your channel on YouTube (e.g., `https://www.youtube.com/@BioMinutesh`).
   - The handle is `@BioMinutesh`.
   - To get the channel ID, visit https://www.youtube.com/account_advanced while signed in. Copy **Channel ID** (starts with `UC`).

6. **Add secrets to Replit**
   - In your Replit workspace, go to **Secrets** and add:
     - `YOUTUBE_CLIENT_ID` — your OAuth Client ID
     - `YOUTUBE_CLIENT_SECRET` — your OAuth Client Secret
     - `YOUTUBE_REFRESH_TOKEN` — the refresh token from step 4
     - `YOUTUBE_CHANNEL_ID` — the channel ID from step 5
     - `YOUTUBE_CHANNEL_NAME` — the channel handle or display name

7. **Test the connection**
   - Start the API server workflow.
   - Open the publishing dashboard and look for the **YouTube connection banner** at the top.
   - It should show a green "Connected" state. If not, check the API server logs for the exact OAuth error.

### Playlist IDs (for seasonal uploads)

If you want episodes to land in season playlists, you need the playlist ID for each season:

1. In YouTube Studio, go to **Playlists**.
2. Open a playlist. The URL will look like `https://www.youtube.com/playlist?list=PLxxxxxxxxxxx`.
3. Copy the `list=` value.
4. Add them to Replit Secrets as:
   - `YOUTUBE_PLAYLIST_S1`
   - `YOUTUBE_PLAYLIST_S2`
   - `YOUTUBE_PLAYLIST_S3`
   - `YOUTUBE_PLAYLIST_S4`
   - `YOUTUBE_PLAYLIST_S5`
   - `YOUTUBE_PLAYLIST_S6`

---

## Facebook

**Status:** Disabled in the current codebase. The `facebookVideoId` column is kept in the database for historical reference only, but no UI or routes use it.

### Why it was removed

- Facebook's video upload API for Pages requires frequent token refresh and page-scoped permissions.
- The user explicitly removed Facebook publishing to keep the pipeline focused on YouTube.

### If you want to re-enable it later

1. **Create a Facebook App**
   - Go to https://developers.facebook.com/apps
   - Create an app of type **Business**.

2. **Add the Pages API product**
   - In the app dashboard, add **Facebook Login for Business** and **Pages API**.

3. **Get a short-lived User access token**
   - Use the Graph API Explorer (https://developers.facebook.com/tools/explorer/).
   - Select your app, get a User access token with `pages_manage_posts` and `pages_read_engagement` permissions.

4. **Extend the User token to long-lived (60 days)**
   Facebook short-lived User tokens expire in ~1 hour. Exchange it for a long-lived token:

   ```bash
   curl -X GET "https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_USER_TOKEN"
   ```

   The response contains an `access_token` that lasts **60 days**.

5. **Exchange the long-lived User token for a Page access token**

   ```bash
   curl -X GET "https://graph.facebook.com/v19.0/me/accounts?access_token=LONG_LIVED_USER_TOKEN"
   ```

   Find the target page in the response and copy its `access_token` field. This is your Page access token.

6. **(Optional) Get a never-expiring System User token**
   For a production pipeline that never expires, create a **System User** in Meta Business Manager:
   - Business Manager → Settings → System Users → Add.
   - Assign the System User to the app and page.
   - Generate a token with `pages_manage_posts` and `pages_read_engagement`.
   - This token does not expire unless revoked.

7. **Store the token**
   - Add a new Replit Secret, e.g., `FACEBOOK_PAGE_ACCESS_TOKEN`.
   - Update the API server to read it and add a `POST /episodes/:id/publish-facebook` route.

8. **Known limitations**
   - Facebook Reels uploads via API are restricted; most integrations fall back to regular video uploads.
   - Vertical video will still display as a Reel-ish format in-feed, but it may not enter the Reels tab automatically.

### Token lifetimes at a glance

| Token type | Default lifetime | How to renew |
|------------|------------------|--------------|
| Short-lived User token | ~1 hour | Re-authorize in Graph API Explorer |
| Long-lived User token | 60 days | Re-run the `fb_exchange_token` call |
| Page access token | 60 days (if from long-lived User token) | Re-run `me/accounts` with a fresh long-lived User token |
| System User token | Never expires (until revoked) | Regenerate in Business Manager |

---

## TikTok

**Status:** Not directly integrated via API. TikTok's publishing API is restricted.

### What you need

- A TikTok Business account
- Approval for TikTok's **Content Posting API** (closed to most developers)
- Or use a third-party scheduler like **Metricool**, **Later**, or **TikTok's Creator Portal** manual upload

### Recommended workflow for BioMinute

1. **Export the MP4** from the dashboard (`Run Production` → `Publish to YouTube`).
2. **Download the MP4** from the episode detail page or from the `exports/` folder.
3. **Upload manually** in the TikTok mobile app or via a desktop tool.
4. Use the same title, description, and hashtags that are stored in the dashboard.

### If you want API publishing

Apply for access at https://developers.tiktok.com/. Once approved, you will receive:

- A **client key** and **client secret**
- An **access token** for a specific TikTok account
- The ability to post videos via `POST /v2/video/upload/`

Then add secrets `TIKTOK_CLIENT_KEY`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_ACCESS_TOKEN` and write a new API route similar to the YouTube publisher.

---

## Instagram Reels

**Status:** Not directly integrated via API.

### Why

Meta's Instagram Reels API is limited to **Instagram Business/Creator accounts** connected to a **Meta Business Account** and a Facebook app with **Instagram Content Publishing** permission.

### What you need

1. A Facebook app with **Instagram Basic Display** or **Instagram Graph API** enabled.
2. The Instagram account must be a **Business** or **Creator** account.
3. The Instagram account must be linked to a Facebook Page.
4. A long-lived User access token with `instagram_basic`, `pages_read_engagement`, `instagram_content_publish` permissions.

### Step-by-step

1. Go to https://developers.facebook.com/apps and create an app.
2. Add **Instagram Graph API** as a product.
3. In the app's **Roles** section, add the Instagram account as a tester if it is not yet approved for production.
4. Generate a token via the Graph API Explorer with the scopes listed above.
5. Use the token to call `POST /{ig-user-id}/media` to upload the video, then `POST /{ig-user-id}/media_publish` to publish the container.

### Recommended workflow for BioMinute

Same as TikTok: export the MP4, then upload manually or through a third-party scheduler. Instagram's API is finicky about video specs, so manual upload is usually faster and more reliable for Shorts/Reels.

---

## X / Twitter

**Status:** Not directly integrated.

### What you need

- A Twitter/X developer account
- A project + app with **Elevated** or **Basic** access
- API Key, API Key Secret, Access Token, Access Token Secret
- Or a Bearer Token for v2 endpoints

### Step-by-step for media upload

1. Apply at https://developer.twitter.com/en/portal/dashboard.
2. Create a project and app.
3. Generate keys and tokens under **Keys and Tokens**.
4. To upload video, use the v1.1 media upload endpoint (`media/upload`) because v2 still has limited media support.
5. Post a tweet with the media ID using `statuses/update` or the v2 tweet endpoint.

### Recommended workflow for BioMinute

BioMinute is a vertical video brand. X does not have a native Shorts/Reels surface. The best use of X is a **link-drop** workflow:

1. Publish to YouTube first.
2. Copy the Shorts URL (`https://youtube.com/shorts/{videoId}`).
3. Post it on X with a short hook, hashtags, and a thumbnail image.

You can automate this by adding a `POST /episodes/:id/share/x` route that creates the tweet text after the YouTube upload finishes.

---

## LinkedIn

**Status:** Not directly integrated.

### What you need

- LinkedIn developer app at https://developer.linkedin.com/
- OAuth 2.0 credentials
- Access token with `w_member_social` or `w_organization_social` scope (the latter requires a LinkedIn Marketing Developer Platform application)

### Step-by-step

1. Create a LinkedIn app.
2. Request access to the **Consumer Marketing Developer Platform** if you want to post as an organization/page.
3. Add `http://localhost` as a redirect URL for local token generation.
4. Authorize with scopes `r_basicprofile`, `w_member_social`, and optionally `w_organization_social`.
5. Exchange the code for an access token.
6. Use `POST /v2/ugcPosts` (legacy) or `POST /rest/posts` (newer) to post.

### Recommended workflow for BioMinute

LinkedIn is not a primary Shorts destination. Use it for a **link-drop + thumbnail** post after YouTube publishing, similar to X.

---

## How credentials flow into the app

The app reads environment variables via Replit Secrets. They are never written to code files. At startup, the API server validates that all required YouTube secrets are present.

```
Replit Secrets
├── DATABASE_URL
├── SESSION_SECRET
├── YOUTUBE_CLIENT_ID
├── YOUTUBE_CLIENT_SECRET
├── YOUTUBE_REFRESH_TOKEN
├── YOUTUBE_CHANNEL_ID
├── YOUTUBE_CHANNEL_NAME
├── YOUTUBE_PLAYLIST_S1 … S6
└── GITHUB_TOKEN
```

To add or rotate a secret:

1. Go to the **Secrets** tab in Replit.
2. Add or update the key/value pair.
3. Restart the **API Server** workflow so the new value is loaded.
4. The dashboard will pick up the new connection state on its next refresh.

---

## Troubleshooting checklist

| Symptom | Likely cause | Fix |
|---|---|---|
| Dashboard shows YouTube "Disconnected" | Missing or wrong refresh token | Regenerate the refresh token and update `YOUTUBE_REFRESH_TOKEN` |
| Upload fails with `401 Invalid Credentials` | Refresh token expired or revoked | Re-authorize in OAuth Playground and update the secret |
| Upload fails with `quotaExceeded` | YouTube API quota limit reached | Wait 24 hours or request a quota increase in Google Cloud |
| `upload-now` fails with "duplicate" | Video title already uploaded | Change the YouTube title or delete the old upload from the channel |
| Scheduled uploads never publish | `scheduledPublishAt` is in the past or missing | Open the episode detail, set the schedule time, and approve again |
| Facebook/TikTok/Instagram buttons missing | Those platforms are not wired up | Follow the sections above and add new API routes if needed |

### Quick validation commands

From the workspace shell:

```bash
# Check if all required secrets are known to the API server
pnpm --filter @workspace/api-server exec tsx -e "console.log(process.env.YOUTUBE_CLIENT_ID ? 'OK' : 'MISSING')"

# Re-seed episodes from the master workbook
pnpm --filter @workspace/scripts exec tsx ./src/seed-episodes.ts

# Trigger a manual upload for a specific episode
pnpm --filter @workspace/scripts exec tsx ./src/upload-now.ts <EP_NUMBER>
```

---

## Adding a new platform later

If you want to add another platform (e.g., Snapchat, Pinterest, BlueSky):

1. Create the platform app and collect credentials.
2. Add the credentials as Replit Secrets.
3. Add a new API route in `artifacts/api-server/src/routes/` (e.g., `pinterest.ts`).
4. Add a corresponding React Query hook in `lib/api-spec/openapi.yaml` and run `pnpm --filter @workspace/api-spec run codegen`.
5. Add a publish button in `artifacts/publishing-dashboard/src/pages/EpisodeDetail.tsx`.
6. Keep the publish guard logic so an episode cannot be double-published to the same platform.

For questions, check the platform's official developer docs first — their OAuth and upload requirements change frequently.
