import { Router, type IRouter } from "express";
import healthRouter from "./health";
import episodesRouter from "./episodes";
import youtubeRouter from "./youtube";
import facebookRouter from "./facebook";
import analyticsRouter from "./analytics";

const router: IRouter = Router();

router.use(healthRouter);
router.use(episodesRouter);
router.use(youtubeRouter);
router.use(facebookRouter);
router.use(analyticsRouter);

export default router;
