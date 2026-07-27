-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."episode_status" AS ENUM('draft', 'scripted', 'complete', 'scheduled', 'published', 'building');--> statement-breakpoint
CREATE TYPE "public"."render_job_status" AS ENUM('running', 'succeeded', 'failed');--> statement-breakpoint
CREATE TABLE "episodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"ep_number" integer NOT NULL,
	"status" "episode_status" DEFAULT 'draft' NOT NULL,
	"date_built" text,
	"post_date" text NOT NULL,
	"season" text NOT NULL,
	"aspect_ratio" text DEFAULT '9:16' NOT NULL,
	"duration" text NOT NULL,
	"hook_title" text NOT NULL,
	"youtube_title" text NOT NULL,
	"vo_script" text NOT NULL,
	"visual_direction" text NOT NULL,
	"bg_sound" text NOT NULL,
	"thumbnail_prompt" text NOT NULL,
	"citation_cta" text NOT NULL,
	"hashtags" text NOT NULL,
	"youtube_video_id" text,
	"scheduled_publish_at" timestamp,
	"approved_at" timestamp,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"build_stage" text,
	"build_note" text,
	"facebook_video_id" text,
	"youtube_views" integer DEFAULT 0,
	"youtube_likes" integer DEFAULT 0,
	"youtube_comments" integer DEFAULT 0,
	"facebook_views" integer DEFAULT 0,
	"facebook_likes" integer DEFAULT 0,
	"facebook_comments" integer DEFAULT 0,
	"facebook_shares" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "render_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"episode_id" integer NOT NULL,
	"status" "render_job_status" DEFAULT 'running' NOT NULL,
	"pid" integer,
	"log_path" text,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp,
	"error" text,
	CONSTRAINT "render_jobs_episode_id_unique" UNIQUE("episode_id")
);

*/