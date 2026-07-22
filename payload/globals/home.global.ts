import { GlobalConfig } from "payload";

export const Home: GlobalConfig = {
  slug: "home",
  access: {
    read: () => true, // 許可する
  },
  fields: [
    { name: "heroImage", type: "upload", relationTo: "media" },
    { name: "heroTitle", type: "text", localized: true },
    // { name: "heroContent", type: "richText", localized: true },
    { name: "heroContent", type: "textarea", localized: true },
    {
      type: 'row',
      fields: [
        { name: "heroCTA", type: "text", localized: true },
        { name: "heroCTA2", type: "text", localized: true },
      ]
    },
  ],
};
