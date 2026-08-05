import { CollectionConfig } from "payload";

export const Catalog: CollectionConfig = {
  slug: "catalogs",
  admin: { useAsTitle: "title" },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text" },
    {
      name: "content",
      type: "richText",
      localized: true,
    }, // ONLY the intro narrative paragraphs now — do NOT include "Enjeux du chantier" or the closing paragraph here anymore
    { name: "preveiw", type: "upload", relationTo: "media" },
    {
      name: "category",
      type: "relationship",
      relationTo: "Sectors",
      required: true,
    }, // "Secteur" metadata — unchanged, existing field

    // ---- NEW FIELDS for the detail page ----
    { name: "client", type: "text" },
    {
      name: "serviceCategory",
      type: "relationship",
      relationTo: "Services",
    }, // "Catégorie" metadata — distinct from `category` (Sectors)
    { name: "duration", type: "text" }, // e.g. "6 Mois"
    {
      name: "status",
      type: "select",
      options: [
        { label: "Livré", value: "livre" },
        { label: "En cours", value: "en-cours" },
        { label: "Planifié", value: "planifie" },
      ],
    },
    {
      name: "challenges",
      type: "array",
      labels: { singular: "Challenge", plural: "Challenges" },
      fields: [{ name: "text", type: "text" }],
    }, // "Enjeux du chantier" bullets
    {
      name: "closingParagraph",
      type: "textarea",
      localized: true,
    }, // "Ce chantier illustre..." — renders AFTER the challenges bullets, per Figma (node 121:56/58)
    { name: "galleryPortrait", type: "upload", relationTo: "media" },
    { name: "galleryLandscape", type: "upload", relationTo: "media" },
  ],
};