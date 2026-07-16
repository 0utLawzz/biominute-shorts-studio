import express, {
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
