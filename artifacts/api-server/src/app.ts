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
app.use(
  cors({
    origin: (origin, callback) => {
      // Reflect any origin (dev tooling, Replit proxy) while keeping credentials.
      callback(null, origin ?? true);
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
      // Replit uses HTTPS, so mark the cookie secure. In local development this
      // still works because the browser sees the proxied origin as HTTPS.
      secure: true,
      sameSite: "lax",
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
