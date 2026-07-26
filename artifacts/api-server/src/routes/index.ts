import { Router, type IRouter } from "express";
import healthRouter from "./health";
import episodesRouter from "./episodes";
import youtubeRouter from "./youtube";
import facebookRouter from "./facebook";

const router: IRouter = Router();

router.use(healthRouter);
router.use(episodesRouter);
router.use(youtubeRouter);
router.use(facebookRouter);

export default router;
