import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import session from "express-session";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  throw new Error(
    "SESSION_SECRET is required for session signing. Add it to Replit Secrets.",
  );
}

app.use(
  (pinoHttp as any)({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

// CORS must allow credentials for the session cookie to travel with requests.
// Set CORS_ORIGIN to the deployed dashboard origin when the UI and API use
// different domains (for example, Vercel + Replit).
const configuredCorsOrigin = process.env.CORS_ORIGIN?.trim();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!configuredCorsOrigin || !origin) {
        callback(null, origin ?? true);
        return;
      }
      const allowedOrigins = configuredCorsOrigin
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      callback(null, allowedOrigins.includes(origin) ? origin : false);
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "biominute.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // The Replit preview proxy is HTTPS, but local browser screenshots and
      // direct development requests can be HTTP. Secure cookies are rejected
      // in that development case, which makes every post-login API request
      // appear unauthenticated. Production runs behind HTTPS, so keep the
      // stricter setting there.
      secure: process.env.NODE_ENV === "production",
      // Cross-site dashboard/API deployments need SameSite=None. This is
      // enabled only when an explicit CORS origin is configured.
      sameSite: configuredCorsOrigin ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    // In-memory store is fine for a single-instance production tool. If we ever
    // scale horizontally, swap to a persistent store.
  }),
);

app.use("/api", router);

// Global error handler — must be declared AFTER routes and have exactly 4 params.
// Catches any error thrown inside async route handlers (via next(err) or unhandled throws
// in Express 5, which auto-forwards async rejections).
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, req: Request, res: Response, _next: NextFunction): void => {
  const message =
    err instanceof Error ? err.message : "Internal server error";
  logger.error(
    { err, url: req.url, method: req.method },
    "Unhandled error in route handler",
  );
  if (!res.headersSent) {
    res.status(500).json({ error: message });
  }
});

export default app;
