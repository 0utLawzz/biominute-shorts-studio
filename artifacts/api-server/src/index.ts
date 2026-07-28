import app from "./app";
import { logger } from "./lib/logger";
import { shutdownRenderJobs } from "./lib/render-jobs";

// ---------------------------------------------------------------------------
// Startup credential check — hard-fails if any required env var is absent.
// The server must not start in a half-configured state; a clear list of what
// is missing is far easier to diagnose than a cryptic runtime error later.
// ---------------------------------------------------------------------------

/** Variables that must be present for the server to function at all. */
const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "YOUTUBE_CLIENT_ID",
  "YOUTUBE_CLIENT_SECRET",
  "YOUTUBE_REFRESH_TOKEN",
  "YOUTUBE_PLAYLIST_S1",
  "YOUTUBE_PLAYLIST_S2",
  "YOUTUBE_PLAYLIST_S3",
  "YOUTUBE_PLAYLIST_S4",
  "YOUTUBE_PLAYLIST_S5",
  "YOUTUBE_PLAYLIST_S6",
  "SESSION_SECRET",
  "DASHBOARD_PASSWORD",
] as const;

/** Additional vars that are present but not strictly required (logged for visibility). */
const OPTIONAL_ENV_VARS = [
  "YOUTUBE_CHANNEL_NAME",
  "YOUTUBE_CHANNEL_ID",
  "GITHUB_TOKEN",
] as const;

function assertAndLogCredentials(): void {
  const missing = REQUIRED_ENV_VARS.filter((k) => !process.env[k]);

  if (missing.length > 0) {
    // Use console.error so this is visible even before the pino logger is ready
    console.error(
      "\n🚫  Server startup aborted — missing required environment variables:\n" +
        missing.map((k) => `   • ${k}`).join("\n") +
        "\n\nAdd these to Replit Secrets and restart the server.\n",
    );
    process.exit(1);
  }

  const present = [
    ...REQUIRED_ENV_VARS,
    ...OPTIONAL_ENV_VARS.filter((k) => !!process.env[k]),
  ];
  const optionalMissing = OPTIONAL_ENV_VARS.filter((k) => !process.env[k]);

  logger.info({ present }, "Startup: all required credentials present");
  if (optionalMissing.length > 0) {
    logger.warn(
      { missing: optionalMissing },
      "Startup: optional credentials missing — related features may be limited",
    );
  }
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------
const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

assertAndLogCredentials();

let isShuttingDown = false;
async function shutdown(signal: string): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;
  logger.info({ signal }, "Shutting down — stopping active render jobs");
  try {
    await shutdownRenderJobs();
  } finally {
    process.exit(0);
  }
}

process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGINT", () => void shutdown("SIGINT"));

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");

  logger.info("Manual YouTube publishing is enabled; no background scheduler runs.");
});
