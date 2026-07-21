import { CollectionConfig } from "payload";

export const Project: CollectionConfig = {
  slug: "project",
  admin: { useAsTitle: "title" },
  access: {
    read: () => true,
  },
  fields: [
    { name: "title", type: "text", localized: true , required: true },
    { name: "slug", type: "text" },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Résidentiel", value: "residentiel" },
        { label: "Institutionnel", value: "institutionnel" },
        { label: "Industriel", value: "industriel" },
        { label: "Restauration", value: "restauration" },
        { label: "Infrastructures", value: "infrastructures" },
      ],
    },
    { name: "image", type: "upload", relationTo: "media" },
    { name: "content", type: "richText", localized: true },
  ],
};