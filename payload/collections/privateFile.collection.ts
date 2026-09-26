import type { CollectionConfig } from "payload";

export const CV_MIME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/**
 * Files sent through public forms (CVs). Unlike `media`, nothing here is
 * public: only logged-in admins can list or download them. Public forms never
 * write here directly; their endpoints create these docs with overrideAccess.
 */
export const PrivateFiles: CollectionConfig = {
  slug: "private-files",
  admin: { useAsTitle: "filename" },
  access: {
    read: ({ req }) => Boolean(req.user),
  },
  upload: {
    mimeTypes: CV_MIME_TYPES,
  },
  fields: [],
};
