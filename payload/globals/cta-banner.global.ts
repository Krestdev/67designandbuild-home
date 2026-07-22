import { GlobalConfig } from "payload";

export const CtaBanner: GlobalConfig = {
  slug: "cta-banner",
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", localized: true },
    { name: "content", type: "textarea", localized: true },
    { name: "cta", type: "text", localized: true },
  ],
};