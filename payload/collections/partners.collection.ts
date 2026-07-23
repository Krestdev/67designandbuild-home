import { CollectionConfig } from "payload";

export const Partners: CollectionConfig = {
  slug: "partners",
  admin: { useAsTitle: "title" },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "logo", type: "upload", relationTo: "media", required: true },
    { name: "link", type: "text" },
  ],
};