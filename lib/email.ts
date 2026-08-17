import nodemailer from "nodemailer";
import type { Payload } from "payload";

export interface QuoteRequestEmailData {
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  projectTypeTitle: string;
  sectorTitle?: string;
  location: string;
  timeline?: string;
  budget?: string;
  description: string;
  attachments?: Array<{
    filename: string;
    url: string;
  }>;
}

const getTransporter = () => {
  const host = process.env.SMTP_HOST || "smtp.mailtrap.io";
  const port = Number(process.env.SMTP_PORT) || 2525;
  const user = process.env.SMTP_USER || "";
  const pass = process.env.SMTP_PASS || "";
  const secure = port === 465;

  const auth = user && pass ? { user, pass } : undefined;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth,
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const getAbsoluteUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL
    ? new URL(process.env.NEXT_PUBLIC_API_URL).origin
    : "http://localhost:3000";
  return `${baseUrl}${url}`;
};

/**
 * Format email template for the Company
 */
export async function sendCompanyNotificationEmail(
  payload: Payload,
  data: QuoteRequestEmailData,
  receiverEmail: string
) {
  const transporter = getTransporter();
  const fromEmail = process.env.SMTP_FROM_EMAIL || "no-reply@67designandbuild.com";
  const fromName = process.env.SMTP_FROM_NAME || "67 Design & Build";

  const attachmentsListHtml = data.attachments?.length
    ? `<ul>
        ${data.attachments
      .map(
        (att) =>
          `<li><a href="${getAbsoluteUrl(att.url)}" style="color: #D97B2C; text-decoration: underline;" target="_blank">${att.filename}</a></li>`
      )
      .join("")}
       </ul>`
    : "<p style='color: #888888; font-style: italic;'>Aucun fichier joint</p>";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Nouvelle demande de devis</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #FBF3EA;
            color: #212121;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #EDD3B7;
            padding: 30px;
          }
          .header {
            border-bottom: 2px solid #D97B2C;
            padding-bottom: 15px;
            margin-bottom: 25px;
          }
          .header h2 {
            margin: 0;
            color: #212121;
            font-size: 24px;
            font-weight: 600;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #D97B2C;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: 25px;
            margin-bottom: 10px;
            border-bottom: 1px solid #EDD3B7;
            padding-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
          }
          td {
            padding: 8px 0;
            vertical-align: top;
          }
          td.label {
            width: 35%;
            font-weight: 600;
            color: #5B5B5B;
          }
          td.value {
            color: #212121;
          }
          .description-box {
            background-color: #FFF0DF;
            border-left: 3px solid #D97B2C;
            padding: 15px;
            margin-top: 10px;
            font-style: italic;
            white-space: pre-line;
            color: #333333;
          }
          .footer {
            margin-top: 35px;
            padding-top: 15px;
            border-top: 1px solid #EDD3B7;
            font-size: 12px;
            color: #AFAFAF;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Nouvelle Demande de Devis</h2>
            <p style="margin: 5px 0 0 0; color: #5B5B5B; font-size: 14px;">Reçue via le site 67 Design & Build</p>
          </div>

          <div class="section-title">Coordonnées du Client</div>
          <table>
            <tr>
              <td class="label">Nom Complet :</td>
              <td class="value"><strong>${data.fullName}</strong></td>
            </tr>
            <tr>
              <td class="label">Entreprise / Société :</td>
              <td class="value">${data.company || "-"}</td>
            </tr>
            <tr>
              <td class="label">Email :</td>
              <td class="value"><a href="mailto:${data.email}" style="color: #D97B2C; text-decoration: none;">${data.email}</a></td>
            </tr>
            <tr>
              <td class="label">Téléphone :</td>
              <td class="value"><a href="tel:${data.phone}" style="color: #212121; text-decoration: none;">${data.phone}</a></td>
            </tr>
          </table>

          <div class="section-title">Détails du Projet</div>
          <table>
            <tr>
              <td class="label">Type de Projet :</td>
              <td class="value">${data.projectTypeTitle}</td>
            </tr>
            <tr>
              <td class="label">Secteur d'Activité :</td>
              <td class="value">${data.sectorTitle || "-"}</td>
            </tr>
            <tr>
              <td class="label">Localisation :</td>
              <td class="value">${data.location}</td>
            </tr>
            <tr>
              <td class="label">Délai Souhaité :</td>
              <td class="value">${data.timeline || "-"}</td>
            </tr>
            <tr>
              <td class="label">Budget Estimatif :</td>
              <td class="value">${data.budget ? `${data.budget} FCFA` : "-"}</td>
            </tr>
          </table>

          <div class="section-title">Description du Projet</div>
          <div class="description-box">
            ${data.description}
          </div>

          <div class="section-title">Pièces Jointes</div>
          ${attachmentsListHtml}

          <div class="footer">
            Cet email a été généré automatiquement par l'application 67 Design & Build.
          </div>
        </div>
      </body>
    </html>
  `;

  await payload.sendEmail({
    from: `"${fromName}" <${fromEmail}>`,
    to: receiverEmail,
    subject: `[Devis] Nouvelle demande de ${data.fullName} - ${data.projectTypeTitle}`,
    html: htmlContent
  })

  // await transporter.sendMail({
  //   from: `"${fromName}" <${fromEmail}>`,
  //   to: receiverEmail,
  //   subject: `[Devis] Nouvelle demande de ${data.fullName} - ${data.projectTypeTitle}`,
  //   html: htmlContent,
  // });
}

/**
 * Format email template for the User (sender confirmation)
 */
export async function sendUserNotificationEmail(
  payload: Payload,
  data: QuoteRequestEmailData
) {
  const transporter = getTransporter();
  const fromEmail = process.env.SMTP_FROM_EMAIL || "no-reply@67designandbuild.com";
  const fromName = process.env.SMTP_FROM_NAME || "67 Design & Build";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Accusé de réception - Demande de devis</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #FBF3EA;
            color: #212121;
            margin: 0;
            padding: 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #EDD3B7;
            padding: 30px;
          }
          .header {
            border-bottom: 2px solid #D97B2C;
            padding-bottom: 15px;
            margin-bottom: 25px;
            text-align: center;
          }
          .header h2 {
            margin: 0;
            color: #212121;
            font-size: 22px;
            font-weight: 600;
          }
          p {
            line-height: 1.6;
            font-size: 15px;
            color: #333333;
          }
          .summary-box {
            background-color: #FFF0DF;
            border: 1px solid #EDD3B7;
            padding: 20px;
            margin: 20px 0;
          }
          .summary-title {
            font-weight: bold;
            color: #D97B2C;
            margin-bottom: 10px;
            text-transform: uppercase;
            font-size: 13px;
            letter-spacing: 0.5px;
          }
          ul {
            padding-left: 20px;
            margin: 5px 0;
          }
          li {
            margin-bottom: 5px;
          }
          .footer {
            margin-top: 35px;
            padding-top: 15px;
            border-top: 1px solid #EDD3B7;
            font-size: 12px;
            color: #AFAFAF;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Demande de Devis Reçue</h2>
          </div>

          <p>Bonjour <strong>${data.fullName}</strong>,</p>
          
          <p>Nous vous remercions pour l'intérêt que vous portez à <strong>67 Design & Build</strong>. Nous avons bien reçu votre demande de devis.</p>
          
          <p>Notre bureau d'études étudie actuellement les détails de votre projet. L'un de nos ingénieurs prendra contact avec vous dans un délai de <strong>48 à 72 heures ouvrées</strong> pour affiner votre besoin et vous proposer une solution sur mesure.</p>

          <div class="summary-box">
            <div class="summary-title">Récapitulatif de votre demande :</div>
            <table>
              <tr>
                <td style="font-weight: bold; color: #5B5B5B; padding-right: 15px; vertical-align: top;">Type :</td>
                <td>${data.projectTypeTitle}</td>
              </tr>
              ${data.sectorTitle ? `<tr><td style="font-weight: bold; color: #5B5B5B; padding-right: 15px; vertical-align: top;">Secteur :</td><td>${data.sectorTitle}</td></tr>` : ""}
              <tr>
                <td style="font-weight: bold; color: #5B5B5B; padding-right: 15px; vertical-align: top;">Lieu :</td>
                <td>${data.location}</td>
              </tr>
              ${data.budget ? `<tr><td style="font-weight: bold; color: #5B5B5B; padding-right: 15px; vertical-align: top;">Budget :</td><td>${data.budget} FCFA</td></tr>` : ""}
            </table>
          </div>

          <p>Si vous avez des questions complémentaires d'ici là, n'hésitez pas à répondre directement à ce message.</p>

          <p>Cordialement,</p>
          <p><strong>L'équipe 67 Design & Build</strong></p>

          <div class="footer">
            67 Design & Build &copy; 2026. Tous droits réservés.<br>
            Cet email est un accusé de réception automatique.
          </div>
        </div>
      </body>
    </html>
  `;

  await payload.sendEmail({
    from: `"${fromName}" <${fromEmail}>`,
    to: data.email,
    subject: `Accusé de réception - Votre demande de devis chez 67 Design & Build`,
    html: htmlContent,
  });

  // await transporter.sendMail({
  //   from: `"${fromName}" <${fromEmail}>`,
  //   to: data.email,
  //   subject: `Accusé de réception - Votre demande de devis chez 67 Design & Build`,
  //   html: htmlContent,
  // });
}
