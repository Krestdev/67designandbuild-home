import { CollectionConfig } from "payload";

export const Category: CollectionConfig = {
  slug: "categories",
  admin: { useAsTitle: "title" },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text" },
  ],
};