CREATE TABLE "bank_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cbu" varchar(22) NOT NULL,
	"alias" varchar(50) NOT NULL,
	"bank_name" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "bank_accounts_cbu_unique" UNIQUE("cbu")
);
--> statement-breakpoint
CREATE TABLE "digital_wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cvu" varchar(22) NOT NULL,
	"provider" varchar(100) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "digital_wallets_cvu_unique" UNIQUE("cvu")
);
