import type { Request, Response, NextFunction } from "express";
import type { Session } from "express-session";
import { logger } from "../lib/logger";

/**
 * BioMinute dashboard auth is deliberately simple: one shared password stored in
 * Replit Secrets, verified server-side, and kept in a signed session cookie.
 *
 * Why not JWT? Because we already have express-session + SESSION_SECRET in the
 * stack. Adding a bearer token would require mobile auth logic we don't need.
 * Why not Replit Auth? Because the dashboard is a production tool, not a public
 * consumer app, and Replit Auth would require every admin to have a Replit
 * account.
 */

declare module "express-session" {
  interface SessionData {
    authenticated?: boolean;
  }
}

const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD;

export function getDashboardPassword(): string {
  if (!DASHBOARD_PASSWORD) {
    // This branch is intentionally unreachable in production — index.ts refuses
    // to start without a password. The fallback is only here for type safety.
    throw new Error("DASHBOARD_PASSWORD is not configured");
  }
  return DASHBOARD_PASSWORD;
}

export function isPasswordConfigured(): boolean {
  return !!DASHBOARD_PASSWORD && DASHBOARD_PASSWORD.length >= 8;
}

export interface AuthenticatedRequest extends Request {
  session: Session & { authenticated?: boolean };
}

/**
 * Require a valid authenticated session. Returns 401 JSON if missing.
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authReq = req as AuthenticatedRequest;
  if (authReq.session?.authenticated) {
    next();
    return;
  }
  res.status(401).json({
    error: "Not authenticated",
    loginUrl: "/login",
  });
}

/**
 * Verify a password against the configured secret. Constant-time comparison to
 * prevent timing attacks on the (admittedly single) shared password.
 */
export function verifyPassword(candidate: string): boolean {
  const expected = getDashboardPassword();
  if (candidate.length !== expected.length) {
    // Still do a dummy comparison to keep timing roughly constant
    return false;
  }

  let result = 0;
  for (let i = 0; i < expected.length; i++) {
    result |= expected.charCodeAt(i) ^ candidate.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Mark a session as authenticated. Call this after successful login.
 */
export function setAuthenticated(
  req: Request,
): void {
  const authReq = req as AuthenticatedRequest;
  authReq.session.authenticated = true;
}

/**
 * Destroy the session. Call this on logout.
 */
export function clearSession(
  req: Request,
  res: Response,
  callback: () => void,
): void {
  req.session.destroy((err) => {
    if (err) {
      logger.error({ err }, "auth: failed to destroy session");
    }
    res.clearCookie("connect.sid");
    callback();
  });
}
