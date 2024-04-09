CREATE TABLE `features` (
	`appID` int NOT NULL,
	`trackMessage` boolean NOT NULL DEFAULT false,
	`deleteMessage` boolean NOT NULL DEFAULT false,
	`webhookSupport` boolean NOT NULL DEFAULT false,
	`inviteLinks` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `features_appID` PRIMARY KEY(`appID`)
);
--> statement-breakpoint
ALTER TABLE `apps` DROP COLUMN `trackMessage`;--> statement-breakpoint
ALTER TABLE `apps` DROP COLUMN `deleteMessage`;--> statement-breakpoint
ALTER TABLE `apps` DROP COLUMN `webhookSupport`;--> statement-breakpoint
ALTER TABLE `apps` DROP COLUMN `inviteLinks`;--> statement-breakpoint
ALTER TABLE `features` ADD CONSTRAINT `features_appID_apps_id_fk` FOREIGN KEY (`appID`) REFERENCES `apps`(`id`) ON DELETE no action ON UPDATE no action;