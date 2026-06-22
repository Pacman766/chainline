import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_site_settings_socials_platform" AS ENUM('telegram', 'instagram', 'youtube', 'vk', 'x', 'facebook');
  CREATE TABLE "products_locales" (
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "search_locales" (
  	"title" varchar,
  	"meta_name" varchar,
  	"meta_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_socials_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  ALTER TABLE "_products_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_products_v" ADD COLUMN "published_locale" "enum__products_v_published_locale";
  ALTER TABLE "site_settings" ADD COLUMN "contact_phone" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_address" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_working_hours" varchar;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "search_locales" ADD CONSTRAINT "search_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_socials" ADD CONSTRAINT "site_settings_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "search_locales_locale_parent_id_unique" ON "search_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_socials_order_idx" ON "site_settings_socials" USING btree ("_order");
  CREATE INDEX "site_settings_socials_parent_id_idx" ON "site_settings_socials" USING btree ("_parent_id");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  ALTER TABLE "products" DROP COLUMN "description";
  ALTER TABLE "_products_v" DROP COLUMN "version_description";
  ALTER TABLE "categories" DROP COLUMN "name";
  ALTER TABLE "search" DROP COLUMN "title";
  ALTER TABLE "search" DROP COLUMN "meta_description";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "search_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_socials" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "search_locales" CASCADE;
  DROP TABLE "site_settings_socials" CASCADE;
  DROP INDEX "_products_v_snapshot_idx";
  DROP INDEX "_products_v_published_locale_idx";
  ALTER TABLE "products" ADD COLUMN "description" jsonb;
  ALTER TABLE "_products_v" ADD COLUMN "version_description" jsonb;
  ALTER TABLE "categories" ADD COLUMN "name" varchar NOT NULL;
  ALTER TABLE "search" ADD COLUMN "title" varchar;
  ALTER TABLE "search" ADD COLUMN "meta_description" varchar;
  ALTER TABLE "_products_v" DROP COLUMN "snapshot";
  ALTER TABLE "_products_v" DROP COLUMN "published_locale";
  ALTER TABLE "site_settings" DROP COLUMN "contact_phone";
  ALTER TABLE "site_settings" DROP COLUMN "contact_address";
  ALTER TABLE "site_settings" DROP COLUMN "contact_working_hours";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_site_settings_socials_platform";`)
}
