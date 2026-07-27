import { Router, type IRouter } from "express";
import { requireAuth } from "../middleware/auth";
import healthRouter from "./health";
import authRouter from "./auth";
import episodesRouter from "./episodes";
import youtubeRouter from "./youtube";
import facebookRouter from "./facebook";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

// Public routes: health checks and auth handshakes (login/logout/me).
router.use(healthRouter);
router.use(authRouter);

// Everything else requires a valid session cookie.
router.use(requireAuth);
router.use(episodesRouter);
router.use(youtubeRouter);
router.use(facebookRouter);
router.use(analyticsRouter);

export default router;
