import type { Payload } from "payload";
import {
  adminButton,
  adminUrl,
  automaticFooter,
  detailsTable,
  escapeHtml,
  layout,
  logoAttachments,
  oneLine,
  quoteBox,
  sectionTitle,
  sendAll,
  SITE_NAME,
  type EmailLocale,
  type Mail,
} from "./emailLayout";

export interface ApplicationEmailInput {
  locale: EmailLocale;
  id: number | string;
  fullName: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  // Job title in French (notification) and in the applicant's locale (acknowledgment); null = spontaneous
  job: { fr: string; localized: string; location?: string | null } | null;
  cv?: { filename: string; content: Buffer } | null;
}

const ack = {
  fr: {
    subject: "Nous avons bien reçu votre candidature",
    greeting: (name: string) => `Bonjour ${name},`,
    received: (job: string) =>
      `Nous avons bien reçu votre candidature pour le poste : ${job}.`,
    receivedSpontaneous: "Nous avons bien reçu votre candidature spontanée.",
    next: "Notre équipe va l'étudier et reviendra vers vous.",
    questions:
      "Pour toute précision, vous pouvez répondre directement à cet e-mail.",
    thanks: "Merci de l'intérêt que vous portez à notre entreprise.",
    signature: `L'équipe ${SITE_NAME}`,
    automatic: "Cet e-mail a été envoyé automatiquement.",
  },
  en: {
    subject: "We have received your application",
    greeting: (name: string) => `Hello ${name},`,
    received: (job: string) =>
      `We have received your application for the position: ${job}.`,
    receivedSpontaneous: "We have received your spontaneous application.",
    next: "Our team will review it and get back to you.",
    questions: "If you have any questions, you can reply directly to this email.",
    thanks: "Thank you for your interest in our company.",
    signature: `The ${SITE_NAME} team`,
    automatic: "This email was sent automatically.",
  },
  it: {
    subject: "Abbiamo ricevuto la tua candidatura",
    greeting: (name: string) => `Buongiorno ${name},`,
    received: (job: string) =>
      `Abbiamo ricevuto la tua candidatura per la posizione: ${job}.`,
    receivedSpontaneous: "Abbiamo ricevuto la tua candidatura spontanea.",
    next: "Il nostro team la esaminerà e ti ricontatterà.",
    questions: "Per qualsiasi domanda, puoi rispondere direttamente a questa email.",
    thanks: "Grazie per l'interesse verso la nostra azienda.",
    signature: `Il team ${SITE_NAME}`,
    automatic: "Questa email è stata inviata automaticamente.",
  },
} satisfies Record<EmailLocale, unknown>;

function buildNotification(input: ApplicationEmailInput, hasLogo: boolean) {
  const rows: Array<[string, string | null | undefined]> = [
    ["Poste", input.job?.fr ?? "Candidature spontanée"],
    ["Lieu du poste", input.job?.location],
    ["Nom", input.fullName],
    ["E-mail", input.email],
    ["Téléphone", input.phone],
    ["Langue du formulaire", input.locale.toUpperCase()],
  ];
  const filled = rows.filter((row): row is [string, string] => Boolean(row[1]));
  const link = adminUrl("applications", input.id);

  const subject = oneLine(
    input.job
      ? `Nouvelle candidature - ${input.job.fr} - ${input.fullName}`
      : `Nouvelle candidature spontanée - ${input.fullName}`,
  );

  const text = [
    "Nouvelle candidature reçue via le site.",
    "",
    ...filled.map(([label, value]) => `${label} : ${value}`),
    "",
    "Message :",
    input.message || "-",
    ...(input.cv ? ["", `CV (en pièce jointe) : ${input.cv.filename}`] : []),
    ...(link ? ["", `Voir dans l'admin : ${link}`] : []),
  ].join("\n");

  const html = layout(
    subject,
    `<h1 style="margin:0 0 20px;font-size:22px;">Nouvelle candidature</h1>
${detailsTable(filled)}
${sectionTitle("Message")}
${quoteBox(input.message || "-")}
${input.cv ? sectionTitle("CV") + `<p style="margin:0;">${escapeHtml(input.cv.filename)} (en pièce jointe)</p>` : ""}
${link ? adminButton(link) : ""}`,
    hasLogo,
  );

  return { subject, text, html };
}

function buildAcknowledgment(input: ApplicationEmailInput, hasLogo: boolean) {
  const t = ack[input.locale];
  const subject = oneLine(`${t.subject} - ${SITE_NAME}`);
  const paragraphs = [
    t.greeting(input.fullName),
    input.job ? t.received(input.job.localized) : t.receivedSpontaneous,
    t.next,
    t.questions,
    t.thanks,
  ];

  const text = [...paragraphs, "", t.signature, "", "--", t.automatic].join(
    "\n\n",
  );
  const html = layout(
    subject,
    `${paragraphs.map((p) => `<p style="margin:0 0 16px;">${escapeHtml(p)}</p>`).join("")}
<p style="margin:24px 0 0;font-weight:bold;">${escapeHtml(t.signature)}</p>
${automaticFooter(t.automatic)}`,
    hasLogo,
  );

  return { subject, text, html };
}

/**
 * Sends the internal notification (with the CV attached) and the applicant's
 * acknowledgment. Never throws: the application is already saved when this runs.
 */
export async function sendApplicationEmails(
  payload: Payload,
  input: ApplicationEmailInput,
  notifyEmail: string | null,
) {
  const logo = await logoAttachments();
  const files = input.cv
    ? [{ filename: oneLine(input.cv.filename), content: input.cv.content }]
    : [];
  const notification = buildNotification(input, logo.length > 0);
  const acknowledgment = buildAcknowledgment(input, logo.length > 0);
  const applicantEmail = oneLine(input.email);

  if (!notifyEmail) {
    console.error(
      "Application notification not sent: APPLICATIONS_NOTIFY_EMAIL is not set.",
    );
  }

  const mails: Array<[string, Mail]> = [];
  if (notifyEmail) {
    mails.push([
      "notification",
      {
        to: notifyEmail,
        replyTo: applicantEmail,
        ...notification,
        attachments: [...logo, ...files],
      },
    ]);
  }
  mails.push([
    "acknowledgment",
    {
      to: applicantEmail,
      ...(notifyEmail ? { replyTo: notifyEmail } : {}),
      ...acknowledgment,
      attachments: logo,
    },
  ]);

  await sendAll(payload, `Application ${input.id}`, mails);
}
