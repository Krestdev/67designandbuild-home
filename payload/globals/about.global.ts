import { GlobalConfig } from "payload";

export const About: GlobalConfig = {
  slug: "about",
  access: {
    read: () => true,
  },
  fields: [
    // ---- EXISTING FIELDS — already consumed by Intro.tsx on the homepage ----
    { name: "title", type: "text", localized: true },
    { name: "slug", type: "text" },
    { name: "content", type: "richText", localized: true },

    // ---- HERO (new, About page only) ----
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "subtitle", type: "text", localized: true },
        { name: "backgroundImage", type: "upload", relationTo: "media" },
      ],
    },

    // ---- INTRO EXTRAS (new — eyebrow + stats only; body text stays on top-level `content`) ----
    {
      name: "introExtras",
      type: "group",
      fields: [
        { name: "eyebrow", type: "text", localized: true }, // "À PROPOS"
        {
          name: "stats",
          type: "array",
          minRows: 1,
          maxRows: 3,
          fields: [
            { name: "value", type: "text" }, // "8+", "50+", "95%"
            { name: "label", type: "text", localized: true },
          ],
        },
      ],
    },

    // ---- DIRECTION / TEAM ----
    {
      name: "direction",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "subtitle", type: "text", localized: true },
        {
          name: "person",
          type: "group",
          fields: [
            { name: "name", type: "text" },
            { name: "role", type: "text", localized: true },
            { name: "bio", type: "richText", localized: true },
            { name: "photo", type: "upload", relationTo: "media" },
          ],
        },
      ],
    },

    // ---- STEPS ----
    {
      name: "steps",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "subtitle", type: "text", localized: true },
        {
          name: "items",
          type: "array",
          minRows: 1,
          fields: [
            { name: "number", type: "text" }, // "01", "02"...
            { name: "title", type: "text", localized: true },
            { name: "description", type: "text", localized: true },
          ],
        },
      ],
    },

    // ---- GUARANTEES ----
    {
      name: "guarantees",
      type: "group",
      fields: [
        { name: "title", type: "text", localized: true },
        { name: "subtitle", type: "text", localized: true },
        {
          name: "items",
          type: "array",
          minRows: 1,
          fields: [
            { name: "number", type: "text" },
            { name: "title", type: "text", localized: true },
            { name: "description", type: "text", localized: true },
          ],
        },
      ],
    },
  ],
};