import { GlobalConfig } from "payload";

export const Service: GlobalConfig = {
  slug: "service",
  access: {
    read: () => true, // 許可する
  },
  fields: [
    { name: "title", type: "text", localized: true },
    { name: "intro", type: "textarea", localized: true },
  ],
};
