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
    { name: "content", type: "richText", localized: true },
    { name: "preveiw", type: "upload", relationTo: "media" },
    {
      name: "category",
      type: "relationship",
      relationTo: "Sectors",
      required: true,
    },
  ],
};