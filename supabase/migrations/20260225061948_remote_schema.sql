


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."booking_status" AS ENUM (
    'pending',
    'confirmed',
    'completed',
    'cancelled'
);


ALTER TYPE "public"."booking_status" OWNER TO "postgres";


CREATE TYPE "public"."order_status" AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'cancellation_requested',
    'confirmed',
    'return_requested',
    'refunded'
);


ALTER TYPE "public"."order_status" OWNER TO "postgres";


CREATE TYPE "public"."request_status" AS ENUM (
    'new',
    'in_progress',
    'completed',
    'cancelled'
);


ALTER TYPE "public"."request_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cancel_order"("p_order_id" "uuid", "p_email" "text") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    v_order RECORD;
    v_new_status order_status;
    v_message TEXT;
BEGIN
    -- Fetch order
    SELECT * INTO v_order
    FROM orders
    WHERE id = p_order_id AND customer_email = p_email;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'message', 'Order not found or access denied');
    END IF;

    -- Logic: 
    -- 'pending' -> Direct Cancel
    -- 'processing', 'shipped' -> Request Cancellation
    
    IF v_order.status = 'pending' THEN
        v_new_status := 'cancelled';
        v_message := 'Order cancelled successfully';
    ELSIF v_order.status IN ('processing', 'shipped') THEN
        v_new_status := 'cancellation_requested';
        v_message := 'Cancellation requested successfully';
    ELSE
        RETURN jsonb_build_object('success', false, 'message', 'Order cannot be cancelled in current status (' || v_order.status || ')');
    END IF;

    -- Perform Update
    UPDATE orders
    SET status = v_new_status
    WHERE id = p_order_id;

    RETURN jsonb_build_object('success', true, 'message', v_message, 'new_status', v_new_status);
EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;


ALTER FUNCTION "public"."cancel_order"("p_order_id" "uuid", "p_email" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_notification"("notification_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  current_user_email TEXT;
  stored_user_email TEXT;
BEGIN
  -- Get email from the current authenticated user's JWT
  current_user_email := auth.jwt() ->> 'email';
  
  -- Get the email stored on the notification
  SELECT user_email INTO stored_user_email FROM notifications WHERE id = notification_id;
  
  IF NOT FOUND THEN
     -- Notification doesn't exist at all
     RETURN FALSE;
  END IF;

  -- Check match with detailed debug error if fails
  IF lower(trim(stored_user_email)) != lower(trim(current_user_email)) THEN
     RAISE EXCEPTION 'Access Denied: Notification belongs to "%", but you are "%"', stored_user_email, current_user_email;
  END IF;

  -- Attempt delete
  DELETE FROM notifications WHERE id = notification_id;

  RETURN TRUE;
END;
$$;


ALTER FUNCTION "public"."delete_notification"("notification_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN (SELECT auth.jwt() ->> 'email') = 'awinashkr31@gmail.com';
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."place_order"("order_data" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  new_order_id UUID;
  result_order JSONB;
BEGIN
  -- Insert the order
  INSERT INTO orders (
    customer_name,
    customer_email,
    customer_phone,
    shipping_address,
    items,
    subtotal,
    shipping_cost,
    discount,
    total,
    status,
    payment_method,
    payment_status,
    payment_id, -- Handle optional field
    coupon_code,
    created_at
  ) VALUES (
    (order_data->>'customer_name')::VARCHAR,
    (order_data->>'customer_email')::VARCHAR,
    (order_data->>'customer_phone')::VARCHAR,
    (order_data->'shipping_address'),
    (order_data->'items'),
    (order_data->>'subtotal')::DECIMAL,
    (order_data->>'shipping_cost')::DECIMAL,
    (order_data->>'discount')::DECIMAL,
    (order_data->>'total')::DECIMAL,
    COALESCE((order_data->>'status')::order_status, 'pending'),
    (order_data->>'payment_method')::VARCHAR,
    COALESCE((order_data->>'payment_status')::VARCHAR, 'pending'),
    (order_data->>'payment_id')::VARCHAR,
    (order_data->>'coupon_code')::VARCHAR,
    NOW()
  )
  RETURNING id INTO new_order_id;

  -- Verify and return the full order as JSON
  -- We select back the data to ensure we have the generated ID and timestamps
  SELECT to_jsonb(o) INTO result_order
  FROM orders o
  WHERE id = new_order_id;

  RETURN result_order;
EXCEPTION WHEN OTHERS THEN
  -- Raise exception to be caught by client
  RAISE EXCEPTION 'Failed to place order: %', SQLERRM;
END;
$$;


ALTER FUNCTION "public"."place_order"("order_data" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."addresses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" character varying(255) NOT NULL,
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "phone" character varying(20) NOT NULL,
    "address" "text" NOT NULL,
    "city" character varying(100) NOT NULL,
    "state" character varying(100) NOT NULL,
    "zip_code" character varying(20) NOT NULL,
    "is_default" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."addresses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."admin_users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" character varying(255) NOT NULL,
    "password_hash" character varying(255) NOT NULL,
    "name" character varying(255),
    "role" character varying(50) DEFAULT 'admin'::character varying,
    "active" boolean DEFAULT true,
    "last_login" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."admin_users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "customer_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "booking_date" "date" NOT NULL,
    "time_slot" "text" NOT NULL,
    "package_id" "text",
    "package_name" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "notes" "text",
    "user_id" "uuid",
    CONSTRAINT "bookings_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'confirmed'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."cart_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" character varying(255) NOT NULL,
    "product_id" "uuid",
    "quantity" integer DEFAULT 1,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "selected_size" "text",
    "variant_id" "text",
    "selected_color" "text"
);


ALTER TABLE "public"."cart_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."coupons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "type" "text" NOT NULL,
    "discount" numeric NOT NULL,
    "min_order" numeric DEFAULT 0,
    "max_discount" numeric DEFAULT 0,
    "start_date" timestamp with time zone,
    "expiry" timestamp with time zone NOT NULL,
    "usage_limit" integer DEFAULT 0,
    "per_user_limit" integer DEFAULT 0,
    "included_categories" "jsonb" DEFAULT '[]'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "coupons_type_check" CHECK (("type" = ANY (ARRAY['percentage'::"text", 'flat'::"text"])))
);


ALTER TABLE "public"."coupons" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."custom_requests" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "phone" character varying(50),
    "occasion" character varying(100),
    "budget" character varying(50),
    "timeline" character varying(50),
    "color_preferences" "text",
    "style_preferences" "text",
    "description" "text" NOT NULL,
    "reference_images" "text"[] DEFAULT '{}'::"text"[],
    "status" "public"."request_status" DEFAULT 'new'::"public"."request_status",
    "admin_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."custom_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."gallery" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "title" character varying(255) NOT NULL,
    "description" "text",
    "image_url" "text" NOT NULL,
    "category" character varying(100) NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "featured" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "images" "text"[] DEFAULT '{}'::"text"[]
);


ALTER TABLE "public"."gallery" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mehndi_bookings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "phone" character varying(50) NOT NULL,
    "service_type" character varying(100) NOT NULL,
    "date" "date" NOT NULL,
    "time" time without time zone NOT NULL,
    "duration" character varying(50),
    "location" character varying(255),
    "guest_count" integer,
    "special_requests" "text",
    "status" "public"."booking_status" DEFAULT 'pending'::"public"."booking_status",
    "total_cost" numeric(10,2),
    "admin_notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."mehndi_bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "phone" character varying(50),
    "subject" character varying(255) NOT NULL,
    "message" "text" NOT NULL,
    "read" boolean DEFAULT false,
    "replied" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_email" character varying(255) NOT NULL,
    "title" character varying(255) NOT NULL,
    "message" "text" NOT NULL,
    "type" character varying(50) DEFAULT 'info'::character varying,
    "is_read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "action_link" character varying(255)
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."order_status_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "order_id" "uuid",
    "status" character varying(100) NOT NULL,
    "location" character varying(255),
    "timestamp" timestamp with time zone DEFAULT "now"(),
    "remarks" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."order_status_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "customer_name" character varying(255) NOT NULL,
    "customer_email" character varying(255) NOT NULL,
    "customer_phone" character varying(50),
    "shipping_address" "jsonb" NOT NULL,
    "items" "jsonb" NOT NULL,
    "subtotal" numeric(10,2) NOT NULL,
    "shipping_cost" numeric(10,2) DEFAULT 0,
    "discount" numeric(10,2) DEFAULT 0,
    "total" numeric(10,2) NOT NULL,
    "status" "public"."order_status" DEFAULT 'pending'::"public"."order_status",
    "payment_method" character varying(50),
    "payment_status" character varying(50) DEFAULT 'pending'::character varying,
    "coupon_code" character varying(50),
    "special_instructions" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "payment_id" character varying(255),
    "waybill_id" character varying(100),
    "tracking_url" "text",
    "courier_partner" character varying(100) DEFAULT 'Delhivery'::character varying,
    "shipping_metadata" "jsonb",
    "current_status" character varying(50) DEFAULT 'Placed'::character varying,
    "last_status_at" timestamp with time zone DEFAULT "now"(),
    "expected_delivery_date" timestamp with time zone,
    "estimated_shipping_cost" numeric(10,2),
    "final_shipping_cost" numeric(10,2),
    "charged_weight" numeric(10,2),
    "pricing_checked_at" timestamp with time zone,
    "courier_name" "text",
    "estimated_shipping_date" timestamp with time zone,
    "user_id" "uuid"
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


COMMENT ON COLUMN "public"."orders"."estimated_shipping_cost" IS 'Shipping cost calculated via Delhivery Rate API before shipment';



COMMENT ON COLUMN "public"."orders"."final_shipping_cost" IS 'Actual shipping cost charged by Delhivery (to be reconciled later)';



COMMENT ON COLUMN "public"."orders"."charged_weight" IS 'Weight used for calculation in Grams';



COMMENT ON COLUMN "public"."orders"."estimated_shipping_date" IS 'Expected date when the order will be shipped';



CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "price" numeric(10,2) NOT NULL,
    "original_price" numeric(10,2),
    "specifications" "text",
    "category" character varying(100) NOT NULL,
    "images" "text"[] DEFAULT '{}'::"text"[],
    "featured" boolean DEFAULT false,
    "active" boolean DEFAULT true,
    "stock_quantity" integer DEFAULT 0,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "fabric" "text",
    "clothing_information" "jsonb",
    "variants" "jsonb" DEFAULT '[]'::"jsonb",
    "is_combo" boolean DEFAULT false,
    "bundled_items" "jsonb" DEFAULT '[]'::"jsonb"
);


ALTER TABLE "public"."products" OWNER TO "postgres";


COMMENT ON COLUMN "public"."products"."clothing_information" IS 'Stores clothing-specific details like gender, sizes (with stock), fit, fabric, pattern, etc. in JSONB format.';



CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "product_id" "uuid",
    "user_name" "text" NOT NULL,
    "rating" integer,
    "comment" "text",
    "status" "text" DEFAULT 'pending'::"text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "user_email" "text",
    "user_id" "text",
    "order_id" "uuid",
    CONSTRAINT "reviews_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "reviews_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "firebase_uid" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "display_name" character varying(255),
    "photo_url" "text",
    "provider" character varying(50) DEFAULT 'email'::character varying,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "last_login" timestamp with time zone DEFAULT "now"(),
    "phone_number" character varying(20)
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."website_settings" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "setting_key" character varying(100) NOT NULL,
    "setting_value" "jsonb",
    "description" "text",
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."website_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."wishlist_items" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" character varying(255) NOT NULL,
    "product_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "variant_id" "text"
);


ALTER TABLE "public"."wishlist_items" OWNER TO "postgres";


ALTER TABLE ONLY "public"."addresses"
    ADD CONSTRAINT "addresses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."admin_users"
    ADD CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_user_id_product_id_key" UNIQUE ("user_id", "product_id");



ALTER TABLE ONLY "public"."coupons"
    ADD CONSTRAINT "coupons_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."coupons"
    ADD CONSTRAINT "coupons_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."custom_requests"
    ADD CONSTRAINT "custom_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."gallery"
    ADD CONSTRAINT "gallery_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mehndi_bookings"
    ADD CONSTRAINT "mehndi_bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."order_status_logs"
    ADD CONSTRAINT "order_status_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "unique_user_product_review" UNIQUE ("user_email", "product_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_firebase_uid_key" UNIQUE ("firebase_uid");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."website_settings"
    ADD CONSTRAINT "website_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."website_settings"
    ADD CONSTRAINT "website_settings_setting_key_key" UNIQUE ("setting_key");



ALTER TABLE ONLY "public"."wishlist_items"
    ADD CONSTRAINT "wishlist_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."wishlist_items"
    ADD CONSTRAINT "wishlist_items_user_id_product_id_key" UNIQUE ("user_id", "product_id");



CREATE UNIQUE INDEX "cart_items_variant_unique" ON "public"."cart_items" USING "btree" ("user_id", "product_id", COALESCE("variant_id", ''::"text"), COALESCE("selected_size", ''::"text"), COALESCE("selected_color", ''::"text"));



CREATE INDEX "idx_cart_items_variant_id" ON "public"."cart_items" USING "btree" ("variant_id");



CREATE INDEX "idx_custom_requests_status" ON "public"."custom_requests" USING "btree" ("status");



CREATE INDEX "idx_gallery_category" ON "public"."gallery" USING "btree" ("category");



CREATE INDEX "idx_mehndi_bookings_date" ON "public"."mehndi_bookings" USING "btree" ("date");



CREATE INDEX "idx_mehndi_bookings_status" ON "public"."mehndi_bookings" USING "btree" ("status");



CREATE INDEX "idx_messages_read" ON "public"."messages" USING "btree" ("read");



CREATE INDEX "idx_notifications_email" ON "public"."notifications" USING "btree" ("user_email");



CREATE INDEX "idx_notifications_is_read" ON "public"."notifications" USING "btree" ("is_read");



CREATE INDEX "idx_order_logs_order_id" ON "public"."order_status_logs" USING "btree" ("order_id");



CREATE INDEX "idx_orders_created_at" ON "public"."orders" USING "btree" ("created_at");



CREATE INDEX "idx_orders_payment_id" ON "public"."orders" USING "btree" ("payment_id");



CREATE INDEX "idx_orders_status" ON "public"."orders" USING "btree" ("status");



CREATE INDEX "idx_orders_user_id" ON "public"."orders" USING "btree" ("user_id");



CREATE INDEX "idx_orders_waybill_id" ON "public"."orders" USING "btree" ("waybill_id");



CREATE INDEX "idx_products_category" ON "public"."products" USING "btree" ("category");



CREATE INDEX "idx_products_featured" ON "public"."products" USING "btree" ("featured");



CREATE INDEX "idx_reviews_order_id" ON "public"."reviews" USING "btree" ("order_id");



CREATE INDEX "idx_reviews_product_approved" ON "public"."reviews" USING "btree" ("product_id") WHERE ("status" = 'approved'::"text");



CREATE INDEX "idx_reviews_product_id" ON "public"."reviews" USING "btree" ("product_id");



CREATE INDEX "idx_reviews_status" ON "public"."reviews" USING "btree" ("status");



CREATE INDEX "idx_reviews_user_id" ON "public"."reviews" USING "btree" ("user_id");



CREATE INDEX "idx_wishlist_items_variant_id" ON "public"."wishlist_items" USING "btree" ("variant_id");



CREATE OR REPLACE TRIGGER "update_custom_requests_updated_at" BEFORE UPDATE ON "public"."custom_requests" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_mehndi_bookings_updated_at" BEFORE UPDATE ON "public"."mehndi_bookings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_orders_updated_at" BEFORE UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_products_updated_at" BEFORE UPDATE ON "public"."products" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_website_settings_updated_at" BEFORE UPDATE ON "public"."website_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."cart_items"
    ADD CONSTRAINT "cart_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."order_status_logs"
    ADD CONSTRAINT "order_status_logs_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."wishlist_items"
    ADD CONSTRAINT "wishlist_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;



CREATE POLICY "Admin Full Access" ON "public"."notifications" TO "authenticated" USING (((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'admin@enbroidery.com'::"text") OR (( SELECT ("auth"."jwt"() ->> 'email'::"text")) IN ( SELECT "admin_users"."email"
   FROM "public"."admin_users")))) WITH CHECK (((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'admin@enbroidery.com'::"text") OR (( SELECT ("auth"."jwt"() ->> 'email'::"text")) IN ( SELECT "admin_users"."email"
   FROM "public"."admin_users"))));



CREATE POLICY "Admin can create notifications" ON "public"."notifications" FOR INSERT WITH CHECK ("public"."is_admin"());



CREATE POLICY "Admin can manage all orders" ON "public"."orders" USING ("public"."is_admin"());



CREATE POLICY "Admin can manage custom_requests" ON "public"."custom_requests" USING ("public"."is_admin"());



CREATE POLICY "Admin can manage mehndi_bookings" ON "public"."mehndi_bookings" USING ("public"."is_admin"());



CREATE POLICY "Admin can manage messages" ON "public"."messages" USING ("public"."is_admin"());



CREATE POLICY "Admin can manage users" ON "public"."users" USING ("public"."is_admin"());



CREATE POLICY "Admin can write coupons" ON "public"."coupons" USING ("public"."is_admin"());



CREATE POLICY "Admin can write gallery" ON "public"."gallery" USING ("public"."is_admin"());



CREATE POLICY "Admin can write order logs" ON "public"."order_status_logs" USING ("public"."is_admin"());



CREATE POLICY "Admin can write products" ON "public"."products" USING ("public"."is_admin"());



CREATE POLICY "Admin can write website_settings" ON "public"."website_settings" USING ("public"."is_admin"());



CREATE POLICY "Admins can create products" ON "public"."products" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'admin@enbroidery.com'::"text"));



CREATE POLICY "Admins can delete orders" ON "public"."orders" FOR DELETE TO "authenticated" USING ((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'admin@enbroidery.com'::"text"));



CREATE POLICY "Admins can delete products" ON "public"."products" FOR DELETE TO "authenticated" USING ((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'admin@enbroidery.com'::"text"));



CREATE POLICY "Admins can delete reviews" ON "public"."reviews" FOR DELETE TO "authenticated" USING ((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'admin@enbroidery.com'::"text"));



CREATE POLICY "Admins can insert status logs" ON "public"."order_status_logs" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'admin@enbroidery.com'::"text"));



CREATE POLICY "Admins can update orders" ON "public"."orders" FOR UPDATE TO "authenticated" USING ((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'admin@enbroidery.com'::"text"));



CREATE POLICY "Admins can update products" ON "public"."products" FOR UPDATE TO "authenticated" USING ((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'admin@enbroidery.com'::"text")) WITH CHECK ((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'admin@enbroidery.com'::"text"));



CREATE POLICY "Admins can update reviews" ON "public"."reviews" FOR UPDATE TO "authenticated" USING ((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'admin@enbroidery.com'::"text"));



CREATE POLICY "Allow Admin Write Access" ON "public"."website_settings" TO "authenticated" USING ((("auth"."jwt"() ->> 'email'::"text") = 'admin@enbroidery.com'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") = 'admin@enbroidery.com'::"text"));



CREATE POLICY "Allow Any Auth Insert" ON "public"."notifications" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow Any Insert (Dev Bypass)" ON "public"."notifications" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Allow Public Read Access" ON "public"."website_settings" FOR SELECT USING (true);



CREATE POLICY "Allow admins to update bookings" ON "public"."bookings" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text"));



CREATE POLICY "Allow admins to update bookings" ON "public"."mehndi_bookings" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text"));



CREATE POLICY "Allow app access to addresses" ON "public"."addresses" USING (true) WITH CHECK (true);



CREATE POLICY "Allow app access to cart" ON "public"."cart_items" USING (true) WITH CHECK (true);



CREATE POLICY "Allow app access to wishlist" ON "public"."wishlist_items" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated to insert admin_users" ON "public"."admin_users" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated to update admin_users" ON "public"."admin_users" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated to view admin_users" ON "public"."admin_users" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow full access for now" ON "public"."website_settings" USING (true) WITH CHECK (true);



CREATE POLICY "Allow public insert access" ON "public"."bookings" FOR INSERT WITH CHECK (true);



CREATE POLICY "Allow public read access" ON "public"."website_settings" FOR SELECT USING (true);



CREATE POLICY "Anyone can create bookings" ON "public"."mehndi_bookings" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can create messages" ON "public"."messages" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can create orders" ON "public"."orders" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can delete bookings" ON "public"."mehndi_bookings" FOR DELETE USING (true);



CREATE POLICY "Anyone can delete gallery images" ON "public"."gallery" FOR DELETE USING (true);



CREATE POLICY "Anyone can insert gallery images" ON "public"."gallery" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can submit custom_requests" ON "public"."custom_requests" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can submit mehndi_bookings" ON "public"."mehndi_bookings" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can submit messages" ON "public"."messages" FOR INSERT WITH CHECK (true);



CREATE POLICY "Anyone can update gallery images" ON "public"."gallery" FOR UPDATE USING (true);



CREATE POLICY "Anyone can view all orders" ON "public"."orders" FOR SELECT USING (true);



CREATE POLICY "Anyone can view messages" ON "public"."messages" FOR SELECT USING (true);



CREATE POLICY "Anyone can view reviews" ON "public"."reviews" FOR SELECT USING (true);



CREATE POLICY "Enable delete for authenticated users only" ON "public"."coupons" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable delete for authenticated users only" ON "public"."products" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Enable full access for all users" ON "public"."custom_requests" USING (true) WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."coupons" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable read access for all users" ON "public"."coupons" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."order_status_logs" FOR SELECT USING (true);



CREATE POLICY "Enable update for authenticated users only" ON "public"."coupons" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Public Delete" ON "public"."notifications" FOR DELETE TO "authenticated", "anon" USING (true);



CREATE POLICY "Public Insert" ON "public"."notifications" FOR INSERT TO "authenticated", "anon" WITH CHECK (true);



CREATE POLICY "Public Select" ON "public"."notifications" FOR SELECT TO "authenticated", "anon" USING (true);



CREATE POLICY "Public Update" ON "public"."notifications" FOR UPDATE TO "authenticated", "anon" USING (true) WITH CHECK (true);



CREATE POLICY "Public can read coupons" ON "public"."coupons" FOR SELECT USING (true);



CREATE POLICY "Public can read gallery" ON "public"."gallery" FOR SELECT USING (true);



CREATE POLICY "Public can read products" ON "public"."products" FOR SELECT USING (true);



CREATE POLICY "Public can read website_settings" ON "public"."website_settings" FOR SELECT USING (true);



CREATE POLICY "Public can view gallery" ON "public"."gallery" FOR SELECT USING (true);



CREATE POLICY "Public insert access" ON "public"."users" FOR INSERT WITH CHECK (true);



CREATE POLICY "Public select access" ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "Public update access" ON "public"."notifications" FOR UPDATE USING (true);



CREATE POLICY "Public update access" ON "public"."users" FOR UPDATE USING (true);



CREATE POLICY "Public view" ON "public"."products" FOR SELECT USING (true);



CREATE POLICY "Users can delete their own cart items" ON "public"."cart_items" FOR DELETE USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can insert their own cart items" ON "public"."cart_items" FOR INSERT WITH CHECK ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can insert their own orders" ON "public"."orders" FOR INSERT WITH CHECK ((("auth"."jwt"() ->> 'email'::"text") = ("customer_email")::"text"));



CREATE POLICY "Users can manage their notifications" ON "public"."notifications" USING ((("auth"."jwt"() ->> 'email'::"text") = ("user_email")::"text"));



CREATE POLICY "Users can manage their own addresses" ON "public"."addresses" USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can manage their own cart" ON "public"."cart_items" USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can manage their own wishlist" ON "public"."wishlist_items" USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can read their order logs" ON "public"."order_status_logs" FOR SELECT USING (true);



CREATE POLICY "Users can read their own orders" ON "public"."orders" FOR SELECT USING ((("auth"."jwt"() ->> 'email'::"text") = ("customer_email")::"text"));



CREATE POLICY "Users can read their own profile" ON "public"."users" FOR SELECT USING ((("auth"."uid"())::"text" = ("id")::"text"));



CREATE POLICY "Users can update their own cart items" ON "public"."cart_items" FOR UPDATE USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



CREATE POLICY "Users can update their own profile" ON "public"."users" FOR UPDATE USING ((("auth"."uid"())::"text" = ("id")::"text"));



CREATE POLICY "Users can view their own cart items" ON "public"."cart_items" FOR SELECT USING ((("auth"."uid"())::"text" = ("user_id")::"text"));



ALTER TABLE "public"."addresses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."admin_users" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."cart_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."coupons" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."custom_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."gallery" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "insert_reviews_v5" ON "public"."reviews" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."role"() AS "role") = 'authenticated'::"text"));



ALTER TABLE "public"."mehndi_bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."order_status_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "view_bookings_consolidated_v5" ON "public"."bookings" FOR SELECT TO "authenticated" USING ((("user_id" = ( SELECT "auth"."uid"() AS "uid")) OR (( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'admin@enbroidery.com'::"text")));



CREATE POLICY "view_bookings_consolidated_v5" ON "public"."mehndi_bookings" FOR SELECT TO "authenticated" USING (((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = ("email")::"text") OR (( SELECT ("auth"."jwt"() ->> 'email'::"text")) = 'admin@enbroidery.com'::"text")));



ALTER TABLE "public"."website_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."wishlist_items" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."notifications";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."cancel_order"("p_order_id" "uuid", "p_email" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."cancel_order"("p_order_id" "uuid", "p_email" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cancel_order"("p_order_id" "uuid", "p_email" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."delete_notification"("notification_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_notification"("notification_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_notification"("notification_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."place_order"("order_data" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."place_order"("order_data" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."place_order"("order_data" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."addresses" TO "anon";
GRANT ALL ON TABLE "public"."addresses" TO "authenticated";
GRANT ALL ON TABLE "public"."addresses" TO "service_role";



GRANT ALL ON TABLE "public"."admin_users" TO "anon";
GRANT ALL ON TABLE "public"."admin_users" TO "authenticated";
GRANT ALL ON TABLE "public"."admin_users" TO "service_role";



GRANT ALL ON TABLE "public"."bookings" TO "anon";
GRANT ALL ON TABLE "public"."bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."bookings" TO "service_role";



GRANT ALL ON TABLE "public"."cart_items" TO "anon";
GRANT ALL ON TABLE "public"."cart_items" TO "authenticated";
GRANT ALL ON TABLE "public"."cart_items" TO "service_role";



GRANT ALL ON TABLE "public"."coupons" TO "anon";
GRANT ALL ON TABLE "public"."coupons" TO "authenticated";
GRANT ALL ON TABLE "public"."coupons" TO "service_role";



GRANT ALL ON TABLE "public"."custom_requests" TO "anon";
GRANT ALL ON TABLE "public"."custom_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."custom_requests" TO "service_role";



GRANT ALL ON TABLE "public"."gallery" TO "anon";
GRANT ALL ON TABLE "public"."gallery" TO "authenticated";
GRANT ALL ON TABLE "public"."gallery" TO "service_role";



GRANT ALL ON TABLE "public"."mehndi_bookings" TO "anon";
GRANT ALL ON TABLE "public"."mehndi_bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."mehndi_bookings" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."order_status_logs" TO "anon";
GRANT ALL ON TABLE "public"."order_status_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."order_status_logs" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT ALL ON TABLE "public"."website_settings" TO "anon";
GRANT ALL ON TABLE "public"."website_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."website_settings" TO "service_role";



GRANT ALL ON TABLE "public"."wishlist_items" TO "anon";
GRANT ALL ON TABLE "public"."wishlist_items" TO "authenticated";
GRANT ALL ON TABLE "public"."wishlist_items" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































