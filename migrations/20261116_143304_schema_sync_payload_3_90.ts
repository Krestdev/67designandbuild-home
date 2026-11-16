import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Payload 3.90 added `resetPasswordRequestedAt` to auth collections; every admin
// login/session lookup selects it. Generated with `payload migrate:create`, which
// found no other differences against the previous snapshot.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Idempotent: local dev databases may already have this schema from `push`.
  await db.execute(sql`
   ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "reset_password_requested_at" timestamp(3) with time zone;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users" DROP COLUMN IF EXISTS "reset_password_requested_at";`)
}
