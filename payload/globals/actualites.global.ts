import { GlobalConfig } from "payload";

export const ActualitesGlobal: GlobalConfig = {
  slug: "ActualitesGlobal",
  access: { read: () => true },
  fields: [
    { name: "heroTitle", type: "text", localized: true },
    { name: "heroSubtitle", type: "textarea", localized: true },
    { name: "heroImage", type: "upload", relationTo: "media" },
  ],
};