import { CollectionConfig } from "payload";

export const Article: CollectionConfig = {
  slug: "articles",
  admin: { useAsTitle: "title" },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text" },
    { name: "image", type: "upload", relationTo: "media", required: true },
    { name: "excerpt", type: "text", localized: true },
    { name: "publishedDate", type: "date", required: true },
    { name: "featured", type: "checkbox", defaultValue: false },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      required: true,
    },
    { name: "content", type: "richText", localized: true },
  ],
};