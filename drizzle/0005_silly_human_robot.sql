ALTER TABLE "delivery_persons" ALTER COLUMN "name" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "delivery_persons" ADD COLUMN "phone" varchar(13) NOT NULL;