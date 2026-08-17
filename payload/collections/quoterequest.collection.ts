import { CollectionConfig } from "payload";
import {
  sendCompanyNotificationEmail,
  sendUserNotificationEmail,
} from "../../lib/email";

export const QuoteRequest: CollectionConfig = {
  slug: "QuoteRequests",
  admin: { useAsTitle: "fullName" },
  access: {
    read: () => true, // TODO: restrict to admin-only once auth roles exist
    create: () => true, // public form — no spam protection yet, flag for mentor
  },
  hooks: {
    afterChange: [
      async ({ doc, operation, req }) => {
        if (operation !== "create") return;

        try {
          // 1. Resolve Company Email from Contact Global
          let companyEmail = process.env.CONTACT_RECEIVER_EMAIL || "no-reply@67designandbuild.com";
          try {
            const contactGlobal = await req.payload.findGlobal({
              slug: "Contact",
              req,
            });
            if (contactGlobal?.email) {
              companyEmail = contactGlobal.email;
            }
          } catch (err) {
            console.error("Error fetching Contact global email:", err);
          }

          // 2. Resolve Service Title (projectType)
          let projectTypeTitle = "Inconnu";
          if (doc.projectType) {
            try {
              const serviceId = typeof doc.projectType === "object" ? doc.projectType.id : doc.projectType;
              const service = await req.payload.findByID({
                collection: "Services",
                id: serviceId,
                req,
              });
              if (service?.title) {
                projectTypeTitle = service.title;
              }
            } catch (err) {
              console.error("Error resolving project type title:", err);
            }
          }

          // 3. Resolve Sector Title
          let sectorTitle = "";
          if (doc.sector) {
            try {
              const sectorId = typeof doc.sector === "object" ? doc.sector.id : doc.sector;
              const sector = await req.payload.findByID({
                collection: "Sectors",
                id: sectorId,
                req,
              });
              if (sector?.title) {
                sectorTitle = sector.title;
              }
            } catch (err) {
              console.error("Error resolving sector title:", err);
            }
          }

          // 4. Resolve Attachments Details
          const attachments: Array<{ filename: string; url: string }> = [];
          if (doc.attachments && Array.isArray(doc.attachments)) {
            for (const attId of doc.attachments) {
              try {
                const id = typeof attId === "object" ? attId.id : attId;
                const media = await req.payload.findByID({
                  collection: "media",
                  id,
                  req,
                });
                if (media?.filename && media?.url) {
                  attachments.push({
                    filename: media.filename,
                    url: media.url,
                  });
                }
              } catch (err) {
                console.error(`Error resolving media attachment ${attId}:`, err);
              }
            }
          }

          // 5. Send Emails
          const emailData = {
            fullName: doc.fullName,
            company: doc.company,
            email: doc.email,
            phone: doc.phone,
            projectTypeTitle,
            sectorTitle,
            location: doc.location,
            timeline: doc.timeline,
            budget: doc.budget,
            description: doc.description,
            attachments,
          };

          // Send notification email to the company
          await sendCompanyNotificationEmail(req.payload, emailData, companyEmail);

          // Send confirmation email to the user
          await sendUserNotificationEmail(req.payload, emailData);
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