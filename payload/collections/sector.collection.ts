import { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";
import { preventDeleteIfReferenced } from "../hooks/preventDeleteIfReferenced";

export const Sector: CollectionConfig = {
  slug: "Sectors",
  admin: { useAsTitle: "title" },
  hooks: {
    beforeDelete: [
      preventDeleteIfReferenced([
        { collection: "catalogs", field: "category", label: "réalisation(s)" },
      ]),
    ],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    slugField(),
    { name: "image", type: "upload", relationTo: "media" },
    { name: "description", type: "textarea", localized: true },
    { name: "content", type: "richText", localized: true },

    {
      name: "gallery",
      type: "array",
      labels: { singular: "Gallery Image", plural: "Gallery Images" },
      fields: [{ name: "photo", type: "upload", relationTo: "media", required: true }],
      // No min/max — as many images as needed, per your note.
    },

    {
      name: "associatedServices",
      type: "relationship",
      relationTo: "Services",
      hasMany: true,
    },

    // Derived from each project's `category` — edit the project to change it.
    {
      name: "relatedProjects",
      type: "join",
      collection: "catalogs",
      on: "category",
      defaultLimit: 0,
      maxDepth: 2,
    },
  ],
};