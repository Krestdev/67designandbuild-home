import { CollectionConfig } from "payload";

export const QuoteRequest: CollectionConfig = {
  slug: "QuoteRequests",
  admin: { useAsTitle: "fullName" },
  access: {
    read: () => true, // TODO: restrict to admin-only once auth roles exist
    create: () => true, // public form — no spam protection yet, flag for mentor
  },
  fields: [
    { name: "fullName", type: "text", required: true },
    { name: "company", type: "text" },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text", required: true },
    {
      name: "projectType",
      type: "relationship",
      relationTo: "Services",
      required: true,
    },
    {
      name: "sector",
      type: "relationship",
      relationTo: "Sectors",
    },
    { name: "location", type: "text", required: true },
    { name: "timeline", type: "text" },
    { name: "budget", type: "text" },
    { name: "description", type: "textarea", required: true },
    {
      name: "attachments",
      type: "upload",
      relationTo: "media",
      hasMany: true,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      options: [
        { label: "New", value: "new" },
        { label: "Contacted", value: "contacted" },
        { label: "Closed", value: "closed" },
      ],
    },
  ],
  timestamps: true,
};