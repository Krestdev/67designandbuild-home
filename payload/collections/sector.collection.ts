import { CollectionConfig } from "payload";

export const Sector: CollectionConfig = {
  slug: "Sectors",
  admin: { useAsTitle: "title" },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    { name: "slug", type: "text" },
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

    {
      name: "relatedProjects",
      type: "relationship",
      relationTo: "catalogs",
      hasMany: true,
    },
  ],
};