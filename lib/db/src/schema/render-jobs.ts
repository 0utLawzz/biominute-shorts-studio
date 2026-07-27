import { integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const renderJobStatusEnum = pgEnum("render_job_status", [
  "running",
  "succeeded",
  "failed",
]);

export const renderJobsTable = pgTable("render_jobs", {
  id: serial("id").primaryKey(),
  episodeId: integer("episode_id").notNull().unique(),
  status: renderJobStatusEnum("status").notNull().default("running"),
  pid: integer("pid"),
  logPath: text("log_path"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  finishedAt: timestamp("finished_at"),
  error: text("error"),
});

export type RenderJob = typeof renderJobsTable.$inferSelect;