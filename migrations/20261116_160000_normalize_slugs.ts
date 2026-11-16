import { MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * Data only (no schema change): slugs saved before the slug field normalized its
 * input (e.g. "Metal construction", "Commercial & Offices ") made their detail
 * pages unreachable. Rewrite every slug that is not already clean; clean slugs are
 * left untouched so existing URLs keep working. proxy.ts redirects the old URLs.
 *
 * The slug rules are copied here on purpose: a migration must keep doing the same
 * thing even if lib/slug.ts changes later.
 */

const TABLES = ['services', 'sectors', 'catalogs', 'blog', 'career', 'categories', 'articles'] as const

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const slugify = (value: string): string =>
  value
    .replace(/œ/g, 'oe')
    .replace(/Œ/g, 'OE')
    .replace(/æ/g, 'ae')
    .replace(/Æ/g, 'AE')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  for (const table of TABLES) {
    const { rows } = await db.execute(sql.raw(`SELECT "id", "slug" FROM "${table}" ORDER BY "id"`))
    const docs = rows as { id: number; slug: string | null }[]
    const taken = new Set(docs.map((d) => d.slug).filter((s): s is string => Boolean(s)))

    for (const { id, slug } of docs) {
      if (slug && SLUG_PATTERN.test(slug)) continue

      // Clean form; on a collision (or nothing usable left) fall back to "<base>-<id>",
      // which is unique because ids are.
      const base = slugify(slug ?? '') || table
      const next = taken.has(base) ? `${base}-${id}` : base

      await db.execute(sql`UPDATE ${sql.identifier(table)} SET "slug" = ${next} WHERE "id" = ${id}`)
      if (slug) taken.delete(slug)
      taken.add(next)
      payload.logger.info(`[normalize_slugs] ${table} #${id}: ${JSON.stringify(slug)} -> "${next}"`)
    }
  }
}

export async function down(): Promise<void> {
  // Not reversible: the old slugs were broken URLs; nothing should depend on them.
}
