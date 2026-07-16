import { pgTable, serial, integer, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const episodeStatusEnum = pgEnum("episode_status", [
  "draft",
  "complete",
  "review",
  "approved",
  "scheduled",
  "published",
  "building",
  "rejected",
]);

export const episodesTable = pgTable("episodes", {
  id: serial("id").primaryKey(),
  epNumber: integer("ep_number").notNull(),
  status: episodeStatusEnum("status").notNull().default("draft"),
  dateBuilt: text("date_built"),
  postDate: text("post_date").notNull(),
  season: text("season").notNull(),
  aspectRatio: text("aspect_ratio").notNull().default("9:16"),
  duration: text("duration").notNull(),
  hookTitle: text("hook_title").notNull(),
  youtubeTitle: text("youtube_title").notNull(),
  voScript: text("vo_script").notNull(),
  visualDirection: text("visual_direction").notNull(),
  bgSound: text("bg_sound").notNull(),
  thumbnailPrompt: text("thumbnail_prompt").notNull(),
  citationCta: text("citation_cta").notNull(),
  hashtags: text("hashtags").notNull(),
  youtubeVideoId: text("youtube_video_id"),
  buildStage: text("build_stage"),
  buildNote: text("build_note"),
  scheduledPublishAt: timestamp("scheduled_publish_at"),
  approvedAt: timestamp("approved_at"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertEpisodeSchema = createInsertSchema(episodesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEpisode = z.infer<typeof insertEpisodeSchema>;
export type Episode = typeof episodesTable.$inferSelect;
