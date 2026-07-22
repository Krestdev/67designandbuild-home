import { CollectionConfig } from "payload";

export const Link: CollectionConfig = {
  slug: "link",
  admin: { useAsTitle: "label" },
  access: {
    read: () => true,
  },
  fields: [
    { name: "label", type: "text", localized: true, required: true },
    { name: "url", type: "text", required: true },
    {
      name: "placement",
      type: "select",
      required: true,
      options: [
        { label: "Header", value: "header" },
        { label: "Footer — Entreprise", value: "footer-entreprise" },
        { label: "Footer — Liens utiles", value: "footer-liens-utiles" },
      ],
    },
  ],
};