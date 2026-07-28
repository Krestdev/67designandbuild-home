import { CollectionConfig } from "payload";

export const Service: CollectionConfig = {
  slug: "Services",
  admin: { useAsTitle: "title" },
  access: {
    read: () => true, // 許可する
  },
  fields: [
    { name: "title", type: "text", localized: true },
    { name: "slug", type: "text" },
    { name: "content", type: "richText", localized: true },
    { name: "preveiw", type: "upload", relationTo: "media" },

    // --- "Domaines d'application" list (PlusCircle icon in Figma) ---
    {
      name: "applicationAreas",
      type: "array",
      localized: true,
      labels: { singular: "Application Area", plural: "Application Areas" },
      fields: [
        { name: "label", type: "text" },
        { name: "description", type: "text" },
      ],
    },

    // --- "Livrables" list (CheckCircle icon in Figma) ---
    {
      name: "deliverables",
      type: "array",
      localized: true,
      labels: { singular: "Deliverable", plural: "Deliverables" },
      fields: [
        { name: "label", type: "text" },
        { name: "description", type: "text" },
      ],
    },

    // --- "Projets associés" grid — relates to your Catalog (projects) collection ---
    {
      name: "relatedProjects",
      type: "relationship",
      relationTo: "catalogs",
      hasMany: true,
    },
  ],
};