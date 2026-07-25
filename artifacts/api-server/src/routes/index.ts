import { Router, type IRouter } from "express";
import healthRouter from "./health";
import episodesRouter from "./episodes";
import youtubeRouter from "./youtube";

const router: IRouter = Router();

router.use(healthRouter);
router.use(episodesRouter);
router.use(youtubeRouter);

export default router;
