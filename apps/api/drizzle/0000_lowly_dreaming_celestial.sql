CREATE TABLE IF NOT EXISTS "goods" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" integer NOT NULL,
	"amount" integer NOT NULL,
	"image_url" varchar(2048) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"activity" varchar(255) NOT NULL,
	"count" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"price" integer NOT NULL,
	"amount" integer NOT NULL,
	"user_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"cancelled" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
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

-- Function to calculate points
CREATE OR REPLACE FUNCTION calculate_user_points(user_id_param integer)
    RETURNS integer AS $$
BEGIN
    RETURN (
        COALESCE((SELECT SUM(count) FROM stats WHERE user_id = user_id_param), 0) / 1000 -
        COALESCE((SELECT SUM(price * amount) FROM transactions WHERE user_id = user_id_param AND cancelled = false), 0)
        )::integer;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to update user points
CREATE OR REPLACE FUNCTION update_user_points()
    RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET points = calculate_user_points(
            CASE
                WHEN TG_OP = 'DELETE' THEN OLD.user_id
                ELSE NEW.user_id
                END
                 )
    WHERE id = CASE
                   WHEN TG_OP = 'DELETE' THEN OLD.user_id
                   ELSE NEW.user_id
        END;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers for stats table
CREATE TRIGGER update_points_after_stats_insert
    AFTER INSERT ON stats
    FOR EACH ROW EXECUTE FUNCTION update_user_points();

CREATE TRIGGER update_points_after_stats_update
    AFTER UPDATE ON stats
    FOR EACH ROW EXECUTE FUNCTION update_user_points();

CREATE TRIGGER update_points_after_stats_delete
    AFTER DELETE ON stats
    FOR EACH ROW EXECUTE FUNCTION update_user_points();

-- Triggers for transactions table
CREATE TRIGGER update_points_after_transaction_insert
    AFTER INSERT ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_user_points();

CREATE TRIGGER update_points_after_transaction_update
    AFTER UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_user_points();

CREATE TRIGGER update_points_after_transaction_delete
    AFTER DELETE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_user_points();