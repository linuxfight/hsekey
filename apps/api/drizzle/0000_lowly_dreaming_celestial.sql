CREATE TABLE "goods" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" integer NOT NULL,
	"amount" integer NOT NULL,
	"image_url" varchar(2048) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"activity" varchar(255) NOT NULL,
	"count" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"price" integer NOT NULL,
	"amount" integer NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"cancelled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(100) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"points" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "stats" ADD CONSTRAINT "stats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_product_id_goods_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."goods"("id") ON DELETE cascade ON UPDATE no action;

-- First, drop the default constraint
ALTER TABLE "users" ALTER COLUMN "points" DROP DEFAULT;

-- Drop the column and recreate it as a generated column using a function
-- Since PostgreSQL doesn't support subqueries in generated columns,
-- we'll create a function instead
CREATE OR REPLACE FUNCTION calculate_user_points(user_id_param integer)
    RETURNS integer AS $$
BEGIN
    RETURN (
        COALESCE((SELECT SUM(count) FROM stats WHERE user_id = user_id_param), 0) / 1000 -
        COALESCE((SELECT SUM(price * amount) FROM transactions WHERE user_id = user_id_param AND cancelled = false), 0)
        )::integer;
END;
$$ LANGUAGE plpgsql STABLE;

-- Drop and recreate the column as generated
ALTER TABLE "users" DROP COLUMN "points";
ALTER TABLE "users" ADD COLUMN "points" integer GENERATED ALWAYS AS (calculate_user_points(id)) STORED;