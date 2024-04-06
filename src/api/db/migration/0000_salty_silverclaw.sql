CREATE TABLE `apps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` tinytext NOT NULL,
	`trackMessage` boolean NOT NULL DEFAULT false,
	`deleteMessage` boolean NOT NULL DEFAULT false,
	`webhookSupport` boolean NOT NULL DEFAULT false,
	`inviteLinks` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `apps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `hubs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` tinytext NOT NULL,
	`ownerID` tinytext NOT NULL,
	`appID` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hubs_id` PRIMARY KEY(`id`),
	CONSTRAINT `hubs_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `hubBridges` (
	`id` varchar(1) NOT NULL,
	`appID` int NOT NULL,
	`hubID` int NOT NULL,
	`additionalData` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hubBridges_id` PRIMARY KEY(`id`),
	CONSTRAINT `hubBridges_id_appID_hubID_unique` UNIQUE(`id`,`appID`,`hubID`)
);
--> statement-breakpoint
CREATE TABLE `hubSettings` (
	`id` int NOT NULL,
	`allowInvites` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `hubSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messageLinks` (
	`messageID` varchar(1) NOT NULL,
	`channelID` varchar(1),
	`linkID` tinytext NOT NULL,
	`appID` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messageLinks_messageID` PRIMARY KEY(`messageID`),
	CONSTRAINT `messageLinks_messageID_channelID_unique` UNIQUE(`messageID`,`channelID`)
);
--> statement-breakpoint
CREATE TABLE `userBlocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userID` tinytext NOT NULL,
	`appID` int NOT NULL,
	`channelID` varchar(1) NOT NULL,
	`hubID` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userBlocks_id` PRIMARY KEY(`id`),
	CONSTRAINT `userBlocks_userID_appID_channelID_hubID_unique` UNIQUE(`userID`,`appID`,`channelID`,`hubID`)
);
--> statement-breakpoint
CREATE TABLE `userToSAgrees` (
	`userID` varchar(1) NOT NULL,
	`appID` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userToSAgrees_userID` PRIMARY KEY(`userID`)
);
--> statement-breakpoint
ALTER TABLE `hubs` ADD CONSTRAINT `hubs_appID_apps_id_fk` FOREIGN KEY (`appID`) REFERENCES `apps`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hubBridges` ADD CONSTRAINT `hubBridges_appID_apps_id_fk` FOREIGN KEY (`appID`) REFERENCES `apps`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hubBridges` ADD CONSTRAINT `hubBridges_hubID_hubs_id_fk` FOREIGN KEY (`hubID`) REFERENCES `hubs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `hubSettings` ADD CONSTRAINT `hubSettings_id_hubs_id_fk` FOREIGN KEY (`id`) REFERENCES `hubs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messageLinks` ADD CONSTRAINT `messageLinks_channelID_hubBridges_id_fk` FOREIGN KEY (`channelID`) REFERENCES `hubBridges`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messageLinks` ADD CONSTRAINT `messageLinks_appID_apps_id_fk` FOREIGN KEY (`appID`) REFERENCES `apps`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userBlocks` ADD CONSTRAINT `userBlocks_appID_apps_id_fk` FOREIGN KEY (`appID`) REFERENCES `apps`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userBlocks` ADD CONSTRAINT `userBlocks_channelID_hubBridges_id_fk` FOREIGN KEY (`channelID`) REFERENCES `hubBridges`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userBlocks` ADD CONSTRAINT `userBlocks_hubID_hubs_id_fk` FOREIGN KEY (`hubID`) REFERENCES `hubs`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userToSAgrees` ADD CONSTRAINT `userToSAgrees_appID_apps_id_fk` FOREIGN KEY (`appID`) REFERENCES `apps`(`id`) ON DELETE no action ON UPDATE no action;