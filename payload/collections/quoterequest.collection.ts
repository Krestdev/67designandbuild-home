import { CollectionConfig, PayloadRequest } from "payload";
import { sendQuoteRequestEmails } from "../../lib/quoteRequestEmails";
import { resolveNotifyEmail, toEmailLocale } from "../../lib/emailLayout";

type RelationValue = number | string | { id: number | string } | null | undefined;

const relationId = (value: RelationValue) =>
  value && typeof value === "object" ? value.id : value;

async function findTitle(
  req: PayloadRequest,
  collection: "Services" | "Sectors",
  value: RelationValue,
  locale: "fr" | "en" | "it",
) {
  const id = relationId(value);
  if (id == null) return null;
  try {
    const doc = await req.payload.findByID({ collection, id, locale, depth: 0, req });
    return (doc as { title?: string | null }).title ?? null;
  } catch (err) {
    console.error(`Error resolving ${collection} ${id} title:`, err);
    return null;
  }
}

export const QuoteRequest: CollectionConfig = {
  slug: "QuoteRequests",
  admin: { useAsTitle: "fullName" },
  access: {
    // Submissions hold personal data: only logged-in admins can list or read them.
    read: ({ req }) => Boolean(req.user),
    create: () => true, // public form — no spam protection yet, flag for mentor
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== "create") return;

        try {
          // The form sends ?locale=… ; anything unknown falls back to French.
          const locale = toEmailLocale(req.locale);

          const notifyEmail = await resolveNotifyEmail(req);

          const [projectFr, projectLocalized, sectorFr, sectorLocalized] =
            await Promise.all([
              findTitle(req, "Services", doc.projectType, "fr"),
              findTitle(req, "Services", doc.projectType, locale),
              findTitle(req, "Sectors", doc.sector, "fr"),
              findTitle(req, "Sectors", doc.sector, locale),
            ]);

          const attachments: Array<{ filename: string; url: string }> = [];
          for (const value of (doc.attachments ?? []) as RelationValue[]) {
            const id = relationId(value);
            if (id == null) continue;
            try {
              const media = await req.payload.findByID({
                collection: "media",
                id,
                depth: 0,
                req,
              });
              if (media?.filename && media?.url) {
                attachments.push({ filename: media.filename, url: media.url });
              }
            } catch (err) {
              console.error(`Error resolving media attachment ${id}:`, err);
            }
          }

          // Awaited so the 201 is only returned once the emails are handed to SMTP.
          await sendQuoteRequestEmails(
            req.payload,
            {
              locale,
              id: doc.id,
              fullName: doc.fullName,
              email: doc.email,
              phone: doc.phone,
              company: doc.company,
              projectType: {
                fr: projectFr ?? "Non précisé",
                localized: projectLocalized ?? projectFr ?? "-",
              },
              sector:
                sectorFr || sectorLocalized
                  ? {
                      fr: sectorFr ?? sectorLocalized ?? "",
                      localized: sectorLocalized ?? sectorFr ?? "",
                    }
                  : null,
              location: doc.location,
              timeline: doc.timeline,
              budget: doc.budget,
              description: doc.description,
              attachments,
            },
            notifyEmail,
          );
        } catch (err) {
          console.error("Error in QuoteRequest afterChange hook:", err);
        }
      },
    ],
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