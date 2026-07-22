import { CollectionConfig } from "payload";

export const Sector: CollectionConfig = {
  slug: "sector",
  admin: { useAsTitle: "title" },
  access: {
    read: () => true,
  },
  fields: [
    { name: "sectorsSectionTitle", type: "text", localized: true },
    { name: "sectorsSectionSubtitle", type: "textarea", localized: true },
    { name: "title", type: "text", localized: true },
    { name: "slug", type: "text" },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "content", type: "richText", localized: true },
  ],
};
