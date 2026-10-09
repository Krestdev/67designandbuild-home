import { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";
import { preventDeleteIfReferenced } from "../hooks/preventDeleteIfReferenced";

export const Service: CollectionConfig = {
  slug: "Services",
  admin: { useAsTitle: "title" },
  hooks: {
    beforeDelete: [
      preventDeleteIfReferenced([
        { collection: "QuoteRequests", field: "projectType", label: "demande(s) de devis" },
      ]),
    ],
  },
  access: {
    read: () => true, // 許可する
  },
  fields: [
    { name: "title", type: "text", localized: true },
    slugField(),
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
    // Derived from each project's `serviceCategory` — edit the project to change it.
    {
      name: "relatedProjects",
      type: "join",
      collection: "catalogs",
      on: "serviceCategory",
      defaultLimit: 0,
      maxDepth: 2,
    },
  ],
};