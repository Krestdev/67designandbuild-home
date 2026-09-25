import { promises as fs } from "fs";
import path from "path";
import type { Payload } from "payload";

export type EmailLocale = "fr" | "en" | "it";

export const EMAIL_LOCALES: EmailLocale[] = ["fr", "en", "it"];
export const DEFAULT_EMAIL_LOCALE: EmailLocale = "fr";

export function toEmailLocale(value: unknown): EmailLocale {
  return EMAIL_LOCALES.includes(value as EmailLocale)
    ? (value as EmailLocale)
    : DEFAULT_EMAIL_LOCALE;
}

export interface QuoteRequestEmailInput {
  locale: EmailLocale;
  id: number | string;
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  // Service title in French (notification) and in the sender's locale (acknowledgment)
  projectType: { fr: string; localized: string };
  sector?: { fr: string; localized: string } | null;
  location?: string | null;
  timeline?: string | null;
  budget?: string | null;
  description?: string | null;
  attachments?: Array<{ filename: string; url: string }>;
}

const SITE_NAME = "67 Design & Build";
const BRAND = {
  header: "#212121", // same as the footer, where the white logo is used on the site
  accent: "#D97B2C",
  background: "#FBF3EA",
  border: "#EDD3B7",
  muted: "#5B5B5B",
  text: "#212121",
};
const LOGO = { file: "logofooter.png", width: 180, height: 37 };

// Attachments above this total are sent as links only (SMTP providers cap messages around 20-25 MB).
const MAX_INLINE_ATTACHMENTS_BYTES = 15 * 1024 * 1024;
const ATTACHMENT_FETCH_TIMEOUT_MS = 15_000;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const escapeMultiline = (value: string) =>
  escapeHtml(value).replace(/\r\n|\r|\n/g, "<br>");

// Subjects and headers must stay on one line (header injection).
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

let logoPromise: Promise<Buffer | null> | undefined;
const loadLogo = () => {
  logoPromise ??= fs
    .readFile(path.join(process.cwd(), "public", LOGO.file))
    .catch((err) => {
      console.error("Email logo could not be read:", err);
      return null;
    });
  return logoPromise;
};

const siteOrigin = () => {
  try {
    return process.env.NEXT_PUBLIC_API_URL
      ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
      : "http://localhost:3000";
  } catch {
    return "http://localhost:3000";
  }
};

const absoluteUrl = (url: string) =>
  /^https?:\/\//.test(url) ? url : `${siteOrigin()}${url}`;

async function loadAttachments(
  attachments: Array<{ filename: string; url: string }>,
) {
  const files: Array<{ filename: string; content: Buffer }> = [];
  let total = 0;
  for (const att of attachments) {
    try {
      const res = await fetch(absoluteUrl(att.url), {
        signal: AbortSignal.timeout(ATTACHMENT_FETCH_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const content = Buffer.from(await res.arrayBuffer());
      if (total + content.length > MAX_INLINE_ATTACHMENTS_BYTES) continue;
      total += content.length;
      files.push({ filename: oneLine(att.filename), content });
    } catch (err) {
      console.error(`Quote request attachment ${att.filename} not attached:`, err);
    }
  }
  return files;
}

const ack = {
  fr: {
    subject: "Nous avons bien reçu votre demande de devis",
    greeting: (name: string) => `Bonjour ${name},`,
    received: (project: string) =>
      `Nous avons bien reçu votre demande de devis pour : ${project}.`,
    next: "Notre équipe va l'étudier et reviendra vers vous.",
    questions:
      "Pour toute précision, vous pouvez répondre directement à cet e-mail.",
    thanks: "Merci pour votre confiance.",
    signature: `L'équipe ${SITE_NAME}`,
    automatic: "Cet e-mail a été envoyé automatiquement.",
  },
  en: {
    subject: "We have received your quote request",
    greeting: (name: string) => `Hello ${name},`,
    received: (project: string) =>
      `We have received your quote request for: ${project}.`,
    next: "Our team will review it and get back to you.",
    questions: "If you have any questions, you can reply directly to this email.",
    thanks: "Thank you for your trust.",
    signature: `The ${SITE_NAME} team`,
    automatic: "This email was sent automatically.",
  },
  it: {
    subject: "Abbiamo ricevuto la tua richiesta di preventivo",
    greeting: (name: string) => `Buongiorno ${name},`,
    received: (project: string) =>
      `Abbiamo ricevuto la tua richiesta di preventivo per: ${project}.`,
    next: "Il nostro team la esaminerà e ti ricontatterà.",
    questions: "Per qualsiasi domanda, puoi rispondere direttamente a questa email.",
    thanks: "Grazie per la fiducia.",
    signature: `Il team ${SITE_NAME}`,
    automatic: "Questa email è stata inviata automaticamente.",
  },
} satisfies Record<EmailLocale, unknown>;

function layout(title: string, body: string, hasLogo: boolean) {
  const brand = hasLogo
    ? `<img src="cid:logo" width="${LOGO.width}" height="${LOGO.height}" alt="${SITE_NAME}" style="display:block;border:0;">`
    : `<span style="font-size:20px;font-weight:bold;color:#ffffff;">${SITE_NAME}</span>`;
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background-color:${BRAND.background};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.background};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;background-color:#ffffff;border:1px solid ${BRAND.border};font-family:Helvetica,Arial,sans-serif;color:${BRAND.text};">
<tr><td style="background-color:${BRAND.header};padding:24px 30px;border-bottom:3px solid ${BRAND.accent};">${brand}</td></tr>
<tr><td style="padding:30px;font-size:15px;line-height:1.6;">${body}</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildNotification(input: QuoteRequestEmailInput, hasLogo: boolean) {
  const rows: Array<[string, string | null | undefined]> = [
    ["Type de projet", input.projectType.fr],
    ["Secteur", input.sector?.fr],
    ["Nom", input.fullName],
    ["Entreprise", input.company],
    ["E-mail", input.email],
    ["Téléphone", input.phone],
    ["Localisation", input.location],
    ["Délai souhaité", input.timeline],
    ["Budget estimatif", input.budget ? `${input.budget} FCFA` : null],
    ["Langue du formulaire", input.locale.toUpperCase()],
  ];
  const filled = rows.filter((row): row is [string, string] => Boolean(row[1]));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const adminUrl = siteUrl
    ? `${siteUrl}/admin/collections/QuoteRequests/${input.id}`
    : null;
  const attachments = input.attachments ?? [];

  const subject = oneLine(
    `Nouvelle demande de devis - ${input.projectType.fr} - ${input.fullName}`,
  );

  const text = [
    "Nouvelle demande de devis reçue via le site.",
    "",
    ...filled.map(([label, value]) => `${label} : ${value}`),
    "",
    "Description :",
    input.description || "-",
    ...(attachments.length
      ? ["", "Pièces jointes :", ...attachments.map((a) => `- ${a.filename} : ${absoluteUrl(a.url)}`)]
      : []),
    ...(adminUrl ? ["", `Voir dans l'admin : ${adminUrl}`] : []),
  ].join("\n");

  const tableRows = filled
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;width:40%;color:${BRAND.muted};font-weight:bold;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;vertical-align:top;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const attachmentList = attachments.length
    ? `<p style="margin:24px 0 8px;font-weight:bold;color:${BRAND.accent};">Pièces jointes</p><ul style="margin:0;padding-left:20px;">${attachments
        .map(
          (a) =>
            `<li><a href="${escapeHtml(absoluteUrl(a.url))}" style="color:${BRAND.accent};">${escapeHtml(a.filename)}</a></li>`,
        )
        .join("")}</ul>`
    : "";

  const html = layout(
    subject,
    `<h1 style="margin:0 0 20px;font-size:22px;">Nouvelle demande de devis</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;">${tableRows}</table>
<p style="margin:24px 0 8px;font-weight:bold;color:${BRAND.accent};">Description</p>
<div style="background-color:#FFF0DF;border-left:3px solid ${BRAND.accent};padding:12px 16px;">${escapeMultiline(input.description || "-")}</div>
${attachmentList}
${adminUrl ? `<p style="margin:28px 0 0;"><a href="${escapeHtml(adminUrl)}" style="display:inline-block;background-color:${BRAND.accent};color:#ffffff;text-decoration:none;padding:10px 18px;font-weight:bold;">Voir dans l'admin</a></p>` : ""}`,
    hasLogo,
  );

  return { subject, text, html };
}

function buildAcknowledgment(input: QuoteRequestEmailInput, hasLogo: boolean) {
  const t = ack[input.locale];
  const subject = oneLine(`${t.subject} - ${SITE_NAME}`);
  const paragraphs = [
    t.greeting(input.fullName),
    t.received(input.projectType.localized),
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
<p style="margin:28px 0 0;padding-top:16px;border-top:1px solid ${BRAND.border};font-size:12px;color:#8A8A8A;">${escapeHtml(t.automatic)}</p>`,
    hasLogo,
  );

  return { subject, text, html };
}

/**
 * Sends the internal notification and the sender's acknowledgment for a quote
 * request. Never throws: the submission is already saved when this runs.
 */
export async function sendQuoteRequestEmails(
  payload: Payload,
  input: QuoteRequestEmailInput,
  notifyEmail: string | null,
) {
  const [logo, files] = await Promise.all([
    loadLogo(),
    loadAttachments(input.attachments ?? []),
  ]);
  const logoAttachment = logo
    ? [
        {
          filename: "logo.png",
          content: logo,
          cid: "logo",
          contentDisposition: "inline" as const,
        },
      ]
    : [];

  const notification = buildNotification(input, Boolean(logo));
  const acknowledgment = buildAcknowledgment(input, Boolean(logo));
  const senderEmail = oneLine(input.email);

  const sends: Array<[string, Promise<unknown>]> = [];
  if (notifyEmail) {
    sends.push([
      "notification",
      payload.sendEmail({
        to: notifyEmail,
        replyTo: senderEmail,
        subject: notification.subject,
        text: notification.text,
        html: notification.html,
        attachments: [...logoAttachment, ...files],
      }),
    ]);
  } else {
    console.error(
      "Quote request notification not sent: APPLICATIONS_NOTIFY_EMAIL is not set.",
    );
  }
  sends.push([
    "acknowledgment",
    payload.sendEmail({
      to: senderEmail,
      ...(notifyEmail ? { replyTo: notifyEmail } : {}),
      subject: acknowledgment.subject,
      text: acknowledgment.text,
      html: acknowledgment.html,
      attachments: logoAttachment,
    }),
  ]);

  const results = await Promise.allSettled(sends.map(([, p]) => p));
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(
        `Quote request ${input.id}: ${sends[i][0]} email failed:`,
        result.reason,
      );
    }
  });
}
