import { createRequire } from "module";
import { writeFileSync } from "fs";
import { getPayload, handleEndpoints } from "payload";
import config from "@payload-config";
import { sendQuoteRequestEmails } from "./lib/quoteRequestEmails";

const SP = process.env.SP!;
const reqSp = createRequire(SP + "/package.json");
const { SMTPServer } = reqSp("smtp-server");
const { simpleParser } = reqSp("mailparser");

async function run() {
  const received: any[] = [];
  const smtp = new SMTPServer({
    authOptional: true, allowInsecureAuth: true, disabledCommands: ["STARTTLS"],
    onAuth: (_a: any, _s: any, cb: any) => cb(null, { user: "test" }),
    onData(stream: any, _s: any, cb: any) { simpleParser(stream).then((m: any) => { received.push(m); cb(); }); },
  });
  await new Promise<void>((r) => smtp.listen(2525, "127.0.0.1", r));

  const payload = await getPayload({ config });
  const rest = (method: string, path: string, body?: BodyInit, headers?: Record<string, string>) =>
    handleEndpoints({
      config, path: `/api${path.split("?")[0]}`,
      request: new Request(`http://localhost:3000/api${path}`, { method, body, headers }),
    });

  const created = { applications: [] as number[], media: [] as number[], quotes: [] as number[] };
  const checks: Array<[string, boolean]> = [];
  const check = (name: string, ok: boolean) => checks.push([name, ok]);
  const countApps = async () => (await payload.count({ collection: "applications" })).totalDocs;

  try {
    const career = (await payload.find({ collection: "career", limit: 1, locale: "fr" })).docs[0];
    const imageMedia = (await payload.find({ collection: "media", where: { mimeType: { like: "image/" } }, limit: 1 })).docs[0];

    // 1. CV upload through the REST route, as the form does
    const pdf = Buffer.from("%PDF-1.4\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n");
    const fd = new FormData();
    fd.append("file", new Blob([pdf], { type: "application/pdf" }), "cv-test-e2e.pdf");
    const up = await rest("POST", "/media", fd);
    const upJson: any = await up.json();
    check("CV upload 201", up.status === 201);
    if (up.status !== 201) console.log("UPLOAD", up.status, JSON.stringify(upJson));
    const cvId = upJson.doc?.id;
    if (cvId) created.media.push(cvId);

    const trap = `<script>alert("x")</script> & 'q'`;
    const body = (over: Record<string, unknown>) => JSON.stringify({
      career: career.id, fullName: `Awa ${trap}`, email: "awa@client.test", phone: "+237 600000000",
      message: `Ligne 1\nLigne 2 ${trap}`, cv: cvId, ...over,
    });
    const json = { "content-type": "application/json" };

    // 2. Unknown job -> 400, nothing written, no email
    const before = await countApps();
    const bad = await rest("POST", "/applications?locale=fr", body({ career: 999999 }), json);
    check("unknown job -> 400", bad.status === 400);
    check("unknown job: nothing written", (await countApps()) === before);

    // 3. Image instead of a CV -> 400
    if (imageMedia) {
      const img = await rest("POST", "/applications", body({ cv: imageMedia.id }), json);
      check("image as CV -> 400", img.status === 400);
    }
    check("no email for rejected submissions", received.length === 0);

    // 4. Valid application, invalid locale -> fr
    const ok = await rest("POST", "/applications?locale=de", body({}), json);
    const okJson: any = await ok.json();
    check("valid application -> 201", ok.status === 201);
    if (okJson.doc?.id) created.applications.push(okJson.doc.id);
    // Emails are awaited before the 201: they must already be there
    await new Promise((r) => setTimeout(r, 300));
    const notif = received.find((m) => m.to.text === "equipe@test.local");
    const ack = received.find((m) => m.to.text === "awa@client.test");
    check("2 emails sent", received.length === 2);
    check("notif replyTo = applicant", notif?.replyTo?.text === "awa@client.test");
    check("notif subject has job + name", notif?.subject === `Nouvelle candidature - ${career.title} - Awa ${trap}`);
    check("notif text + html", Boolean(notif?.text && notif?.html));
    check("notif CV attached", notif?.attachments.some((a: any) => a.filename === "cv-test-e2e.pdf" && a.content.equals(pdf)));
    check("notif logo inline", notif?.attachments.some((a: any) => a.cid === "logo" && a.contentDisposition === "inline"));
    check("notif html escaped", !notif?.html.includes("<script>") && notif?.html.includes("&lt;script&gt;"));
    check("ack replyTo = team", ack?.replyTo?.text === "equipe@test.local");
    check("invalid locale -> French ack", ack?.subject.startsWith("Nous avons bien reçu votre candidature"));
    check("ack mentions job", ack?.text.includes(String(career.title)));
    check("ack escaped", !ack?.html.includes("<script>"));

    // 5. English ack
    const en = await rest("POST", "/applications?locale=en", body({ fullName: "John" }), json);
    const enJson: any = await en.json();
    if (enJson.doc?.id) created.applications.push(enJson.doc.id);
    await new Promise((r) => setTimeout(r, 300));
    check("EN ack", received.some((m) => m.subject?.startsWith("We have received your application")));

    // 6. Applications are not publicly readable
    const list = await rest("GET", "/applications");
    const listJson: any = await list.json();
    check("anonymous GET /applications refused", list.status === 403 || (listJson.docs?.length ?? 0) === 0);
    const one = await rest("GET", `/applications/${created.applications[0]}`);
    check("anonymous GET /applications/:id refused", one.status === 403 || one.status === 404);

    // 7. Quote request emails still work after the refactor
    const q0 = received.length;
    await sendQuoteRequestEmails(payload, {
      locale: "it", id: 1, fullName: "Test", email: "q@client.test",
      projectType: { fr: "Génie civil", localized: "Ingegneria civile" },
    }, "equipe@test.local");
    const qMails = received.slice(q0);
    check("quote: 2 emails", qMails.length === 2);
    check("quote: IT ack", qMails.some((m) => m.subject.startsWith("Abbiamo ricevuto la tua richiesta")));

    const inline = (m: any) => m.attachments.reduce((h: string, a: any) =>
      a.cid ? h.replaceAll(`cid:${a.cid}`, `data:${a.contentType};base64,${a.content.toString("base64")}`) : h, m.html);
    if (notif) writeFileSync(SP + "/application-notification.html", inline(notif));
    if (ack) writeFileSync(SP + "/application-acknowledgment.html", inline(ack));
  } finally {
    for (const id of created.applications) await payload.delete({ collection: "applications", id }).catch((e) => console.error("cleanup app", e));
    for (const id of created.media) await payload.delete({ collection: "media", id }).catch((e) => console.error("cleanup media", e));
    const left = await payload.find({ collection: "media", where: { filename: { like: "cv-test-e2e" } } });
    check("cleanup: test media removed", left.totalDocs === 0);
    smtp.close();
  }
  for (const [name, ok] of checks) console.log(ok ? "OK  " : "FAIL", name);
}

await run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
