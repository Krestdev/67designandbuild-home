import { CollectionConfig } from "payload";
import { slugField } from "../fields/slug";
import { preventDeleteIfReferenced } from "../hooks/preventDeleteIfReferenced";

export const Category: CollectionConfig = {
  slug: "categories",
  admin: { useAsTitle: "title" },
  hooks: {
    beforeDelete: [
      preventDeleteIfReferenced([
        { collection: "articles", field: "category", label: "article(s)" },
      ]),
    ],
  },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", localized: true, required: true },
    slugField(),
  ],
};