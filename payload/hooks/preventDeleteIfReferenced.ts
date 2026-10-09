import { APIError, type CollectionBeforeDeleteHook, type CollectionSlug } from "payload";

type Reference = { collection: CollectionSlug; field: string; label: string };

/**
 * Blocks deleting a document while other documents still point to it through a
 * required relationship. The DB would otherwise null that field (ON DELETE SET
 * NULL), leaving documents that fail validation on their next save.
 */
export const preventDeleteIfReferenced =
  (references: Reference[]): CollectionBeforeDeleteHook =>
  async ({ id, req }) => {
    const blockers: string[] = [];

    for (const { collection, field, label } of references) {
      const { totalDocs } = await req.payload.count({
        collection,
        where: { [field]: { equals: id } },
        req,
      });
      if (totalDocs > 0) blockers.push(`${totalDocs} ${label}`);
    }

    if (blockers.length > 0) {
      throw new APIError(
        `Suppression impossible : encore utilisé par ${blockers.join(", ")}. Réassignez-les d'abord.`,
        409,
        undefined,
        true,
      );
    }
  };
