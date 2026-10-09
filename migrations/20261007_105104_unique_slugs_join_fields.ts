import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Statements are idempotent (IF EXISTS / IF NOT EXISTS) because local dev
  // databases may already have part of this schema applied by `push`.
  await db.execute(sql`
  -- services: fill empty slugs, then de-duplicate by suffixing the id
  UPDATE "services" SET "slug" = 'services-' || "id" WHERE "slug" IS NULL OR btrim("slug") = '';
  UPDATE "services" t SET "slug" = t."slug" || '-' || t."id"
    WHERE EXISTS (SELECT 1 FROM "services" o WHERE o."slug" = t."slug" AND o."id" < t."id");
  -- sectors: fill empty slugs, then de-duplicate by suffixing the id
  UPDATE "sectors" SET "slug" = 'sectors-' || "id" WHERE "slug" IS NULL OR btrim("slug") = '';
  UPDATE "sectors" t SET "slug" = t."slug" || '-' || t."id"
    WHERE EXISTS (SELECT 1 FROM "sectors" o WHERE o."slug" = t."slug" AND o."id" < t."id");
  -- catalogs: fill empty slugs, then de-duplicate by suffixing the id
  UPDATE "catalogs" SET "slug" = 'catalogs-' || "id" WHERE "slug" IS NULL OR btrim("slug") = '';
  UPDATE "catalogs" t SET "slug" = t."slug" || '-' || t."id"
    WHERE EXISTS (SELECT 1 FROM "catalogs" o WHERE o."slug" = t."slug" AND o."id" < t."id");
  -- blog: fill empty slugs, then de-duplicate by suffixing the id
  UPDATE "blog" SET "slug" = 'blog-' || "id" WHERE "slug" IS NULL OR btrim("slug") = '';
  UPDATE "blog" t SET "slug" = t."slug" || '-' || t."id"
    WHERE EXISTS (SELECT 1 FROM "blog" o WHERE o."slug" = t."slug" AND o."id" < t."id");
  -- career: fill empty slugs, then de-duplicate by suffixing the id
  UPDATE "career" SET "slug" = 'career-' || "id" WHERE "slug" IS NULL OR btrim("slug") = '';
  UPDATE "career" t SET "slug" = t."slug" || '-' || t."id"
    WHERE EXISTS (SELECT 1 FROM "career" o WHERE o."slug" = t."slug" AND o."id" < t."id");
  -- categories: fill empty slugs, then de-duplicate by suffixing the id
  UPDATE "categories" SET "slug" = 'categories-' || "id" WHERE "slug" IS NULL OR btrim("slug") = '';
  UPDATE "categories" t SET "slug" = t."slug" || '-' || t."id"
    WHERE EXISTS (SELECT 1 FROM "categories" o WHERE o."slug" = t."slug" AND o."id" < t."id");
  -- articles: fill empty slugs, then de-duplicate by suffixing the id
  UPDATE "articles" SET "slug" = 'articles-' || "id" WHERE "slug" IS NULL OR btrim("slug") = '';
  UPDATE "articles" t SET "slug" = t."slug" || '-' || t."id"
    WHERE EXISTS (SELECT 1 FROM "articles" o WHERE o."slug" = t."slug" AND o."id" < t."id");

  ALTER TABLE "services" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "sectors" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "catalogs" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "blog" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "career" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "categories" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "slug" SET NOT NULL;
  CREATE UNIQUE INDEX IF NOT EXISTS "services_slug_idx" ON "services" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "sectors_slug_idx" ON "sectors" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "catalogs_slug_idx" ON "catalogs" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "blog_slug_idx" ON "blog" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "career_slug_idx" ON "career" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE UNIQUE INDEX IF NOT EXISTS "articles_slug_idx" ON "articles" USING btree ("slug");

  -- relatedProjects on Services/Sectors became join fields (derived from catalogs)
  DROP TABLE IF EXISTS "services_rels" CASCADE;
  ALTER TABLE "sectors_rels" DROP CONSTRAINT IF EXISTS "sectors_rels_catalogs_fk";
  DROP INDEX IF EXISTS "sectors_rels_catalogs_id_idx";
  DELETE FROM "sectors_rels" WHERE "path" = 'relatedProjects';
  ALTER TABLE "sectors_rels" DROP COLUMN IF EXISTS "catalogs_id";

  -- storage-s3 prefix column, now always present (alwaysInsertFields)
  ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "prefix" varchar DEFAULT '';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "services_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"catalogs_id" integer
  );
  
  DROP INDEX "services_slug_idx";
  DROP INDEX "sectors_slug_idx";
  DROP INDEX "catalogs_slug_idx";
  DROP INDEX "blog_slug_idx";
  DROP INDEX "career_slug_idx";
  DROP INDEX "categories_slug_idx";
  DROP INDEX "articles_slug_idx";
  ALTER TABLE "services" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "sectors" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "catalogs" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "blog" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "career" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "categories" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "articles" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "sectors_rels" ADD COLUMN "catalogs_id" integer;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_rels" ADD CONSTRAINT "services_rels_catalogs_fk" FOREIGN KEY ("catalogs_id") REFERENCES "public"."catalogs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_rels_order_idx" ON "services_rels" USING btree ("order");
  CREATE INDEX "services_rels_parent_idx" ON "services_rels" USING btree ("parent_id");
  CREATE INDEX "services_rels_path_idx" ON "services_rels" USING btree ("path");
  CREATE INDEX "services_rels_catalogs_id_idx" ON "services_rels" USING btree ("catalogs_id");
  ALTER TABLE "sectors_rels" ADD CONSTRAINT "sectors_rels_catalogs_fk" FOREIGN KEY ("catalogs_id") REFERENCES "public"."catalogs"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "sectors_rels_catalogs_id_idx" ON "sectors_rels" USING btree ("catalogs_id");
  ALTER TABLE "media" DROP COLUMN "prefix";`)
}
