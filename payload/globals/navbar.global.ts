import { GlobalConfig } from "payload";

export const Navbar: GlobalConfig = {
  slug: "navbar",
  access: {
    read: () => true, // 許可する
  },
  fields: [
    { name: "aboutUs", type: "text", localized: true },
    { name: "services", type: "text", localized: true },
    { name: "sectors", type: "text", localized: true },
    { name: "catalogs", type: "text", localized: true },
    { name: "blogs", type: "text", localized: true },
    { name: "careers", type: "text", localized: true },
    { name: "contact", type: "text", localized: true },
  ],
};
