import { CollectionConfig } from "payload";

export const Blog: CollectionConfig = {
  slug: "blog",
  admin: { useAsTitle: "title" },
  access: {
    read: () => true, // 許可する
  },
  fields: [
    { name: "title", type: "text", localized: true },
    { name: "slug", type: "text" },
    { name: "content", type: "richText", localized: true },
    { name: "preveiw", type: "upload", relationTo: "media" },
  ],
};
