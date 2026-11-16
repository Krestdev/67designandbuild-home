/**
 * URL slug rules, shared by the admin slug field (payload/fields/slug.ts) and
 * proxy.ts, which redirects badly formed slug URLs to their clean version.
 * No Payload import here: proxy.ts runs before every matching request.
 */

/** A clean slug: lowercase letters/digits separated by single dashes. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const isValidSlug = (value: string): boolean => SLUG_PATTERN.test(value);

/** "Maîtrise d'œuvre complète" -> "maitrise-doeuvre-complete", "Metal construction" -> "metal-construction". */
export const slugify = (value: string): string =>
  value
    // Ligatures are not split by NFD and would otherwise be dropped ("œuvre" -> "uvre").
    .replace(/œ/g, "oe")
    .replace(/Œ/g, "OE")
    .replace(/æ/g, "ae")
    .replace(/Æ/g, "AE")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    // Elisions stay one word: "d'œuvre" -> "doeuvre", not "d-oeuvre".
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
