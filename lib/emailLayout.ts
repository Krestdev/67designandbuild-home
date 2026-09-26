import { promises as fs } from "fs";
import path from "path";
import type { Payload, PayloadRequest } from "payload";

// Shared building blocks for the transactional emails (quote requests, job applications).

export type EmailLocale = "fr" | "en" | "it";

export const EMAIL_LOCALES: EmailLocale[] = ["fr", "en", "it"];
export const DEFAULT_EMAIL_LOCALE: EmailLocale = "fr";

export function toEmailLocale(value: unknown): EmailLocale {
  return EMAIL_LOCALES.includes(value as EmailLocale)
    ? (value as EmailLocale)
    : DEFAULT_EMAIL_LOCALE;
}

export const SITE_NAME = "67 Design & Build";
export const BRAND = {
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

export type FileLink = { filename: string; url: string };
export type MailAttachment = {
  filename: string;
  content: Buffer;
  cid?: string;
  contentDisposition?: "inline" | "attachment";
};

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const escapeMultiline = (value: string) =>
  escapeHtml(value).replace(/\r\n|\r|\n/g, "<br>");

// Subjects and headers must stay on one line (header injection).
export const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

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

/** Logo as an inline CID attachment, or an empty list when the file can't be read. */
export async function logoAttachments(): Promise<MailAttachment[]> {
  const logo = await loadLogo();
  return logo
    ? [{ filename: "logo.png", content: logo, cid: "logo", contentDisposition: "inline" }]
    : [];
}

const siteOrigin = () => {
  try {
    return process.env.NEXT_PUBLIC_API_URL
      ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
      : "http://localhost:3000";
  } catch {
    return "http://localhost:3000";
  }
};

export const absoluteUrl = (url: string) =>
  /^https?:\/\//.test(url) ? url : `${siteOrigin()}${url}`;

export const adminUrl = (collection: string, id: number | string) => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return siteUrl ? `${siteUrl}/admin/collections/${collection}/${id}` : null;
};

/** Downloads uploaded files so they can be attached; a file that fails is skipped (it stays linked in the body). */
export async function loadAttachments(files: FileLink[]) {
  const loaded: MailAttachment[] = [];
  let total = 0;
  for (const file of files) {
    try {
      const res = await fetch(absoluteUrl(file.url), {
        signal: AbortSignal.timeout(ATTACHMENT_FETCH_TIMEOUT_MS),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const content = Buffer.from(await res.arrayBuffer());
      if (total + content.length > MAX_INLINE_ATTACHMENTS_BYTES) continue;
      total += content.length;
      loaded.push({ filename: oneLine(file.filename), content });
    } catch (err) {
      console.error(`Email attachment ${file.filename} not attached:`, err);
    }
  }
  return loaded;
}

export function layout(title: string, body: string, hasLogo: boolean) {
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

/** Label/value table; empty values are left out. */
export function detailsTable(rows: Array<[string, string]>) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size:14px;">${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;width:40%;color:${BRAND.muted};font-weight:bold;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;vertical-align:top;">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>`;
}

export const sectionTitle = (title: string) =>
  `<p style="margin:24px 0 8px;font-weight:bold;color:${BRAND.accent};">${escapeHtml(title)}</p>`;

export const quoteBox = (value: string) =>
  `<div style="background-color:#FFF0DF;border-left:3px solid ${BRAND.accent};padding:12px 16px;">${escapeMultiline(value)}</div>`;

export const fileList = (files: FileLink[]) =>
  `<ul style="margin:0;padding-left:20px;">${files
    .map(
      (f) =>
        `<li><a href="${escapeHtml(absoluteUrl(f.url))}" style="color:${BRAND.accent};">${escapeHtml(f.filename)}</a></li>`,
    )
    .join("")}</ul>`;

export const adminButton = (url: string) =>
  `<p style="margin:28px 0 0;"><a href="${escapeHtml(url)}" style="display:inline-block;background-color:${BRAND.accent};color:#ffffff;text-decoration:none;padding:10px 18px;font-weight:bold;">Voir dans l'admin</a></p>`;

export const automaticFooter = (text: string) =>
  `<p style="margin:28px 0 0;padding-top:16px;border-top:1px solid ${BRAND.border};font-size:12px;color:#8A8A8A;">${escapeHtml(text)}</p>`;

/** APPLICATIONS_NOTIFY_EMAIL, or the email of the Contact global as a fallback. */
export async function resolveNotifyEmail(req: PayloadRequest) {
  if (process.env.APPLICATIONS_NOTIFY_EMAIL) {
    return process.env.APPLICATIONS_NOTIFY_EMAIL;
  }
  try {
    const contact = await req.payload.findGlobal({ slug: "Contact", req });
    return contact?.email || null;
  } catch (err) {
    console.error("Error fetching Contact global email:", err);
    return null;
  }
}

export type Mail = {
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
  attachments?: MailAttachment[];
};

/**
 * Sends each email independently and logs failures. Never throws: the
 * submission is already saved when this runs.
 */
export async function sendAll(
  payload: Payload,
  context: string,
  mails: Array<[string, Mail]>,
) {
  const results = await Promise.allSettled(
    mails.map(([, mail]) => payload.sendEmail(mail)),
  );
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(`${context}: ${mails[i][0]} email failed:`, result.reason);
    }
  });
}
