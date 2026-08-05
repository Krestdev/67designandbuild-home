import { CollectionConfig } from "payload";

export const Career: CollectionConfig = {
  slug: "career",
  admin: { useAsTitle: "title" },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text" },
    {
      name: "profile",
      type: "select",
      required: true,
      options: [
        { label: "Chantier & production", value: "chantier-production" },
        { label: "Bureau d'études", value: "bureau-etudes" },
      ],
    },
    {
      name: "contractType",
      type: "select",
      required: true,
      options: [
        { label: "CDI", value: "cdi" },
        { label: "CDD", value: "cdd" },
        { label: "Stage", value: "stage" },
      ],
    },
    { name: "location", type: "text", required: true },
    { name: "content", type: "richText", localized: true },
  ],
};