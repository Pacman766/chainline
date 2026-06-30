import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_homepage_blocks_feature_grid_items_icon" AS ENUM('star', 'check', 'bolt', 'heart', 'shield', 'globe');
  CREATE TABLE "homepage_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_homepage_blocks_feature_grid_items_icon"
  );
  
  CREATE TABLE "homepage_blocks_feature_grid_items_locales" (
  	"title" varchar,
  	"desc" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"button_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_cta_locales" (
  	"heading" varchar,
  	"sub" varchar,
  	"button_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage_blocks_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "homepage_blocks_contacts_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "homepage_blocks_feature_grid_items" ADD CONSTRAINT "homepage_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_feature_grid_items_locales" ADD CONSTRAINT "homepage_blocks_feature_grid_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_feature_grid_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_feature_grid" ADD CONSTRAINT "homepage_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta" ADD CONSTRAINT "homepage_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_cta_locales" ADD CONSTRAINT "homepage_blocks_cta_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_cta"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_contacts" ADD CONSTRAINT "homepage_blocks_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "homepage_blocks_contacts_locales" ADD CONSTRAINT "homepage_blocks_contacts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."homepage_blocks_contacts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "homepage_blocks_feature_grid_items_order_idx" ON "homepage_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "homepage_blocks_feature_grid_items_parent_id_idx" ON "homepage_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "homepage_blocks_feature_grid_items_locales_locale_parent_id_" ON "homepage_blocks_feature_grid_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_feature_grid_order_idx" ON "homepage_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "homepage_blocks_feature_grid_parent_id_idx" ON "homepage_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_feature_grid_path_idx" ON "homepage_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "homepage_blocks_cta_order_idx" ON "homepage_blocks_cta" USING btree ("_order");
  CREATE INDEX "homepage_blocks_cta_parent_id_idx" ON "homepage_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_cta_path_idx" ON "homepage_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_cta_locales_locale_parent_id_unique" ON "homepage_blocks_cta_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "homepage_blocks_contacts_order_idx" ON "homepage_blocks_contacts" USING btree ("_order");
  CREATE INDEX "homepage_blocks_contacts_parent_id_idx" ON "homepage_blocks_contacts" USING btree ("_parent_id");
  CREATE INDEX "homepage_blocks_contacts_path_idx" ON "homepage_blocks_contacts" USING btree ("_path");
  CREATE UNIQUE INDEX "homepage_blocks_contacts_locales_locale_parent_id_unique" ON "homepage_blocks_contacts_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "homepage_blocks_feature_grid_items" CASCADE;
  DROP TABLE "homepage_blocks_feature_grid_items_locales" CASCADE;
  DROP TABLE "homepage_blocks_feature_grid" CASCADE;
  DROP TABLE "homepage_blocks_cta" CASCADE;
  DROP TABLE "homepage_blocks_cta_locales" CASCADE;
  DROP TABLE "homepage_blocks_contacts" CASCADE;
  DROP TABLE "homepage_blocks_contacts_locales" CASCADE;
  DROP TABLE "homepage" CASCADE;
  DROP TYPE "public"."enum_homepage_blocks_feature_grid_items_icon";`)
}
