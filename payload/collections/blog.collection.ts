import { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";

export const Blog: CollectionConfig = {
  slug: "blog",
  admin: { useAsTitle: "title" },
  access: {
    read: () => true, // 許可する
  },
  fields: [
    { name: "title", type: "text", localized: true },
    slugField(),
    { name: "content", type: "richText", localized: true },
    { name: "preveiw", type: "upload", relationTo: "media" },
  ],
};
