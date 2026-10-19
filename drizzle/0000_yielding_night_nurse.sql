CREATE TABLE `blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`time` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blocked_slot` ON `blocks` (`date`,`time`);--> statement-breakpoint
CREATE TABLE `dresses` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`published` integer DEFAULT 1 NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `inquiries` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`date` text,
	`time` text,
	`dress_id` text,
	`data` text NOT NULL,
	`status` text DEFAULT 'Aguardando confirmação' NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`id` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`expires` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `slots` (
	`id` text PRIMARY KEY NOT NULL,
	`inquiry_id` text NOT NULL
);
