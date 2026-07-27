import { pgTable, serial, integer, text, timestamp, unique, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const episodeStatus = pgEnum("episode_status", ['draft', 'scripted', 'complete', 'scheduled', 'published', 'building'])
export const renderJobStatus = pgEnum("render_job_status", ['running', 'succeeded', 'failed'])


export const episodes = pgTable("episodes", {
	id: serial().primaryKey().notNull(),
	epNumber: integer("ep_number").notNull(),
	status: episodeStatus().default('draft').notNull(),
	dateBuilt: text("date_built"),
	postDate: timestamp("post_date", { mode: 'string' }),
	season: text().notNull(),
	aspectRatio: text("aspect_ratio").default('9:16').notNull(),
	duration: text().notNull(),
	hookTitle: text("hook_title").notNull(),
	youtubeTitle: text("youtube_title").notNull(),
	voScript: text("vo_script").notNull(),
	visualDirection: text("visual_direction").notNull(),
	bgSound: text("bg_sound").notNull(),
	thumbnailPrompt: text("thumbnail_prompt").notNull(),
	citationCta: text("citation_cta").notNull(),
	hashtags: text().notNull(),
	youtubeVideoId: text("youtube_video_id"),
	scheduledPublishAt: timestamp("scheduled_publish_at", { mode: 'string' }),
	approvedAt: timestamp("approved_at", { mode: 'string' }),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	buildStage: text("build_stage"),
	buildNote: text("build_note"),
	facebookVideoId: text("facebook_video_id"),
	youtubeViews: integer("youtube_views").default(0),
	youtubeLikes: integer("youtube_likes").default(0),
	youtubeComments: integer("youtube_comments").default(0),
	facebookViews: integer("facebook_views").default(0),
	facebookLikes: integer("facebook_likes").default(0),
	facebookComments: integer("facebook_comments").default(0),
	facebookShares: integer("facebook_shares").default(0),
});

export const renderJobs = pgTable("render_jobs", {
	id: serial().primaryKey().notNull(),
	episodeId: integer("episode_id").notNull(),
	status: renderJobStatus().default('running').notNull(),
	pid: integer(),
	logPath: text("log_path"),
	startedAt: timestamp("started_at", { mode: 'string' }).defaultNow().notNull(),
	finishedAt: timestamp("finished_at", { mode: 'string' }),
	error: text(),
}, (table) => [
	unique("render_jobs_episode_id_unique").on(table.episodeId),
]);
