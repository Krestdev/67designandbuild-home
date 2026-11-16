import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// @payloadcms/storage-s3 3.90 adds an `_objectKey` field to every upload collection
// (alwaysInsertFields), and Payload selects it on every media query. Without the column
// every page that loads an image fails with: column "_objectkey" does not exist.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Idempotent: local dev databases may already have this schema from `push`.
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN IF NOT EXISTS "_objectkey" varchar;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN IF EXISTS "_objectkey";`)
}
