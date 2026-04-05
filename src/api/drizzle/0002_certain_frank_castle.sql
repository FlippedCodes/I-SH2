ALTER TABLE "apps" ADD COLUMN "delaunch" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "features" DROP COLUMN "delaunch";