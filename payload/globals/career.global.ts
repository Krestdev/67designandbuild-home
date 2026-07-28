import { GlobalConfig } from "payload";

export const CareerGlobal: GlobalConfig = {
  slug: "CareerGlobal",
  access: {
    read: () => true,
  },
  fields: [
    { name: "heroTitle", type: "text", localized: true },
    { name: "heroSubtitle", type: "textarea", localized: true },
    { name: "listTitle", type: "text", localized: true },
    { name: "listSubtitle", type: "text", localized: true },
    { name: "emptyStateTitle", type: "text", localized: true },
    { name: "emptyStateSubtitle", type: "textarea", localized: true },
    { name: "heroImage", type: "upload", relationTo: "media" },
  ],
};