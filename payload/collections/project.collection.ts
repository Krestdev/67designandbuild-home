import { CollectionConfig } from "payload";

export const Project: CollectionConfig = {
  slug: "project",
  admin: { useAsTitle: "title" },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text" },
    {
      name: "category",
      type: "relationship",
      relationTo: "sector",
      required: true,
    },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "content", type: "richText", localized: true },
  ],
};