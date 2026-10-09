import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Idempotent: local dev databases may already have this schema from `push`.
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "footer_usefull_links_locales" (
  	"lable" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  DO $$ BEGIN
    ALTER TABLE "footer_usefull_links_locales" ADD CONSTRAINT "footer_usefull_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_usefull_links"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  CREATE UNIQUE INDEX IF NOT EXISTS "footer_usefull_links_locales_locale_parent_id_unique" ON "footer_usefull_links_locales" USING btree ("_locale","_parent_id");

  -- Keep existing labels: they become the French (default locale) version.
  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'footer_usefull_links' AND column_name = 'lable') THEN
      INSERT INTO "footer_usefull_links_locales" ("lable", "_locale", "_parent_id")
        SELECT "lable", 'fr', "id" FROM "footer_usefull_links" WHERE "lable" IS NOT NULL
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING;
      ALTER TABLE "footer_usefull_links" DROP COLUMN "lable";
    END IF;
  END $$;

  CREATE TABLE IF NOT EXISTS "footer_enterprise_locales" (
  	"lable" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  DO $$ BEGIN
    ALTER TABLE "footer_enterprise_locales" ADD CONSTRAINT "footer_enterprise_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer_enterprise"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;
  CREATE UNIQUE INDEX IF NOT EXISTS "footer_enterprise_locales_locale_parent_id_unique" ON "footer_enterprise_locales" USING btree ("_locale","_parent_id");

  -- Keep existing labels: they become the French (default locale) version.
  DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'footer_enterprise' AND column_name = 'lable') THEN
      INSERT INTO "footer_enterprise_locales" ("lable", "_locale", "_parent_id")
        SELECT "lable", 'fr', "id" FROM "footer_enterprise" WHERE "lable" IS NOT NULL
        ON CONFLICT ("_locale", "_parent_id") DO NOTHING;
      ALTER TABLE "footer_enterprise" DROP COLUMN "lable";
    END IF;
  END $$;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer_usefull_links" ADD COLUMN "lable" varchar;
  ALTER TABLE "footer_enterprise" ADD COLUMN "lable" varchar;
  UPDATE "footer_usefull_links" l SET "lable" = loc."lable" FROM "footer_usefull_links_locales" loc WHERE loc."_parent_id" = l."id" AND loc."_locale" = 'fr';
  UPDATE "footer_enterprise" l SET "lable" = loc."lable" FROM "footer_enterprise_locales" loc WHERE loc."_parent_id" = l."id" AND loc."_locale" = 'fr';
  DROP TABLE "footer_usefull_links_locales" CASCADE;
  DROP TABLE "footer_enterprise_locales" CASCADE;`)
}
