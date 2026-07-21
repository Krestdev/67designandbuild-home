import { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "companyLinks",
      type: "array",
      fields: [
        { name: "label", type: "text", localized: true },
        { name: "url", type: "text" },
      ],
    },
    {
      name: "usefulLinks",
      type: "array",
      fields: [
        { name: "label", type: "text", localized: true },
        { name: "url", type: "text" },
      ],
    },
    { name: "contactEmail", type: "text" },
    { name: "contactPhone", type: "text" },
    { name: "contactAddress", type: "text", localized: true },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        {
          name: "platform",
          type: "select",
          options: [
            { label: "LinkedIn", value: "linkedin" },
            { label: "Facebook", value: "facebook" },
            { label: "X", value: "x" },
          ],
        },
        { name: "url", type: "text" },
        { name: "copyrightText", type: "text", localized: true },
      ],
    },
  ],
};