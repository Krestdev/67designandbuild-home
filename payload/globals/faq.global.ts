import { GlobalConfig } from "payload";

export const Faq: GlobalConfig = {
  slug: "faq",
  access: {
    read: () => true, // 許可する
  },
  fields: [
    { name: "title", type: "text", localized: true },
    { name: "intro", type: "textarea", localized: true },
  ],
};
