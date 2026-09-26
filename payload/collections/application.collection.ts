import { addDataAndFileToRequest, APIError, CollectionConfig, PayloadRequest } from "payload";
import { sendApplicationEmails } from "../../lib/applicationEmails";
import { oneLine, resolveNotifyEmail, toEmailLocale } from "../../lib/emailLayout";
import { CV_MIME_TYPES } from "./privateFile.collection";

const CV_MAX_BYTES = 10 * 1024 * 1024;
const MESSAGE_MAX_LENGTH = 5000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const badRequest = (message: string) =>
  Response.json({ errors: [{ message }] }, { status: 400 });

const requiredText = (value: unknown, max = 200) =>
  typeof value === "string" && value.trim() !== "" && value.length <= max
    ? value.trim()
    : null;

/**
 * POST /api/applications/submit — multipart form with `file` (the CV) and
 * `_payload` (JSON fields). Validates everything before writing, stores the CV
 * in the private `private-files` collection, then emails the team and the applicant.
 */
async function submitApplication(req: PayloadRequest) {
  try {
    await addDataAndFileToRequest(req);
  } catch {
    return badRequest("Formulaire invalide.");
  }

  const data = (req.data ?? {}) as Record<string, unknown>;
  const file = req.file;
  // The form sends ?locale=… ; anything unknown falls back to French.
  const locale = toEmailLocale(req.searchParams.get("locale"));

  const fullName = requiredText(data.fullName);
  const email = requiredText(data.email);
  const phone = requiredText(data.phone, 50);
  const message =
    typeof data.message === "string" ? data.message.slice(0, MESSAGE_MAX_LENGTH) : "";
  // No job = spontaneous application
  const careerId =
    data.career == null || data.career === "" ? null : Number(data.career);

  if (!fullName || !email || !phone) {
    return badRequest("Nom, e-mail et téléphone sont obligatoires.");
  }
  if (!EMAIL_PATTERN.test(email)) return badRequest("Adresse e-mail invalide.");
  if (!file) return badRequest("CV manquant.");
  if (!CV_MIME_TYPES.includes(file.mimetype)) {
    return badRequest("Le CV doit être au format PDF, DOC ou DOCX.");
  }
  if (file.size > CV_MAX_BYTES) return badRequest("Le CV doit faire 10 Mo maximum.");
  if (careerId !== null && !Number.isInteger(careerId)) {
    return badRequest("Offre invalide.");
  }

  // Check the job before writing anything.
  const [jobFr, jobLocalized] =
    careerId === null
      ? [null, null]
      : await Promise.all([
          req.payload
            .findByID({ collection: "career", id: careerId, locale: "fr", depth: 0 })
            .catch(() => null),
          req.payload
            .findByID({ collection: "career", id: careerId, locale, depth: 0 })
            .catch(() => null),
        ]);
  if (careerId !== null && !jobFr) return badRequest("Offre introuvable.");

  const filename = oneLine(file.name);
  const cv = await req.payload.create({
    collection: "private-files",
    data: {},
    file: { data: file.data, mimetype: file.mimetype, name: filename, size: file.size },
    overrideAccess: true,
  });

  let application;
  try {
    application = await req.payload.create({
      collection: "applications",
      data: { career: careerId ?? undefined, fullName, email, phone, message, cv: cv.id },
      overrideAccess: true,
    });
  } catch (err) {
    await req.payload
      .delete({ collection: "private-files", id: cv.id, overrideAccess: true })
      .catch(() => null);
    throw err;
  }

  // Awaited so the 201 is only returned once the emails are handed to SMTP.
  await sendApplicationEmails(
    req.payload,
    {
      locale,
      id: application.id,
      fullName,
      email,
      phone,
      message,
      job: jobFr
        ? {
            fr: jobFr.title ?? "-",
            localized: jobLocalized?.title ?? jobFr.title ?? "-",
            location: jobFr.location,
          }
        : null,
      cv: { filename, content: file.data },
    },
    await resolveNotifyEmail(req),
  );

  return Response.json({ doc: { id: application.id } }, { status: 201 });
}

export const Application: CollectionConfig = {
  slug: "applications",
  admin: {
    useAsTitle: "fullName",
    defaultColumns: ["fullName", "career", "email", "status", "createdAt"],
  },
  access: {
    // Applications hold personal data: only logged-in admins can list or read them.
    read: ({ req }) => Boolean(req.user),
    // The public form goes through /submit, never through the default create route.
    create: ({ req }) => Boolean(req.user),
  },
  endpoints: [
    {
      path: "/submit",
      method: "post",
      handler: async (req) => {
        try {
          return await submitApplication(req);
        } catch (err) {
          if (err instanceof APIError && err.status < 500) {
            return badRequest(err.message);
          }
          req.payload.logger.error({ err, msg: "Application submission failed" });
          return Response.json(
            { errors: [{ message: "Erreur serveur." }] },
            { status: 500 },
          );
        }
      },
    },
  ],
  fields: [
    {
      name: "career",
      type: "relationship",
      relationTo: "career",
      admin: { description: "Vide = candidature spontanée" },
    },
    { name: "fullName", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text", required: true },
    { name: "message", type: "textarea" },
    {
      name: "cv",
      type: "upload",
      relationTo: "private-files",
      required: true,
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
