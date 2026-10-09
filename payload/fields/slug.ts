import type { Field } from "payload";

export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Required, unique URL slug. Generated from `sourceField` when left empty,
 * and normalized when typed by hand.
 */
export const slugField = (sourceField = "title"): Field => ({
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
    description: `Partie de l'URL. Laisser vide pour la générer depuis « ${sourceField} ».`,
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
});
