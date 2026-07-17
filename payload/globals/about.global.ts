import { GlobalConfig } from "payload";

export const About: GlobalConfig = {
  slug: "about",
  access: {
    read: () => true, // 許可する
  },
  fields: [
    { name: "title", type: "text", localized: true },
    { name: "slug", type: "text" },
    { name: "content", type: "richText", localized: true },
  ],
};
