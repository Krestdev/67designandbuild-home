import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Idempotent: local dev databases may already have this schema from `push`.
  await db.execute(sql`
   ALTER TABLE "footer_usefull_links" ADD COLUMN IF NOT EXISTS "url" varchar;
  ALTER TABLE "footer_enterprise" ADD COLUMN IF NOT EXISTS "url" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "footer_usefull_links" DROP COLUMN "url";
  ALTER TABLE "footer_enterprise" DROP COLUMN "url";`)
}
