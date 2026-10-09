/**
 * Tops up each listing to TARGET items with clearly-marked test content, to
 * check layouts, menus and long lists.
 *
 *   npm run seed:bulk            add test items (run `npm run seed` first)
 *   npm run seed:bulk -- --clean remove every test item and test image
 *
 * Test items use a "test-" slug prefix (or a "[Test]" label where there is no
 * slug) so they can be removed without touching real content.
 */
import { getPayload, type CollectionSlug } from "payload";
import config from "../payload.config";
import { h2, placeholderImage, richText, ul } from "./seedHelpers";

const TARGET = 30;
const TEST_ALT = "[Test] image";

const payload = await getPayload({ config });
const clean = process.argv.includes("--clean");

const pad = (n: number) => String(n).padStart(2, "0");
const pick = <T>(list: T[], i: number) => list[i % list.length];

async function removeTestContent() {
  // Order matters: delete what references sectors/services/categories first.
  // `like` matches anywhere in the value, so use the full test prefixes.
  const prefixes: [CollectionSlug, string][] = [
    ["articles", "test-article-"],
    ["catalogs", "test-realisation-"],
    ["career", "test-offre-"],
    ["Services", "test-service-"],
    ["Sectors", "test-secteur-"],
  ];
  for (const [collection, prefix] of prefixes) {
    const { docs } = await payload.delete({ collection, where: { slug: { like: prefix } } });
    payload.logger.info(`Removed ${docs.length} test ${collection}`);
  }
  const faqs = await payload.delete({ collection: "faqs", where: { question: { like: "[Test]" } } });
  const partners = await payload.delete({ collection: "partners", where: { title: { like: "[Test]" } } });
  const media = await payload.delete({ collection: "media", where: { alt: { equals: TEST_ALT } } });
  payload.logger.info(`Removed ${faqs.docs.length} test faqs, ${partners.docs.length} partners, ${media.docs.length} images`);
}

if (clean) {
  await removeTestContent();
  process.exit(0);
}

const count = async (collection: CollectionSlug) => (await payload.count({ collection })).totalDocs;

if ((await count("Services")) === 0) {
  payload.logger.error("Run `npm run seed` first: test items are attached to the base sectors, services and categories.");
  process.exit(1);
}

// A small pool of images shared by all test items keeps the upload count low.
payload.logger.info("Generating test images...");
const uploadPool = async (size: number, width: number, height: number, label: string) => {
  const ids: number[] = [];
  for (let i = 1; i <= size; i++) {
    const data = await placeholderImage(`${label} ${i}`, width, height);
    const doc = await payload.create({
      collection: "media",
      data: { alt: TEST_ALT },
      file: { data, mimetype: "image/jpeg", name: `test-${label.toLowerCase()}-${i}.jpg`, size: data.length },
    });
    ids.push(doc.id);
  }
  return ids;
};
const landscapes = await uploadPool(8, 1600, 1000, "Test");
const portraits = await uploadPool(3, 900, 1200, "Portrait");
const logos = await uploadPool(6, 400, 200, "Logo");

// Titles of varied length, to exercise wrapping in cards and menus.
const serviceNames = [
  "Terrassement", "Charpente métallique", "Étanchéité des toitures et terrasses accessibles", "Topographie",
  "Démolition", "Revêtements de sols", "Menuiserie aluminium", "Électricité bâtiment", "Plomberie sanitaire",
  "Assainissement autonome et raccordement aux réseaux publics", "Peinture", "Maçonnerie", "Forages",
  "Signalisation routière", "Ouvrages d'art et franchissements", "Aménagement paysager", "Clôtures",
  "Voirie lourde", "Expertise", "Diagnostic structurel avant acquisition immobilière", "Coffrage", "Ferraillage",
  "Isolation", "Réseaux secs",
];
const sectorNames = [
  "Santé", "Éducation", "Hôtellerie", "Logistique", "Énergie", "Agro-industrie", "Portuaire",
  "Bâtiments administratifs et équipements des collectivités territoriales", "Sport", "Culture", "Banque",
  "Télécommunications", "Mines", "Commerce de détail", "Transport urbain", "Résidences étudiantes",
  "Lieux de culte", "Zones industrielles", "Aéroportuaire", "Tourisme", "Grande distribution",
  "Habitat social et programmes de logements à loyer modéré", "Pétrole et gaz", "Eau potable", "Défense", "Loisirs",
];
const projectTypes = [
  "Immeuble R+3", "Villa", "Entrepôt", "Route bitumée", "École primaire", "Centre de santé", "Pont",
  "Station-service", "Immeuble de bureaux de grande hauteur avec parking souterrain", "Marché couvert",
  "Château d'eau", "Hangar", "Résidence", "Caniveaux", "Clinique",
];
const places = ["Bonapriso", "Akwa", "Bonamoussadi", "Makepe", "Logbessou", "Yaoundé", "Kribi", "Limbé", "Édéa", "Bafoussam"];
const jobTitles = [
  "Chef de chantier", "Technicien topographe", "Dessinateur projeteur", "Métreur", "Chef d'équipe maçonnerie",
  "Responsable qualité, hygiène, sécurité et environnement", "Ingénieur travaux", "Assistant administratif",
  "Conducteur d'engins", "Électricien", "Économiste de la construction", "Magasinier",
];
const statuses = ["livre", "en-cours", "planifie"] as const;
const profiles = ["chantier-production", "bureau-etudes"] as const;
const contracts = ["cdi", "cdd", "stage"] as const;

const services = (await payload.find({ collection: "Services", limit: 0, depth: 0 })).docs;
const sectors = (await payload.find({ collection: "Sectors", limit: 0, depth: 0 })).docs;
const categories = (await payload.find({ collection: "categories", limit: 0, depth: 0 })).docs;

const body = (title: string) =>
  richText(
    `${title} — contenu de test pour vérifier la mise en page. Ce texte n'est pas destiné à la publication.`,
    h2("Section de test"),
    ul(["Premier point de test", "Deuxième point de test avec un libellé un peu plus long", "Troisième point"]),
    "Paragraphe de conclusion de test.",
  );

let added = 0;

payload.logger.info("Adding test services...");
for (let i = await count("Services"); i < TARGET; i++) {
  const title = `${pick(serviceNames, i)} (test ${pad(i + 1)})`;
  const doc = await payload.create({
    collection: "Services",
    locale: "fr",
    data: {
      title,
      slug: `test-service-${pad(i + 1)}`,
      content: body(title),
      preveiw: pick(landscapes, i),
      applicationAreas: [{ label: "Domaine de test", description: "Description de test." }],
      deliverables: [{ label: "Livrable de test", description: "Description de test." }],
    },
  });
  services.push(doc);
  added++;
}

payload.logger.info("Adding test sectors...");
for (let i = await count("Sectors"); i < TARGET; i++) {
  const title = `${pick(sectorNames, i)} (test ${pad(i + 1)})`;
  const doc = await payload.create({
    collection: "Sectors",
    locale: "fr",
    data: {
      title,
      slug: `test-secteur-${pad(i + 1)}`,
      description: `Description courte du secteur de test ${pad(i + 1)}.`,
      content: body(title),
      image: pick(landscapes, i + 3),
      gallery: [0, 1, 2].map((k) => ({ photo: pick(landscapes, i + k) })),
      associatedServices: [pick(services, i).id, pick(services, i + 7).id],
    },
  });
  sectors.push(doc);
  added++;
}

payload.logger.info("Adding test projects...");
for (let i = await count("catalogs"); i < TARGET; i++) {
  const title = `${pick(projectTypes, i)} à ${pick(places, i)} (test ${pad(i + 1)})`;
  await payload.create({
    collection: "catalogs",
    locale: "fr",
    data: {
      title,
      slug: `test-realisation-${pad(i + 1)}`,
      content: body(title),
      preveiw: pick(landscapes, i),
      category: pick(sectors, i).id,
      serviceCategory: pick(services, i * 7).id,
      client: "[Test] Client",
      duration: `${(i % 18) + 2} mois`,
      status: pick([...statuses], i),
      challenges: [{ text: "Enjeu de test 1" }, { text: "Enjeu de test 2" }],
      closingParagraph: "Paragraphe de clôture de test.",
      galleryPortrait: pick(portraits, i),
      galleryLandscape: pick(landscapes, i + 1),
    },
  });
  added++;
}

payload.logger.info("Adding test articles...");
for (let i = await count("articles"); i < TARGET; i++) {
  const title = `Article de test ${pad(i + 1)}${i % 4 === 0 ? " avec un titre volontairement long pour tester le retour à la ligne" : ""}`;
  await payload.create({
    collection: "articles",
    locale: "fr",
    data: {
      title,
      slug: `test-article-${pad(i + 1)}`,
      excerpt: `Résumé de l'article de test ${pad(i + 1)}.`,
      featured: i % 10 === 0,
      publishedDate: new Date(Date.now() - (i * 9 + 40) * 86_400_000).toISOString(),
      category: pick(categories, i).id,
      image: pick(landscapes, i),
      content: body(title),
    },
  });
  added++;
}

payload.logger.info("Adding test job offers...");
for (let i = await count("career"); i < TARGET; i++) {
  const title = `${pick(jobTitles, i)} (test ${pad(i + 1)})`;
  await payload.create({
    collection: "career",
    locale: "fr",
    data: {
      title,
      slug: `test-offre-${pad(i + 1)}`,
      profile: pick([...profiles], i),
      contractType: pick([...contracts], i),
      location: pick(["Douala", "Yaoundé", "Kribi", "Limbé"], i),
      content: body(title),
    },
  });
  added++;
}

payload.logger.info("Adding test FAQs...");
for (let i = await count("faqs"); i < TARGET; i++) {
  await payload.create({
    collection: "faqs",
    locale: "fr",
    data: {
      question: `[Test] Question ${pad(i + 1)}${i % 3 === 0 ? " formulée de manière plus longue pour vérifier l'affichage sur plusieurs lignes" : ""} ?`,
      answer: richText(`Réponse de test ${pad(i + 1)}.`),
    },
  });
  added++;
}

payload.logger.info("Adding test partners...");
for (let i = await count("partners"); i < TARGET; i++) {
  await payload.create({
    collection: "partners",
    locale: "fr",
    data: { title: `[Test] Partenaire ${pad(i + 1)}`, logo: pick(logos, i) },
  });
  added++;
}

payload.logger.info(`Done: ${added} test items added. Remove them with \`npm run seed:bulk -- --clean\`.`);
process.exit(0);
