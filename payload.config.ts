import { s3Storage } from '@payloadcms/storage-s3'
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";
import { collections } from "@/payload/collections";
import { globals } from "@/payload/globals";
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export default buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  // Define and configure your collections in this array
  collections,

  // GLobal Data
  globals,

  // languages — content is authored in French first, so English and
  // Italian fall back to French (defaultLocale) for any untranslated field.
  localization: {
    locales: [
      { code: "fr", label: "Français" },
      { code: "en", label: "English" },
      { code: "it", label: "Italiano" },
    ],
    defaultLocale: "fr",
    fallback: true,
  },
  email: nodemailerAdapter({
    defaultFromAddress: process.env.SMTP_FROM_EMAIL || "",
    defaultFromName: process.env.SMTP_FROM_NAME || "",
    // Nodemailer transportOptions
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secured: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: process.env.PAYLOAD_SECRET || "",
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),

  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: true
      },
      bucket: process.env.S3_BUCKET!,
      config: {
        endpoint: process.env.S3_ENDPOINT!,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        },
        region: "cm-douala",
        forcePathStyle: true
      }
    })
  ]
});
