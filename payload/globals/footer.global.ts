import { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
  },
  fields: [
    { name: "contactEmail", type: "text" },
    { name: "contactPhone", type: "text" },
    { name: "contactAddress", type: "text", localized: true },
    { name: "copyrightText", type: "text", localized: true },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        { name: "platform", type: "text" },
        { name: "icon", type: "upload", relationTo: "media" },
        { name: "url", type: "text" },
      ],
    },
  ],
};