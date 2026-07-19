/**
 * youtube-reauth.ts — Re-authorize YouTube with full `youtube` management scope.
 *
 * Uses the loopback redirect flow (OOB is blocked by Google since Jan 2023).
 *
 * BEFORE FIRST RUN — add this URI to Google Cloud Console once:
 *   Console → APIs & Services → Credentials → your OAuth 2.0 Client ID
 *   → Authorized redirect URIs → Add URI:
 *
 *     http://localhost:4080/oauth/callback
 *
 * USAGE:
 *   npx tsx scripts/src/youtube-reauth.ts
 *
 *   1. Script prints a consent URL — open it in your browser.
 *   2. Click "Allow". Google redirects to the local server automatically.
 *   3. Script catches the code, exchanges it, prints the new YOUTUBE_REFRESH_TOKEN.
 *   4. Paste that token into Replit Secrets → YOUTUBE_REFRESH_TOKEN.
 *   5. Restart the API Server workflow.
 */

import http from "node:http";
import { google } from "googleapis";

const CLIENT_ID = process.env.YOUTUBE_CLIENT_ID;
const CLIENT_SECRET = process.env.YOUTUBE_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    "\n❌  YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET must be set in Replit Secrets.\n",
  );
  process.exit(1);
}

const PORT = 4080;
const REDIRECT_URI = `http://localhost:${PORT}/oauth/callback`;

const SCOPES = [
  "https://www.googleapis.com/auth/youtube",        // playlist management, video updates
  "https://www.googleapis.com/auth/youtube.upload", // video upload (keep existing)
];

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent", // forces Google to issue a fresh refresh_token even if previously authorized
});

// ─── Local callback server ────────────────────────────────────────────────────

const server = http.createServer(async (req, res) => {
  if (!req.url?.startsWith("/oauth/callback")) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<h2>❌ Authorization denied: ${error}</h2><p>You can close this tab.</p>`);
    console.error(`\n❌  Authorization denied by user: ${error}\n`);
    server.close();
    process.exit(1);
  }

  if (!code) {
    res.writeHead(400, { "Content-Type": "text/html" });
    res.end(`<h2>Bad request — no code in callback.</h2>`);
    server.close();
    process.exit(1);
  }

  // Exchange code for tokens
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
    <html><body style="font-family:sans-serif;padding:40px;background:#0f172a;color:#e2e8f0">
      <h2 style="color:#10b981">✅ Authorization successful!</h2>
      <p>Code received. Exchanging for refresh token — check your terminal for the result.</p>
      <p style="color:#64748b">You can close this tab.</p>
    </body></html>
  `);

  server.close();

  console.log("\n🔄  Code received — exchanging for tokens…\n");

  try {
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      console.error(
        "❌  No refresh_token in response.\n" +
          "    Google only issues refresh_tokens on the FIRST consent.\n\n" +
          "    Fix: go to https://myaccount.google.com/permissions\n" +
          "    Revoke access for your OAuth app, then run this script again.\n",
      );
      process.exit(1);
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅  SUCCESS — New YOUTUBE_REFRESH_TOKEN:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    console.log(tokens.refresh_token);
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\nNext steps:");
    console.log("  1. Open Replit Secrets (lock icon in sidebar).");
    console.log("  2. Find YOUTUBE_REFRESH_TOKEN → replace value with token above.");
    console.log("  3. Restart workflow: artifacts/api-server: API Server");
    console.log("  4. Next publish will automatically add videos to season playlists.\n");
  } catch (err) {
    console.error("❌  Token exchange failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
});

server.listen(PORT, "localhost", () => {
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  YouTube Re-Authorization — Full Scope (loopback flow)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  console.log("Listening on http://localhost:4080/oauth/callback\n");
  console.log("Open this URL in your browser and click Allow:\n");
  console.log(authUrl);
  console.log("\n(Script will exchange the code automatically once you approve)\n");
});

server.on("error", (err: NodeJS.ErrnoException) => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌  Port ${PORT} is already in use. Kill the other process and retry.\n`);
  } else {
    console.error("❌  Server error:", err.message);
  }
  process.exit(1);
});
