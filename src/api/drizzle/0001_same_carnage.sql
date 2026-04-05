ALTER TABLE "features" ADD COLUMN "tosLink" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "features" ADD COLUMN "privacyPolicyLink" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "features" ADD COLUMN "textLength" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "features" ADD COLUMN "deleteMessageTime" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "features" ADD COLUMN "media" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "features" ADD COLUMN "mediaStickers" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "features" ADD COLUMN "mediaEmojis" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "features" ADD COLUMN "delaunch" boolean DEFAULT false NOT NULL;