import { GlobalConfig } from "payload";

export const Header: GlobalConfig = {
  slug: "header",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "navLinks",
      type: "array",
      fields: [
        { name: "label", type: "text", localized: true },
        { name: "url", type: "text" },
      ],
    },
  ],
};