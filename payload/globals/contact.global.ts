import { GlobalConfig } from "payload";

export const Contact: GlobalConfig = {
  slug: "Contact",
  access: {
    read: () => true,
  },
  fields: [
    // ---- Hero ----
    { name: "heroTitle", type: "text", localized: true },
    { name: "heroSubtitle", type: "textarea", localized: true },

    // ---- Coordonnées panel ----
    { name: "coordonneesTitle", type: "text", localized: true },
    { name: "coordonneesSubtitle", type: "text", localized: true },
    { name: "address", type: "textarea", localized: true },
    { name: "phone", type: "text" },
    { name: "email", type: "text" },
    { name: "hours", type: "text", localized: true },

    // ---- Map — coordinates only for now. Actual embed/API integration
    // is left for the mentor to wire up (Google Maps API key, etc.) ----
    { name: "mapLatitude", type: "number" },
    { name: "mapLongitude", type: "number" },
  ],
};