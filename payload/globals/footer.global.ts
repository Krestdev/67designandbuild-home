import { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "contactInfo",
      type: "group",
      fields: [
        { name: "contactEmail", type: "text" },
        { name: "contactPhone", type: "text" },
        { name: "contactAddress", type: "text", localized: true },
      ],
    },
    { name: "copyrightText", type: "text", localized: true },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        { name: "platform", type: "text" },
        { name: "url", type: "text" },
      ],
    },
    {
      name: "usefullLinks",
      type: "array",
      fields: [
        { name: "lable", type: "text" }
      ]
    },
    {
      name: "Enterprise",
      type: "array",
      fields: [
        { name: "lable", type: "text" }
      ]
    }
  ],
};