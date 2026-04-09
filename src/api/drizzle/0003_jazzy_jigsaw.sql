ALTER TABLE "hubBridges" DROP CONSTRAINT "hubBridges_hubID_hubs_id_fk";
--> statement-breakpoint
ALTER TABLE "hubSettings" DROP CONSTRAINT "hubSettings_id_hubs_id_fk";
--> statement-breakpoint
ALTER TABLE "hubBridges" ADD CONSTRAINT "hubBridges_hubID_hubs_id_fk" FOREIGN KEY ("hubID") REFERENCES "public"."hubs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hubSettings" ADD CONSTRAINT "hubSettings_id_hubs_id_fk" FOREIGN KEY ("id") REFERENCES "public"."hubs"("id") ON DELETE cascade ON UPDATE no action;