CREATE TABLE "apps" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "apps_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "features" (
	"appID" integer PRIMARY KEY NOT NULL,
	"trackMessage" boolean DEFAULT false NOT NULL,
	"deleteMessage" boolean DEFAULT false NOT NULL,
	"webhookSupport" boolean DEFAULT false NOT NULL,
	"inviteLinks" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hubBridges" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"appID" integer NOT NULL,
	"hubID" integer NOT NULL,
	"additionalData" json,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hubBridges_id_appID_hubID_unique" UNIQUE("id","appID","hubID")
);
--> statement-breakpoint
CREATE TABLE "hubSettings" (
	"id" integer PRIMARY KEY NOT NULL,
	"allowInvites" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hubs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "hubs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"ownerID" varchar(255) NOT NULL,
	"appID" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hubs_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "messageLinks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "messageLinks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"messageID" varchar(255),
	"channelID" varchar(255),
	"linkID" varchar(255),
	"appID" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "messageLinks_messageID_channelID_unique" UNIQUE("messageID","channelID")
);
--> statement-breakpoint
CREATE TABLE "userBlocks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "userBlocks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userID" varchar(255) NOT NULL,
	"appID" integer NOT NULL,
	"channelID" varchar(255) NOT NULL,
	"hubID" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "userBlocks_userID_appID_channelID_hubID_unique" UNIQUE("userID","appID","channelID","hubID")
);
--> statement-breakpoint
CREATE TABLE "userToSAgrees" (
	"userID" varchar(255) PRIMARY KEY NOT NULL,
	"appID" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "features" ADD CONSTRAINT "features_appID_apps_id_fk" FOREIGN KEY ("appID") REFERENCES "public"."apps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hubBridges" ADD CONSTRAINT "hubBridges_appID_apps_id_fk" FOREIGN KEY ("appID") REFERENCES "public"."apps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hubBridges" ADD CONSTRAINT "hubBridges_hubID_hubs_id_fk" FOREIGN KEY ("hubID") REFERENCES "public"."hubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hubSettings" ADD CONSTRAINT "hubSettings_id_hubs_id_fk" FOREIGN KEY ("id") REFERENCES "public"."hubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hubs" ADD CONSTRAINT "hubs_appID_apps_id_fk" FOREIGN KEY ("appID") REFERENCES "public"."apps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageLinks" ADD CONSTRAINT "messageLinks_channelID_hubBridges_id_fk" FOREIGN KEY ("channelID") REFERENCES "public"."hubBridges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messageLinks" ADD CONSTRAINT "messageLinks_appID_apps_id_fk" FOREIGN KEY ("appID") REFERENCES "public"."apps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userBlocks" ADD CONSTRAINT "userBlocks_appID_apps_id_fk" FOREIGN KEY ("appID") REFERENCES "public"."apps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userBlocks" ADD CONSTRAINT "userBlocks_channelID_hubBridges_id_fk" FOREIGN KEY ("channelID") REFERENCES "public"."hubBridges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userBlocks" ADD CONSTRAINT "userBlocks_hubID_hubs_id_fk" FOREIGN KEY ("hubID") REFERENCES "public"."hubs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "userToSAgrees" ADD CONSTRAINT "userToSAgrees_appID_apps_id_fk" FOREIGN KEY ("appID") REFERENCES "public"."apps"("id") ON DELETE no action ON UPDATE no action;