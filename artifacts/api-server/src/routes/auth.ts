import { Router } from "express";
import {
  requireAuth,
  setAuthenticated,
  clearSession,
  verifyPassword,
  isPasswordConfigured,
} from "../middleware/auth";

const router = Router();

// POST /api/auth/login
// Body: { password: string }
// Returns 200 + { ok: true } on success, 401 on failure.
router.post("/auth/login", (req, res): void => {
  const { password } = req.body ?? {};

  if (!isPasswordConfigured()) {
    res.status(500).json({
      error: "Server is not configured for login. Set DASHBOARD_PASSWORD in secrets.",
    });
    return;
  }

  if (typeof password !== "string" || !verifyPassword(password)) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  setAuthenticated(req);
  res.json({ ok: true });
});

// POST /api/auth/logout
// Destroys the session cookie.
router.post("/auth/logout", (req, res): void => {
  clearSession(req, res, () => {
    res.json({ ok: true });
  });
});

// GET /api/auth/me
// Returns whether the caller is authenticated.
router.get("/auth/me", (req, res): void => {
  const authenticated = Boolean((req.session as any)?.authenticated);
  res.json({ authenticated });
});

// GET /api/auth/protected
// A lightweight endpoint for the UI to verify its session is still valid.
router.get("/auth/protected", requireAuth, (_req, res): void => {
  res.json({ ok: true });
});

export default router;
