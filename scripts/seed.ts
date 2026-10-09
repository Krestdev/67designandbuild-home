/**
 * Seeds the CMS with French starter content (other locales fall back to FR).
 *
 *   npm run seed
 *
 * Refuses to run if services already exist, so it never overwrites real content.
 * Images are generated placeholders; contact details, director and job offers
 * are placeholders to replace in the admin before going live.
 */
import { getPayload } from "payload";
import { h2, placeholderImage, richText, ul } from "./seedHelpers";
import config from "../payload.config";

// ---------- Content ----------

const services = [
  {
    slug: "genie-civil-gros-oeuvre",
    title: "Génie civil & gros œuvre",
    intro:
      "Fondations, structures en béton armé et ouvrages d'art : nous réalisons le gros œuvre de vos projets dans le respect des plans, des normes et des délais.",
    applicationAreas: [
      ["Fondations", "Fondations superficielles et profondes adaptées à la nature du sol."],
      ["Structures béton armé", "Poteaux, poutres, dalles et voiles pour bâtiments de toutes tailles."],
      ["Ouvrages d'art", "Dalots, murs de soutènement et petits ouvrages de franchissement."],
    ],
    deliverables: [
      ["Planning d'exécution", "Phasage détaillé du chantier et jalons de contrôle."],
      ["Procès-verbaux de réception", "Validation de chaque étape clé avec le maître d'ouvrage."],
      ["Dossier des ouvrages exécutés", "Plans de récolement et documentation technique remise en fin de chantier."],
    ],
  },
  {
    slug: "travaux-routiers-vrd",
    title: "Travaux routiers & VRD",
    intro:
      "Voiries, réseaux divers et aménagements extérieurs : nous construisons les accès et réseaux qui rendent vos sites fonctionnels et durables.",
    applicationAreas: [
      ["Voiries", "Terrassements, couches de forme, chaussées et revêtements."],
      ["Réseaux divers", "Adduction d'eau, électricité, télécommunications."],
      ["Aménagements extérieurs", "Parkings, trottoirs, bordures et signalisation."],
    ],
    deliverables: [
      ["Études d'exécution", "Profils en long, profils en travers et métrés."],
      ["Contrôles de compactage", "Essais en cours de travaux pour garantir la tenue des chaussées."],
      ["Plans de récolement", "Implantation précise des réseaux réalisés."],
    ],
  },
  {
    slug: "construction-batiment",
    title: "Construction de bâtiments",
    intro:
      "Du logement individuel à l'immeuble de bureaux, nous prenons en charge la construction de vos bâtiments, du gros œuvre jusqu'aux finitions.",
    applicationAreas: [
      ["Résidentiel", "Villas, immeubles d'habitation et logements collectifs."],
      ["Tertiaire", "Bureaux, commerces et bâtiments recevant du public."],
      ["Équipements", "Écoles, centres de santé et bâtiments administratifs."],
    ],
    deliverables: [
      ["Devis détaillé", "Estimation poste par poste avant le démarrage."],
      ["Suivi de chantier", "Points d'avancement réguliers avec photos et comptes rendus."],
      ["Remise des clés", "Réception des travaux et levée des réserves."],
    ],
  },
  {
    slug: "bureau-etudes",
    title: "Bureau d'études & conception",
    intro:
      "Notre bureau d'études accompagne vos projets en amont : faisabilité, conception structurelle, estimation des coûts et préparation des dossiers techniques.",
    applicationAreas: [
      ["Études de faisabilité", "Analyse technique et budgétaire de votre projet."],
      ["Calcul de structures", "Dimensionnement des ouvrages en béton armé et en charpente."],
      ["Dossiers d'appel d'offres", "Pièces écrites, plans et bordereaux de prix."],
    ],
    deliverables: [
      ["Notes de calcul", "Justification du dimensionnement des ouvrages."],
      ["Plans d'exécution", "Plans de coffrage et de ferraillage prêts pour le chantier."],
      ["Estimation des coûts", "Devis quantitatif et estimatif du projet."],
    ],
  },
  {
    slug: "rehabilitation-renovation",
    title: "Réhabilitation & rénovation",
    intro:
      "Nous redonnons vie aux ouvrages existants : diagnostic, renforcement de structures, mise aux normes et rénovation complète.",
    applicationAreas: [
      ["Diagnostic", "Évaluation de l'état des structures et des pathologies."],
      ["Renforcement", "Reprise en sous-œuvre et renforcement d'éléments porteurs."],
      ["Rénovation", "Réaménagement intérieur, étanchéité et façades."],
    ],
    deliverables: [
      ["Rapport de diagnostic", "Constat, causes identifiées et solutions proposées."],
      ["Programme de travaux", "Priorisation des interventions et budget associé."],
      ["Garantie des travaux", "Suivi après réception des ouvrages rénovés."],
    ],
  },
  {
    slug: "hydraulique-assainissement",
    title: "Hydraulique & assainissement",
    intro:
      "Drainage des eaux pluviales, assainissement et adduction d'eau : nous concevons et réalisons des ouvrages hydrauliques adaptés au climat local.",
    applicationAreas: [
      ["Drainage", "Caniveaux, collecteurs et ouvrages de gestion des eaux pluviales."],
      ["Assainissement", "Réseaux d'eaux usées, fosses et stations de traitement."],
      ["Adduction d'eau", "Forages, châteaux d'eau et réseaux de distribution."],
    ],
    deliverables: [
      ["Étude hydraulique", "Dimensionnement des ouvrages selon les débits attendus."],
      ["Essais d'étanchéité", "Contrôle des réseaux avant mise en service."],
      ["Plan d'entretien", "Recommandations pour la maintenance des ouvrages."],
    ],
  },
];

const sectors = [
  {
    slug: "residentiel",
    title: "Résidentiel",
    description: "Villas, immeubles d'habitation et programmes de logements, construits pour durer.",
    services: ["construction-batiment", "genie-civil-gros-oeuvre", "rehabilitation-renovation"],
  },
  {
    slug: "commercial-tertiaire",
    title: "Commercial & tertiaire",
    description: "Bureaux, commerces et bâtiments recevant du public, livrés dans les délais.",
    services: ["construction-batiment", "bureau-etudes", "rehabilitation-renovation"],
  },
  {
    slug: "infrastructures-publiques",
    title: "Infrastructures publiques",
    description: "Routes, ouvrages hydrauliques et équipements au service des collectivités.",
    services: ["travaux-routiers-vrd", "hydraulique-assainissement", "genie-civil-gros-oeuvre"],
  },
  {
    slug: "industriel",
    title: "Industriel",
    description: "Entrepôts, plateformes et bâtiments techniques adaptés aux contraintes d'exploitation.",
    services: ["genie-civil-gros-oeuvre", "travaux-routiers-vrd", "bureau-etudes"],
  },
];

const projects = [
  {
    slug: "immeuble-residentiel-r4",
    title: "Immeuble résidentiel R+4",
    sector: "residentiel",
    service: "construction-batiment",
    duration: "14 mois",
    status: "en-cours",
    intro:
      "Construction d'un immeuble d'habitation de quatre étages comprenant des appartements, un parking en sous-sol et des espaces communs.",
    challenges: [
      "Terrain en pente nécessitant des terrassements importants",
      "Coordination de plusieurs corps d'état sur un site restreint",
      "Respect du planning pendant la saison des pluies",
    ],
  },
  {
    slug: "voirie-acces-zone-activites",
    title: "Voirie d'accès à une zone d'activités",
    sector: "infrastructures-publiques",
    service: "travaux-routiers-vrd",
    duration: "6 mois",
    status: "livre",
    intro:
      "Réalisation d'une voie d'accès revêtue avec caniveaux, éclairage et signalisation pour desservir une zone d'activités.",
    challenges: [
      "Maintien de la circulation pendant les travaux",
      "Gestion des eaux pluviales sur un sol argileux",
      "Contrôles de compactage à chaque couche",
    ],
  },
  {
    slug: "entrepot-logistique",
    title: "Entrepôt logistique",
    sector: "industriel",
    service: "genie-civil-gros-oeuvre",
    duration: "9 mois",
    status: "livre",
    intro:
      "Construction d'un entrepôt avec dallage industriel haute résistance, quais de chargement et bureaux attenants.",
    challenges: [
      "Dallage dimensionné pour de fortes charges roulantes",
      "Grande portée de charpente sans appuis intermédiaires",
      "Livraison par phases pour un démarrage d'activité anticipé",
    ],
  },
  {
    slug: "renovation-immeuble-bureaux",
    title: "Rénovation d'un immeuble de bureaux",
    sector: "commercial-tertiaire",
    service: "rehabilitation-renovation",
    duration: "5 mois",
    status: "planifie",
    intro:
      "Diagnostic structurel, renforcement et rénovation complète d'un immeuble de bureaux en site occupé.",
    challenges: [
      "Travaux réalisés en site occupé",
      "Renforcement de planchers existants",
      "Mise aux normes de l'étanchéité et des façades",
    ],
  },
];

const categories = [
  { slug: "conseils", title: "Conseils" },
  { slug: "chantiers", title: "Chantiers" },
  { slug: "entreprise", title: "Vie de l'entreprise" },
];

const articles = [
  {
    slug: "bien-preparer-son-projet-de-construction",
    title: "Bien préparer son projet de construction",
    category: "conseils",
    featured: true,
    daysAgo: 7,
    excerpt: "Terrain, budget, autorisations : les points à vérifier avant de lancer vos travaux.",
    content: richText(
      "Un projet de construction réussi se joue en grande partie avant le premier coup de pelle. Prendre le temps de bien le préparer permet d'éviter les mauvaises surprises en cours de chantier.",
      h2("Vérifier le terrain"),
      "Titre foncier, accès, nature du sol : ces éléments conditionnent la faisabilité et le coût de votre projet. Une étude de sol est souvent indispensable pour dimensionner correctement les fondations.",
      h2("Définir un budget réaliste"),
      "Prévoyez une marge pour les imprévus et faites établir un devis détaillé poste par poste. Cela facilite le suivi des dépenses tout au long du chantier.",
      h2("Anticiper les autorisations"),
      "Le permis de bâtir et les autorisations administratives demandent du temps. Les intégrer dès le départ dans votre planning évite des retards au démarrage.",
    ),
  },
  {
    slug: "les-etapes-cles-dun-chantier",
    title: "Les étapes clés d'un chantier de construction",
    category: "chantiers",
    featured: false,
    daysAgo: 21,
    excerpt: "De l'implantation à la réception des travaux, comprendre le déroulement d'un chantier.",
    content: richText(
      "Chaque chantier est unique, mais la plupart suivent les mêmes grandes étapes.",
      ul([
        "Installation de chantier et implantation de l'ouvrage",
        "Terrassements et fondations",
        "Élévation du gros œuvre",
        "Second œuvre et finitions",
        "Réception des travaux et levée des réserves",
      ]),
      "À chaque étape, des contrôles permettent de s'assurer que l'ouvrage est conforme aux plans et aux règles de l'art.",
    ),
  },
  {
    slug: "pourquoi-realiser-une-etude-de-sol",
    title: "Pourquoi réaliser une étude de sol ?",
    category: "conseils",
    featured: false,
    daysAgo: 35,
    excerpt: "Une étape souvent négligée qui conditionne pourtant la solidité de votre ouvrage.",
    content: richText(
      "L'étude de sol (ou étude géotechnique) analyse la nature et la résistance du terrain sur lequel l'ouvrage sera construit.",
      "Elle permet de choisir le type de fondations adapté, d'anticiper la présence d'eau et de limiter les risques de fissures ou de tassements.",
      "Son coût reste faible au regard des désordres qu'elle permet d'éviter.",
    ),
  },
];

const careers = [
  {
    slug: "conducteur-de-travaux",
    title: "Conducteur de travaux (H/F)",
    profile: "chantier-production",
    contractType: "cdi",
    location: "Douala",
    content: richText(
      "Vous pilotez un ou plusieurs chantiers de construction, de la préparation jusqu'à la réception des travaux.",
      h2("Missions"),
      ul([
        "Planifier et coordonner les équipes et sous-traitants",
        "Suivre les coûts, les délais et la qualité",
        "Assurer le respect des règles de sécurité sur chantier",
      ]),
      h2("Profil"),
      "Formation en génie civil ou bâtiment, première expérience en conduite de travaux appréciée.",
    ),
  },
  {
    slug: "ingenieur-structure",
    title: "Ingénieur structure (H/F)",
    profile: "bureau-etudes",
    contractType: "cdi",
    location: "Douala",
    content: richText(
      "Au sein du bureau d'études, vous concevez et dimensionnez les structures de nos projets.",
      h2("Missions"),
      ul([
        "Réaliser les notes de calcul et les plans d'exécution",
        "Accompagner les équipes chantier sur les questions techniques",
        "Participer aux études de prix et aux appels d'offres",
      ]),
      h2("Profil"),
      "Ingénieur en génie civil, maîtrise des logiciels de calcul de structures.",
    ),
  },
  {
    slug: "stage-genie-civil",
    title: "Stage en génie civil (H/F)",
    profile: "chantier-production",
    contractType: "stage",
    location: "Douala",
    content: richText(
      "Vous accompagnez un conducteur de travaux dans le suivi quotidien d'un chantier.",
      "Stage de fin d'études ou stage pratique, en génie civil ou bâtiment.",
    ),
  },
];

const faqs = [
  [
    "Quels types de projets réalisez-vous ?",
    "Nous intervenons sur des projets de bâtiment (résidentiel, tertiaire, équipements) et de travaux publics (voiries, réseaux, ouvrages hydrauliques), de la conception à la réalisation.",
  ],
  [
    "Comment obtenir un devis ?",
    "Remplissez le formulaire de demande de devis sur la page Contact en décrivant votre projet. Nous revenons vers vous rapidement pour échanger sur vos besoins.",
  ],
  [
    "Dans quelles zones intervenez-vous ?",
    "Notre siège est à Douala. Nous intervenons à Douala et dans ses environs, et étudions les projets situés dans d'autres régions du Cameroun.",
  ],
  [
    "Pouvez-vous prendre en charge les études avant travaux ?",
    "Oui. Notre bureau d'études réalise les études de faisabilité, le dimensionnement des structures et les dossiers techniques nécessaires à votre projet.",
  ],
  [
    "Comment suivez-vous l'avancement d'un chantier ?",
    "Chaque chantier est suivi par un conducteur de travaux. Vous recevez des points d'avancement réguliers et êtes associé aux étapes clés de validation.",
  ],
  [
    "Les travaux sont-ils garantis ?",
    "Les ouvrages font l'objet d'une réception formelle avec levée des réserves, et nous restons à vos côtés après la livraison.",
  ],
];

// ---------- Seed ----------

async function seed() {
  const payload = await getPayload({ config });

  const existing = await payload.count({ collection: "Services" });
  if (existing.totalDocs > 0) {
    payload.logger.warn("Content already exists (Services is not empty). Nothing seeded.");
    process.exit(0);
  }

  const image = async (label: string, alt: string, width?: number, height?: number) => {
    const data = await placeholderImage(label, width, height);
    const slug = label
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const doc = await payload.create({
      collection: "media",
      data: { alt },
      file: { data, mimetype: "image/jpeg", name: `seed-${slug}.jpg`, size: data.length },
    });
    return doc.id;
  };

  payload.logger.info("Seeding services...");
  const serviceIds: Record<string, number> = {};
  for (const s of services) {
    const doc = await payload.create({
      collection: "Services",
      locale: "fr",
      data: {
        title: s.title,
        slug: s.slug,
        content: richText(s.intro),
        preveiw: await image(s.title, s.title),
        applicationAreas: s.applicationAreas.map(([label, description]) => ({ label, description })),
        deliverables: s.deliverables.map(([label, description]) => ({ label, description })),
      },
    });
    serviceIds[s.slug] = doc.id;
  }

  payload.logger.info("Seeding sectors...");
  const sectorIds: Record<string, number> = {};
  for (const s of sectors) {
    const doc = await payload.create({
      collection: "Sectors",
      locale: "fr",
      data: {
        title: s.title,
        slug: s.slug,
        description: s.description,
        content: richText(s.description),
        image: await image(s.title, s.title),
        associatedServices: s.services.map((slug) => serviceIds[slug]),
      },
    });
    sectorIds[s.slug] = doc.id;
  }

  // Sectors/Services list their projects through join fields on these relations.
  payload.logger.info("Seeding projects (réalisations)...");
  for (const pr of projects) {
    await payload.create({
      collection: "catalogs",
      locale: "fr",
      data: {
        title: pr.title,
        slug: pr.slug,
        content: richText(pr.intro),
        preveiw: await image(pr.title, pr.title),
        category: sectorIds[pr.sector],
        serviceCategory: serviceIds[pr.service],
        client: "Client à renseigner",
        duration: pr.duration,
        status: pr.status as "livre" | "en-cours" | "planifie",
        challenges: pr.challenges.map((t) => ({ text: t })),
        closingParagraph:
          "Ce chantier illustre notre capacité à mener des projets exigeants dans le respect des délais, de la qualité et de la sécurité.",
        galleryPortrait: await image(`${pr.title} — vue 1`, pr.title, 900, 1200),
        galleryLandscape: await image(`${pr.title} — vue 2`, pr.title),
      },
    });
  }

  payload.logger.info("Seeding news...");
  const categoryIds: Record<string, number> = {};
  for (const c of categories) {
    const doc = await payload.create({ collection: "categories", locale: "fr", data: c });
    categoryIds[c.slug] = doc.id;
  }
  for (const a of articles) {
    await payload.create({
      collection: "articles",
      locale: "fr",
      data: {
        title: a.title,
        slug: a.slug,
        excerpt: a.excerpt,
        featured: a.featured,
        publishedDate: new Date(Date.now() - a.daysAgo * 86_400_000).toISOString(),
        category: categoryIds[a.category],
        image: await image(a.title, a.title),
        content: a.content,
      },
    });
  }

  payload.logger.info("Seeding careers and FAQ...");
  for (const c of careers) {
    await payload.create({
      collection: "career",
      locale: "fr",
      data: { ...c, profile: c.profile as "chantier-production", contractType: c.contractType as "cdi" },
    });
  }
  for (const [question, answer] of faqs) {
    await payload.create({ collection: "faqs", locale: "fr", data: { question, answer: richText(answer) } });
  }

  payload.logger.info("Seeding page content (globals)...");
  const g = (slug: string, data: Record<string, unknown>) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.updateGlobal({ slug: slug as any, locale: "fr", data });

  await g("home", {
    heroImage: await image("Design & Build", "Chantier de construction", 1920, 1080),
    heroTitle: "Bâtir l'avenir, avec rigueur et engagement",
    heroContent:
      "DESIGN & BUILD accompagne vos projets de génie civil et de travaux publics, de la conception à la livraison.",
    heroCTA: "Demander un devis",
    heroCTA2: "Nos réalisations",
  });

  await g("about", {
    title: "Qui sommes-nous ?",
    slug: "about",
    content: richText(
      "DESIGN & BUILD est une entreprise de génie civil et de travaux publics fondée le 6 mai 2022 à Douala, au Cameroun.",
      "Nous accompagnons particuliers, entreprises et collectivités dans la réalisation de leurs projets, avec une exigence constante de qualité, de sécurité et de respect des délais.",
    ),
    hero: {
      title: "À propos de DESIGN & BUILD",
      subtitle: "Une entreprise camerounaise de génie civil et de travaux publics.",
      backgroundImage: await image("À propos", "Équipe sur chantier", 1920, 1080),
    },
    introExtras: {
      eyebrow: "À PROPOS",
      stats: [
        { value: "2022", label: "Année de création" },
        { value: "6", label: "Domaines d'expertise" },
        { value: "Douala", label: "Siège social" },
      ],
    },
    direction: {
      title: "La direction",
      subtitle: "Une équipe engagée au service de vos projets.",
      person: {
        name: "[Nom du dirigeant]",
        role: "Directeur général",
        bio: richText("[Biographie du dirigeant à compléter dans l'administration.]"),
        photo: await image("Photo du dirigeant", "Portrait du dirigeant", 800, 1000),
      },
    },
    steps: {
      title: "Notre démarche",
      subtitle: "Un accompagnement structuré, de l'idée à la livraison.",
      items: [
        { number: "01", title: "Écoute", description: "Nous analysons vos besoins, votre site et votre budget." },
        { number: "02", title: "Conception", description: "Notre bureau d'études conçoit une solution adaptée." },
        { number: "03", title: "Réalisation", description: "Nos équipes exécutent les travaux avec rigueur." },
        { number: "04", title: "Livraison", description: "Réception de l'ouvrage et accompagnement après livraison." },
      ],
    },
    guarantees: {
      title: "Nos engagements",
      subtitle: "Ce sur quoi vous pouvez compter.",
      items: [
        { number: "01", title: "Qualité", description: "Des ouvrages conformes aux normes et aux règles de l'art." },
        { number: "02", title: "Sécurité", description: "Des chantiers organisés pour protéger les équipes et les riverains." },
        { number: "03", title: "Transparence", description: "Des devis clairs et un suivi régulier de l'avancement." },
      ],
    },
  });

  await g("Service", {
    title: "Nos services",
    intro: "De la conception à la réalisation, nous couvrons l'ensemble des métiers du génie civil et des travaux publics.",
  });
  await g("Sector", {
    title: "Nos secteurs d'intervention",
    intro: "Nous accompagnons des projets variés, pour des clients privés comme publics.",
  });
  await g("catalog", {
    title: "Nos réalisations",
    intro: "Découvrez une sélection de projets menés par nos équipes.",
  });
  await g("RealisationsGlobal", {
    heroTitle: "Nos réalisations",
    heroSubtitle: "Des projets menés avec rigueur, du bâtiment aux infrastructures.",
    heroImage: await image("Nos réalisations", "Projets réalisés", 1920, 1080),
  });
  await g("ActualitesGlobal", {
    heroTitle: "Actualités",
    heroSubtitle: "Conseils, chantiers et vie de l'entreprise.",
    heroImage: await image("Actualités", "Actualités", 1920, 1080),
  });
  await g("CareerGlobal", {
    heroTitle: "Rejoignez-nous",
    heroSubtitle: "Construisez votre carrière avec une équipe engagée dans le génie civil et les travaux publics.",
    listTitle: "Nos offres d'emploi",
    listSubtitle: "Chantier, production ou bureau d'études : trouvez le poste qui vous correspond.",
    emptyStateTitle: "Aucune offre pour le moment",
    emptyStateSubtitle: "Vous pouvez nous envoyer une candidature spontanée via la page Contact.",
    heroImage: await image("Carrières", "Carrières", 1920, 1080),
  });
  await g("faq", {
    title: "Questions fréquentes",
    intro: "Les réponses aux questions que l'on nous pose le plus souvent.",
  });
  await g("Contact", {
    heroTitle: "Contactez-nous",
    heroSubtitle: "Parlez-nous de votre projet : nous vous répondons rapidement.",
    coordonneesTitle: "Nos coordonnées",
    coordonneesSubtitle: "Nous sommes à votre écoute.",
    address: "Douala, Cameroun",
    phone: "+237 6XX XX XX XX",
    email: "contact@67designandbuild.com",
    hours: "Lundi – Vendredi : 8h00 – 17h00",
    mapLatitude: 4.0511,
    mapLongitude: 9.7679,
  });
  await g("cta-banner", {
    title: "Vous avez un projet ?",
    content: "Parlons-en. Notre équipe vous accompagne de l'étude à la réalisation.",
    cta: "Demander un devis",
  });
  await g("navbar", {
    aboutUs: "À propos",
    services: "Services",
    sectors: "Secteurs",
    catalogs: "Réalisations",
    blogs: "Actualités",
    careers: "Carrières",
    contact: "Contact",
  });
  await g("footer", {
    contactInfo: {
      contactEmail: "contact@67designandbuild.com",
      contactPhone: "+237 6XX XX XX XX",
      contactAddress: "Douala, Cameroun",
    },
    // Footer.tsx already renders "© <year> 67 Design & Build." before this and a "." after.
    copyrightText: "Tous droits réservés",
    socialLinks: [],
    usefullLinks: [{ lable: "Services" }, { lable: "Réalisations" }, { lable: "Actualités" }, { lable: "Contact" }],
    Enterprise: [{ lable: "À propos" }, { lable: "Carrières" }, { lable: "FAQ" }],
  });

  payload.logger.info("Done.");
  process.exit(0);
}

// Top-level await: `payload run` exits as soon as the import resolves.
await seed();
