import type { Field } from "payload";
import { slugify } from "../../lib/slug";

export { slugify };

/**
 * Required, unique URL slug. Generated from `sourceField` when left empty,
 * and normalized when typed by hand ("Metal construction" -> "metal-construction").
 */
export const slugField = (sourceField = "title"): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
    description:
      `Partie de l'URL, par ex. « construction-metallique ». Laisser vide pour la générer depuis « ${sourceField} ». ` +
      "Majuscules, espaces et accents sont convertis automatiquement à l'enregistrement.",
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === "string" && value.trim()) return slugify(value);
        const source = data?.[sourceField];
        return typeof source === "string" && source.trim() ? slugify(source) : value;
      },
    ],
  },
  // Runs on the raw input in the admin form too, so accept anything the hook above
  // can turn into a slug; reject only input that would leave an empty slug.
  validate: (value: unknown, { data }: { data?: Record<string, unknown> }) => {
    if (typeof value === "string" && value.trim()) {
      return slugify(value)
        ? true
        : "Le slug doit contenir au moins une lettre ou un chiffre (ex. « construction-metallique »).";
    }
    const source = data?.[sourceField];
    return typeof source === "string" && slugify(source)
      ? true
      : `Renseignez le slug ou le champ « ${sourceField} » pour le générer.`;
  },
});
