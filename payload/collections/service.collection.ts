import { CollectionConfig } from "payload";

export const Service: CollectionConfig = {
  slug: "service",
  admin: { useAsTitle: "title" },
  access: {
    read: () => true, // 許可する
  },
  fields: [
    { name: "title", type: "text", localized: true },
    { name: "slug", type: "text" },
    { name: "content", type: "richText", localized: true },
  ],
};