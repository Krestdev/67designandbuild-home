import { CollectionConfig } from "payload";

export const Faq: CollectionConfig = {
  slug: "faq",
  admin: { useAsTitle: "question" },
  access: {
    read: () => true,
  },
  fields: [
    { name: "question", type: "text", localized: true, required: true },
    { name: "answer", type: "richText", localized: true, required: true },
    { name: "order", type: "number" },
  ],
};