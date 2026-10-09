/**
 * Adds English and Italian versions of the seeded content (`npm run seed` and
 * `npm run seed:bulk`). French content is never modified.
 *
 *   npm run seed:translations
 *
 * Safe to re-run: it overwrites the EN/IT values with the same text.
 * Not translatable (field not localized in the schema): project challenge
 * bullets, job location, About stat values.
 */
import { getPayload, type CollectionSlug } from "payload";
import config from "../payload.config";
import { h2, richText, ul } from "./seedHelpers";

const payload = await getPayload({ config });
type Lang = "en" | "it";
const LANGS: Lang[] = ["en", "it"];
type PerLang<T> = Record<Lang, T>;

// ---------- Base content (scripts/seed.ts), keyed by slug ----------

type Pair = [label: string, description: string];
const services: Record<string, PerLang<{ title: string; intro: string; areas: Pair[]; deliverables: Pair[] }>> = {
  "genie-civil-gros-oeuvre": {
    en: {
      title: "Civil engineering & structural work",
      intro: "Foundations, reinforced concrete structures and engineering works: we build the structural shell of your projects in line with the plans, standards and deadlines.",
      areas: [["Foundations", "Shallow and deep foundations suited to the soil."], ["Reinforced concrete structures", "Columns, beams, slabs and walls for buildings of all sizes."], ["Engineering works", "Culverts, retaining walls and small crossings."]],
      deliverables: [["Execution schedule", "Detailed site phasing and control milestones."], ["Acceptance reports", "Sign-off of each key stage with the client."], ["As-built file", "As-built drawings and technical documentation handed over at completion."]],
    },
    it: {
      title: "Ingegneria civile e opere strutturali",
      intro: "Fondazioni, strutture in cemento armato e opere d'arte: realizziamo le opere strutturali dei vostri progetti nel rispetto dei disegni, delle norme e delle scadenze.",
      areas: [["Fondazioni", "Fondazioni superficiali e profonde adatte al terreno."], ["Strutture in cemento armato", "Pilastri, travi, solai e setti per edifici di ogni dimensione."], ["Opere d'arte", "Tombini, muri di sostegno e piccoli attraversamenti."]],
      deliverables: [["Cronoprogramma esecutivo", "Fasi dettagliate del cantiere e punti di controllo."], ["Verbali di collaudo", "Approvazione di ogni fase chiave con il committente."], ["Fascicolo dell'opera", "Disegni as-built e documentazione tecnica consegnati a fine lavori."]],
    },
  },
  "travaux-routiers-vrd": {
    en: {
      title: "Roads & utility networks",
      intro: "Roads, utility networks and external works: we build the access routes and networks that make your sites functional and durable.",
      areas: [["Roads", "Earthworks, subgrade, pavements and surfacing."], ["Utility networks", "Water supply, electricity, telecommunications."], ["External works", "Car parks, pavements, kerbs and signage."]],
      deliverables: [["Execution studies", "Longitudinal and cross sections, quantity take-offs."], ["Compaction tests", "In-progress tests to guarantee pavement performance."], ["As-built drawings", "Exact location of the networks built."]],
    },
    it: {
      title: "Lavori stradali e reti",
      intro: "Strade, reti di servizi e sistemazioni esterne: costruiamo gli accessi e le reti che rendono i vostri siti funzionali e duraturi.",
      areas: [["Strade", "Movimenti terra, sottofondi, pavimentazioni e manti."], ["Reti di servizi", "Acquedotto, elettricità, telecomunicazioni."], ["Sistemazioni esterne", "Parcheggi, marciapiedi, cordoli e segnaletica."]],
      deliverables: [["Studi esecutivi", "Profili longitudinali e sezioni trasversali, computi metrici."], ["Prove di compattazione", "Prove in corso d'opera per garantire la tenuta delle pavimentazioni."], ["Disegni as-built", "Posizione esatta delle reti realizzate."]],
    },
  },
  "construction-batiment": {
    en: {
      title: "Building construction",
      intro: "From private homes to office buildings, we handle the construction of your buildings, from the structural work to the finishes.",
      areas: [["Residential", "Villas, apartment buildings and housing."], ["Commercial", "Offices, shops and public buildings."], ["Facilities", "Schools, health centres and administrative buildings."]],
      deliverables: [["Detailed quote", "Item-by-item estimate before work starts."], ["Site monitoring", "Regular progress updates with photos and reports."], ["Handover", "Acceptance of the works and clearing of snags."]],
    },
    it: {
      title: "Costruzione di edifici",
      intro: "Dalla casa privata all'edificio per uffici, ci occupiamo della costruzione dei vostri edifici, dalle opere strutturali alle finiture.",
      areas: [["Residenziale", "Ville, condomini e alloggi collettivi."], ["Terziario", "Uffici, negozi ed edifici aperti al pubblico."], ["Attrezzature", "Scuole, centri sanitari ed edifici amministrativi."]],
      deliverables: [["Preventivo dettagliato", "Stima voce per voce prima dell'avvio."], ["Monitoraggio del cantiere", "Aggiornamenti regolari con foto e verbali."], ["Consegna delle chiavi", "Collaudo dei lavori e risoluzione delle riserve."]],
    },
  },
  "bureau-etudes": {
    en: {
      title: "Design & engineering office",
      intro: "Our design office supports your projects from the start: feasibility, structural design, cost estimates and technical documentation.",
      areas: [["Feasibility studies", "Technical and budget analysis of your project."], ["Structural design", "Sizing of reinforced concrete and steel structures."], ["Tender documents", "Specifications, drawings and bills of quantities."]],
      deliverables: [["Design calculations", "Justification of the structural sizing."], ["Construction drawings", "Formwork and reinforcement drawings ready for site."], ["Cost estimate", "Bill of quantities and project cost estimate."]],
    },
    it: {
      title: "Ufficio tecnico e progettazione",
      intro: "Il nostro ufficio tecnico vi accompagna fin dall'inizio: fattibilità, progettazione strutturale, stima dei costi e documentazione tecnica.",
      areas: [["Studi di fattibilità", "Analisi tecnica ed economica del progetto."], ["Calcolo strutturale", "Dimensionamento di strutture in cemento armato e acciaio."], ["Documenti di gara", "Capitolati, disegni ed elenchi prezzi."]],
      deliverables: [["Relazioni di calcolo", "Giustificazione del dimensionamento delle opere."], ["Disegni esecutivi", "Tavole di carpenteria e armatura pronte per il cantiere."], ["Stima dei costi", "Computo metrico estimativo del progetto."]],
    },
  },
  "rehabilitation-renovation": {
    en: {
      title: "Rehabilitation & renovation",
      intro: "We bring existing structures back to life: surveys, structural strengthening, compliance upgrades and full renovation.",
      areas: [["Survey", "Assessment of structural condition and defects."], ["Strengthening", "Underpinning and strengthening of load-bearing elements."], ["Renovation", "Interior refit, waterproofing and façades."]],
      deliverables: [["Survey report", "Findings, identified causes and proposed solutions."], ["Works programme", "Prioritised interventions and related budget."], ["Works guarantee", "Follow-up after acceptance of the renovated works."]],
    },
    it: {
      title: "Riqualificazione e ristrutturazione",
      intro: "Ridiamo vita alle opere esistenti: diagnosi, consolidamento strutturale, adeguamento alle norme e ristrutturazione completa.",
      areas: [["Diagnosi", "Valutazione dello stato delle strutture e dei difetti."], ["Consolidamento", "Sottofondazioni e rinforzo degli elementi portanti."], ["Ristrutturazione", "Rifacimento interni, impermeabilizzazione e facciate."]],
      deliverables: [["Relazione diagnostica", "Rilievi, cause individuate e soluzioni proposte."], ["Programma dei lavori", "Priorità degli interventi e relativo budget."], ["Garanzia dei lavori", "Assistenza dopo il collaudo delle opere ristrutturate."]],
    },
  },
  "hydraulique-assainissement": {
    en: {
      title: "Water & drainage",
      intro: "Stormwater drainage, sanitation and water supply: we design and build hydraulic works suited to the local climate.",
      areas: [["Drainage", "Gutters, collectors and stormwater management works."], ["Sanitation", "Wastewater networks, septic tanks and treatment plants."], ["Water supply", "Boreholes, water towers and distribution networks."]],
      deliverables: [["Hydraulic study", "Sizing of works according to expected flows."], ["Leak tests", "Network checks before commissioning."], ["Maintenance plan", "Recommendations for maintaining the works."]],
    },
    it: {
      title: "Idraulica e fognature",
      intro: "Drenaggio delle acque piovane, fognature e approvvigionamento idrico: progettiamo e realizziamo opere idrauliche adatte al clima locale.",
      areas: [["Drenaggio", "Canalette, collettori e opere di gestione delle acque piovane."], ["Fognature", "Reti di acque reflue, fosse settiche e impianti di depurazione."], ["Approvvigionamento idrico", "Pozzi, serbatoi pensili e reti di distribuzione."]],
      deliverables: [["Studio idraulico", "Dimensionamento delle opere in base alle portate previste."], ["Prove di tenuta", "Verifica delle reti prima della messa in servizio."], ["Piano di manutenzione", "Raccomandazioni per la manutenzione delle opere."]],
    },
  },
};

const sectors: Record<string, PerLang<{ title: string; description: string }>> = {
  residentiel: {
    en: { title: "Residential", description: "Villas, apartment buildings and housing programmes, built to last." },
    it: { title: "Residenziale", description: "Ville, condomini e programmi abitativi, costruiti per durare." },
  },
  "commercial-tertiaire": {
    en: { title: "Commercial & offices", description: "Offices, shops and public buildings, delivered on time." },
    it: { title: "Commerciale e terziario", description: "Uffici, negozi ed edifici aperti al pubblico, consegnati nei tempi." },
  },
  "infrastructures-publiques": {
    en: { title: "Public infrastructure", description: "Roads, hydraulic works and facilities serving local authorities." },
    it: { title: "Infrastrutture pubbliche", description: "Strade, opere idrauliche e attrezzature al servizio degli enti pubblici." },
  },
  industriel: {
    en: { title: "Industrial", description: "Warehouses, platforms and technical buildings adapted to operating constraints." },
    it: { title: "Industriale", description: "Magazzini, piazzali ed edifici tecnici adatti ai vincoli operativi." },
  },
};

const projects: Record<string, PerLang<{ title: string; intro: string }>> = {
  "immeuble-residentiel-r4": {
    en: { title: "Five-storey residential building", intro: "Construction of a five-storey apartment building with flats, an underground car park and shared areas." },
    it: { title: "Edificio residenziale di cinque piani", intro: "Costruzione di un edificio residenziale di cinque piani con appartamenti, parcheggio interrato e spazi comuni." },
  },
  "voirie-acces-zone-activites": {
    en: { title: "Access road to a business park", intro: "Construction of a surfaced access road with drains, lighting and signage serving a business park." },
    it: { title: "Strada di accesso a una zona artigianale", intro: "Realizzazione di una strada di accesso asfaltata con canalette, illuminazione e segnaletica per servire una zona artigianale." },
  },
  "entrepot-logistique": {
    en: { title: "Logistics warehouse", intro: "Construction of a warehouse with a heavy-duty industrial floor, loading bays and adjoining offices." },
    it: { title: "Magazzino logistico", intro: "Costruzione di un magazzino con pavimentazione industriale ad alta resistenza, baie di carico e uffici annessi." },
  },
  "renovation-immeuble-bureaux": {
    en: { title: "Office building renovation", intro: "Structural survey, strengthening and full renovation of an office building while occupied." },
    it: { title: "Ristrutturazione di un edificio per uffici", intro: "Diagnosi strutturale, consolidamento e ristrutturazione completa di un edificio per uffici in esercizio." },
  },
};
const closingParagraph: PerLang<string> = {
  en: "This project illustrates our ability to deliver demanding projects on time, with quality and safety.",
  it: "Questo cantiere dimostra la nostra capacità di realizzare progetti impegnativi nel rispetto di tempi, qualità e sicurezza.",
};

const categories: Record<string, PerLang<string>> = {
  conseils: { en: "Advice", it: "Consigli" },
  chantiers: { en: "Projects", it: "Cantieri" },
  entreprise: { en: "Company news", it: "Vita aziendale" },
};

const articles: Record<string, PerLang<{ title: string; excerpt: string; content: ReturnType<typeof richText> }>> = {
  "bien-preparer-son-projet-de-construction": {
    en: {
      title: "Preparing your construction project",
      excerpt: "Land, budget, permits: what to check before starting work.",
      content: richText(
        "A successful construction project is largely decided before the first spade hits the ground. Taking the time to prepare it well avoids unpleasant surprises during the works.",
        h2("Check the land"),
        "Land title, access, soil type: these determine the feasibility and cost of your project. A soil survey is often essential to size the foundations correctly.",
        h2("Set a realistic budget"),
        "Allow a margin for contingencies and get an item-by-item quote. This makes it easier to track spending throughout the works.",
        h2("Plan for permits"),
        "Building permits and administrative approvals take time. Building them into your schedule from the start avoids delays at kick-off.",
      ),
    },
    it: {
      title: "Preparare bene il proprio progetto di costruzione",
      excerpt: "Terreno, budget, autorizzazioni: cosa verificare prima di avviare i lavori.",
      content: richText(
        "Un progetto di costruzione riuscito si decide in gran parte prima del primo colpo di pala. Prepararlo bene evita brutte sorprese durante il cantiere.",
        h2("Verificare il terreno"),
        "Titolo di proprietà, accesso, natura del suolo: questi elementi determinano la fattibilità e il costo del progetto. Un'indagine geotecnica è spesso indispensabile per dimensionare correttamente le fondazioni.",
        h2("Definire un budget realistico"),
        "Prevedete un margine per gli imprevisti e fatevi preparare un preventivo dettagliato voce per voce. Così sarà più facile seguire le spese durante tutto il cantiere.",
        h2("Anticipare le autorizzazioni"),
        "Il permesso di costruire e le autorizzazioni amministrative richiedono tempo. Inserirli fin dall'inizio nel cronoprogramma evita ritardi all'avvio.",
      ),
    },
  },
  "les-etapes-cles-dun-chantier": {
    en: {
      title: "The key stages of a construction project",
      excerpt: "From setting out to handover, understanding how a building site runs.",
      content: richText(
        "Every site is unique, but most follow the same main stages.",
        ul(["Site set-up and setting out", "Earthworks and foundations", "Structural work", "Fit-out and finishes", "Handover and clearing of snags"]),
        "At each stage, checks ensure the work matches the drawings and good practice.",
      ),
    },
    it: {
      title: "Le fasi chiave di un cantiere edile",
      excerpt: "Dal tracciamento al collaudo, capire come si svolge un cantiere.",
      content: richText(
        "Ogni cantiere è unico, ma la maggior parte segue le stesse grandi fasi.",
        ul(["Allestimento del cantiere e tracciamento dell'opera", "Movimenti terra e fondazioni", "Opere strutturali", "Finiture e impianti", "Collaudo e risoluzione delle riserve"]),
        "In ogni fase, i controlli garantiscono che l'opera sia conforme ai disegni e alla regola d'arte.",
      ),
    },
  },
  "pourquoi-realiser-une-etude-de-sol": {
    en: {
      title: "Why carry out a soil survey?",
      excerpt: "An often-overlooked step that determines how sound your building will be.",
      content: richText(
        "A soil survey (geotechnical study) analyses the nature and strength of the ground the structure will be built on.",
        "It helps choose the right foundations, anticipate groundwater and limit the risk of cracking or settlement.",
        "Its cost is small compared with the damage it helps avoid.",
      ),
    },
    it: {
      title: "Perché fare un'indagine geotecnica?",
      excerpt: "Un passaggio spesso trascurato che determina la solidità della vostra opera.",
      content: richText(
        "L'indagine geotecnica analizza la natura e la resistenza del terreno su cui sarà costruita l'opera.",
        "Permette di scegliere le fondazioni adatte, prevedere la presenza di acqua e limitare il rischio di fessure o cedimenti.",
        "Il suo costo è minimo rispetto ai danni che aiuta a evitare.",
      ),
    },
  },
};

const careers: Record<string, PerLang<{ title: string; content: ReturnType<typeof richText> }>> = {
  "conducteur-de-travaux": {
    en: {
      title: "Site manager (M/F)",
      content: richText(
        "You run one or more construction sites, from preparation to handover.",
        h2("Responsibilities"),
        ul(["Plan and coordinate teams and subcontractors", "Monitor costs, deadlines and quality", "Enforce health and safety rules on site"]),
        h2("Profile"),
        "Degree in civil engineering or construction; first experience in site management is a plus.",
      ),
    },
    it: {
      title: "Direttore di cantiere (M/F)",
      content: richText(
        "Gestisci uno o più cantieri, dalla preparazione al collaudo.",
        h2("Mansioni"),
        ul(["Pianificare e coordinare squadre e subappaltatori", "Monitorare costi, tempi e qualità", "Garantire il rispetto delle norme di sicurezza in cantiere"]),
        h2("Profilo"),
        "Formazione in ingegneria civile o edilizia; una prima esperienza come direttore di cantiere è gradita.",
      ),
    },
  },
  "ingenieur-structure": {
    en: {
      title: "Structural engineer (M/F)",
      content: richText(
        "Within the design office, you design and size the structures of our projects.",
        h2("Responsibilities"),
        ul(["Produce design calculations and construction drawings", "Support site teams on technical questions", "Contribute to cost studies and tenders"]),
        h2("Profile"),
        "Civil engineer, proficient with structural analysis software.",
      ),
    },
    it: {
      title: "Ingegnere strutturista (M/F)",
      content: richText(
        "All'interno dell'ufficio tecnico, progetti e dimensioni le strutture dei nostri progetti.",
        h2("Mansioni"),
        ul(["Redigere relazioni di calcolo e disegni esecutivi", "Supportare le squadre di cantiere sulle questioni tecniche", "Partecipare alle stime dei costi e alle gare d'appalto"]),
        h2("Profilo"),
        "Ingegnere civile, padronanza dei software di calcolo strutturale.",
      ),
    },
  },
  "stage-genie-civil": {
    en: {
      title: "Civil engineering internship (M/F)",
      content: richText(
        "You assist a site manager with the day-to-day running of a construction site.",
        "Final-year or work-placement internship in civil engineering or construction.",
      ),
    },
    it: {
      title: "Tirocinio in ingegneria civile (M/F)",
      content: richText(
        "Affianchi un direttore di cantiere nella gestione quotidiana di un cantiere.",
        "Tirocinio di fine studi o curriculare, in ingegneria civile o edilizia.",
      ),
    },
  },
};

// FAQs have no slug: keyed by the French question.
const faqs: Record<string, PerLang<[question: string, answer: string]>> = {
  "Quels types de projets réalisez-vous ?": {
    en: ["What kinds of projects do you carry out?", "We work on building projects (residential, commercial, public facilities) and public works (roads, networks, hydraulic works), from design to construction."],
    it: ["Che tipo di progetti realizzate?", "Interveniamo su progetti edilizi (residenziale, terziario, attrezzature) e lavori pubblici (strade, reti, opere idrauliche), dalla progettazione alla realizzazione."],
  },
  "Comment obtenir un devis ?": {
    en: ["How do I get a quote?", "Fill in the quote request form on the Contact page with a description of your project. We will get back to you quickly to discuss your needs."],
    it: ["Come posso ottenere un preventivo?", "Compilate il modulo di richiesta preventivo nella pagina Contatti descrivendo il vostro progetto. Vi ricontatteremo rapidamente per discutere le vostre esigenze."],
  },
  "Dans quelles zones intervenez-vous ?": {
    en: ["Which areas do you cover?", "Our head office is in Douala. We work in Douala and the surrounding area, and consider projects in other regions of Cameroon."],
    it: ["In quali zone operate?", "La nostra sede è a Douala. Operiamo a Douala e dintorni, e valutiamo progetti in altre regioni del Camerun."],
  },
  "Pouvez-vous prendre en charge les études avant travaux ?": {
    en: ["Can you handle the pre-construction studies?", "Yes. Our design office carries out feasibility studies, structural sizing and the technical documents your project needs."],
    it: ["Potete occuparvi degli studi preliminari ai lavori?", "Sì. Il nostro ufficio tecnico realizza studi di fattibilità, dimensionamento strutturale e la documentazione tecnica necessaria al vostro progetto."],
  },
  "Comment suivez-vous l'avancement d'un chantier ?": {
    en: ["How do you track a project's progress?", "Each site is supervised by a site manager. You receive regular progress updates and are involved in the key approval stages."],
    it: ["Come seguite l'avanzamento di un cantiere?", "Ogni cantiere è seguito da un direttore di cantiere. Ricevete aggiornamenti regolari e siete coinvolti nelle fasi chiave di approvazione."],
  },
  "Les travaux sont-ils garantis ?": {
    en: ["Are the works guaranteed?", "Works are formally handed over with snags cleared, and we remain at your side after delivery."],
    it: ["I lavori sono garantiti?", "Le opere sono oggetto di un collaudo formale con risoluzione delle riserve, e restiamo al vostro fianco dopo la consegna."],
  },
};

// ---------- Globals ----------

const globals: Record<string, PerLang<Record<string, unknown>>> = {
  home: {
    en: { heroTitle: "Building the future, with rigour and commitment", heroContent: "DESIGN & BUILD supports your civil engineering and public works projects, from design to delivery.", heroCTA: "Request a quote", heroCTA2: "Our projects" },
    it: { heroTitle: "Costruire il futuro, con rigore e impegno", heroContent: "DESIGN & BUILD accompagna i vostri progetti di ingegneria civile e lavori pubblici, dalla progettazione alla consegna.", heroCTA: "Richiedi un preventivo", heroCTA2: "I nostri progetti" },
  },
  Service: {
    en: { title: "Our services", intro: "From design to construction, we cover every civil engineering and public works trade." },
    it: { title: "I nostri servizi", intro: "Dalla progettazione alla realizzazione, copriamo tutti i mestieri dell'ingegneria civile e dei lavori pubblici." },
  },
  Sector: {
    en: { title: "Our sectors", intro: "We support a wide range of projects, for private and public clients alike." },
    it: { title: "I nostri settori", intro: "Accompagniamo progetti diversi, per clienti privati e pubblici." },
  },
  catalog: {
    en: { title: "Our projects", intro: "A selection of projects delivered by our teams." },
    it: { title: "I nostri progetti", intro: "Una selezione di progetti realizzati dai nostri team." },
  },
  RealisationsGlobal: {
    en: { heroTitle: "Our projects", heroSubtitle: "Projects delivered with rigour, from buildings to infrastructure." },
    it: { heroTitle: "I nostri progetti", heroSubtitle: "Progetti realizzati con rigore, dagli edifici alle infrastrutture." },
  },
  ActualitesGlobal: {
    en: { heroTitle: "News", heroSubtitle: "Advice, projects and company news." },
    it: { heroTitle: "Notizie", heroSubtitle: "Consigli, cantieri e vita aziendale." },
  },
  CareerGlobal: {
    en: { heroTitle: "Join us", heroSubtitle: "Build your career with a team committed to civil engineering and public works.", listTitle: "Our job offers", listSubtitle: "Site, production or design office: find the role that suits you.", emptyStateTitle: "No openings at the moment", emptyStateSubtitle: "You can send us a speculative application via the Contact page." },
    it: { heroTitle: "Unisciti a noi", heroSubtitle: "Costruisci la tua carriera con un team impegnato nell'ingegneria civile e nei lavori pubblici.", listTitle: "Le nostre offerte di lavoro", listSubtitle: "Cantiere, produzione o ufficio tecnico: trova il ruolo adatto a te.", emptyStateTitle: "Nessuna offerta al momento", emptyStateSubtitle: "Puoi inviarci una candidatura spontanea tramite la pagina Contatti." },
  },
  faq: {
    en: { title: "Frequently asked questions", intro: "Answers to the questions we are asked most often." },
    it: { title: "Domande frequenti", intro: "Le risposte alle domande che ci vengono poste più spesso." },
  },
  Contact: {
    en: { heroTitle: "Contact us", heroSubtitle: "Tell us about your project: we'll get back to you quickly.", coordonneesTitle: "Our contact details", coordonneesSubtitle: "We're here to help.", address: "Douala, Cameroon", hours: "Monday – Friday: 8:00 am – 5:00 pm" },
    it: { heroTitle: "Contattaci", heroSubtitle: "Raccontaci il tuo progetto: ti risponderemo rapidamente.", coordonneesTitle: "I nostri recapiti", coordonneesSubtitle: "Siamo a vostra disposizione.", address: "Douala, Camerun", hours: "Lunedì – Venerdì: 8:00 – 17:00" },
  },
  "cta-banner": {
    en: { title: "Have a project in mind?", content: "Let's talk. Our team supports you from study to construction.", cta: "Request a quote" },
    it: { title: "Hai un progetto?", content: "Parliamone. Il nostro team ti accompagna dallo studio alla realizzazione.", cta: "Richiedi un preventivo" },
  },
  navbar: {
    en: { aboutUs: "About", services: "Services", sectors: "Sectors", catalogs: "Projects", blogs: "News", careers: "Careers", contact: "Contact" },
    it: { aboutUs: "Chi siamo", services: "Servizi", sectors: "Settori", catalogs: "Progetti", blogs: "Notizie", careers: "Lavora con noi", contact: "Contatti" },
  },
};

const aboutText: PerLang<{
  title: string; content: string[]; hero: [string, string]; eyebrow: string; statLabels: string[];
  direction: [string, string]; role: string; bio: string;
  steps: [string, string]; stepItems: Pair[]; guarantees: [string, string]; guaranteeItems: Pair[];
  footerAddress: string; copyright: string; usefulLinks: string[]; companyLinks: string[];
}> = {
  en: {
    title: "Who we are",
    content: [
      "DESIGN & BUILD is a civil engineering and public works company founded on 6 May 2022 in Douala, Cameroon.",
      "We support individuals, businesses and public authorities in delivering their projects, with a constant focus on quality, safety and meeting deadlines.",
    ],
    hero: ["About DESIGN & BUILD", "A Cameroonian civil engineering and public works company."],
    eyebrow: "ABOUT US",
    statLabels: ["Year founded", "Areas of expertise", "Head office"],
    direction: ["Management", "A committed team serving your projects."],
    role: "Managing Director",
    bio: "[Director's biography to be completed in the admin.]",
    steps: ["Our approach", "Structured support, from idea to delivery."],
    stepItems: [["Listening", "We analyse your needs, your site and your budget."], ["Design", "Our design office designs a tailored solution."], ["Construction", "Our teams carry out the works with rigour."], ["Delivery", "Handover of the works and after-delivery support."]],
    guarantees: ["Our commitments", "What you can count on."],
    guaranteeItems: [["Quality", "Works that comply with standards and good practice."], ["Safety", "Sites organised to protect teams and neighbours."], ["Transparency", "Clear quotes and regular progress updates."]],
    footerAddress: "Douala, Cameroon",
    copyright: "All rights reserved",
    usefulLinks: ["Services", "Projects", "News", "Contact"],
    companyLinks: ["About", "Careers", "FAQ"],
  },
  it: {
    title: "Chi siamo",
    content: [
      "DESIGN & BUILD è un'impresa di ingegneria civile e lavori pubblici fondata il 6 maggio 2022 a Douala, in Camerun.",
      "Accompagniamo privati, aziende ed enti pubblici nella realizzazione dei loro progetti, con un'attenzione costante a qualità, sicurezza e rispetto dei tempi.",
    ],
    hero: ["Chi è DESIGN & BUILD", "Un'impresa camerunese di ingegneria civile e lavori pubblici."],
    eyebrow: "CHI SIAMO",
    statLabels: ["Anno di fondazione", "Ambiti di competenza", "Sede"],
    direction: ["La direzione", "Un team impegnato al servizio dei vostri progetti."],
    role: "Direttore generale",
    bio: "[Biografia del direttore da completare nell'amministrazione.]",
    steps: ["Il nostro metodo", "Un accompagnamento strutturato, dall'idea alla consegna."],
    stepItems: [["Ascolto", "Analizziamo le vostre esigenze, il sito e il budget."], ["Progettazione", "Il nostro ufficio tecnico progetta una soluzione su misura."], ["Realizzazione", "Le nostre squadre eseguono i lavori con rigore."], ["Consegna", "Collaudo dell'opera e assistenza dopo la consegna."]],
    guarantees: ["I nostri impegni", "Su cosa potete contare."],
    guaranteeItems: [["Qualità", "Opere conformi alle norme e alla regola d'arte."], ["Sicurezza", "Cantieri organizzati per proteggere squadre e vicini."], ["Trasparenza", "Preventivi chiari e aggiornamenti regolari."]],
    footerAddress: "Douala, Camerun",
    copyright: "Tutti i diritti riservati",
    usefulLinks: ["Servizi", "Progetti", "Notizie", "Contatti"],
    companyLinks: ["Chi siamo", "Lavora con noi", "FAQ"],
  },
};

// ---------- Test items (scripts/seed-bulk.ts) ----------

const testItems = [
  { prefix: "test-service-", collection: "Services", label: { en: "Test service", it: "Servizio di test" } },
  { prefix: "test-secteur-", collection: "Sectors", label: { en: "Test sector", it: "Settore di test" } },
  { prefix: "test-realisation-", collection: "catalogs", label: { en: "Test project", it: "Progetto di test" } },
  { prefix: "test-article-", collection: "articles", label: { en: "Test article", it: "Articolo di test" } },
  { prefix: "test-offre-", collection: "career", label: { en: "Test job offer", it: "Offerta di lavoro di test" } },
] as const;
const testBody: PerLang<(title: string) => ReturnType<typeof richText>> = {
  en: (title) => richText(`${title} — test content to check the layout. Not meant for publication.`, h2("Test section"), ul(["First test item", "Second test item with a slightly longer label", "Third item"]), "Test closing paragraph."),
  it: (title) => richText(`${title} — contenuto di test per verificare l'impaginazione. Non destinato alla pubblicazione.`, h2("Sezione di test"), ul(["Primo punto di test", "Secondo punto di test con un'etichetta un po' più lunga", "Terzo punto"]), "Paragrafo conclusivo di test."),
};
const numberOf = (slug: string) => slug.split("-").pop() ?? "";

// ---------- Apply ----------

let updated = 0;
const missing: string[] = [];

// Non-localized `slug` is passed back unchanged so the slug hook never regenerates it.
async function updateBySlug(collection: CollectionSlug, slug: string, locale: Lang, data: Record<string, unknown>) {
  const doc = (await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0];
  if (!doc) return missing.push(`${collection}/${slug}`);
  await payload.update({ collection, id: doc.id, locale, data: { ...data, slug } });
  updated++;
}

for (const locale of LANGS) {
  payload.logger.info(`Translating base content (${locale})...`);

  for (const [slug, t] of Object.entries(services)) {
    const s = t[locale];
    await updateBySlug("Services", slug, locale, {
      title: s.title,
      content: richText(s.intro),
      applicationAreas: s.areas.map(([label, description]) => ({ label, description })),
      deliverables: s.deliverables.map(([label, description]) => ({ label, description })),
    });
  }
  for (const [slug, t] of Object.entries(sectors)) {
    const s = t[locale];
    await updateBySlug("Sectors", slug, locale, { title: s.title, description: s.description, content: richText(s.description) });
  }
  for (const [slug, t] of Object.entries(projects)) {
    const p = t[locale];
    await updateBySlug("catalogs", slug, locale, { title: p.title, content: richText(p.intro), closingParagraph: closingParagraph[locale] });
  }
  for (const [slug, t] of Object.entries(categories)) {
    await updateBySlug("categories", slug, locale, { title: t[locale] });
  }
  for (const [slug, t] of Object.entries(articles)) {
    await updateBySlug("articles", slug, locale, t[locale]);
  }
  for (const [slug, t] of Object.entries(careers)) {
    await updateBySlug("career", slug, locale, t[locale]);
  }
  for (const [frQuestion, t] of Object.entries(faqs)) {
    const doc = (await payload.find({ collection: "faqs", locale: "fr", where: { question: { equals: frQuestion } }, limit: 1 })).docs[0];
    if (!doc) {
      missing.push(`faqs/${frQuestion}`);
      continue;
    }
    const [question, answer] = t[locale];
    await payload.update({ collection: "faqs", id: doc.id, locale, data: { question, answer: richText(answer) } });
    updated++;
  }

  for (const [slug, t] of Object.entries(globals)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await payload.updateGlobal({ slug: slug as any, locale, data: t[locale] });
    updated++;
  }

  // About and footer: array rows are shared across locales, so keep each
  // row's id and non-localized values and only replace the localized text.
  const a = aboutText[locale];
  const about = await payload.findGlobal({ slug: "about", locale: "fr", depth: 0 });
  const rows = <T extends { id?: string | null }>(existing: T[] | null | undefined, text: Pair[] | string[], build: (row: T, i: number) => object) =>
    (existing ?? []).slice(0, text.length).map((row, i) => ({ ...row, ...build(row, i) }));
  await payload.updateGlobal({
    slug: "about",
    locale,
    data: {
      title: a.title,
      content: richText(...a.content),
      hero: { ...about.hero, title: a.hero[0], subtitle: a.hero[1] },
      introExtras: {
        eyebrow: a.eyebrow,
        stats: rows(about.introExtras?.stats, a.statLabels, (_row, i) => ({ label: a.statLabels[i] })),
      },
      direction: {
        title: a.direction[0],
        subtitle: a.direction[1],
        person: { ...about.direction?.person, role: a.role, bio: richText(a.bio) },
      },
      steps: {
        title: a.steps[0],
        subtitle: a.steps[1],
        items: rows(about.steps?.items, a.stepItems, (_row, i) => ({ title: a.stepItems[i][0], description: a.stepItems[i][1] })),
      },
      guarantees: {
        title: a.guarantees[0],
        subtitle: a.guarantees[1],
        items: rows(about.guarantees?.items, a.guaranteeItems, (_row, i) => ({ title: a.guaranteeItems[i][0], description: a.guaranteeItems[i][1] })),
      },
    },
  });
  const footer = await payload.findGlobal({ slug: "footer", locale: "fr", depth: 0 });
  await payload.updateGlobal({
    slug: "footer",
    locale,
    data: {
      contactInfo: { ...footer.contactInfo, contactAddress: a.footerAddress },
      copyrightText: a.copyright,
      usefullLinks: rows(footer.usefullLinks, a.usefulLinks, (_row, i) => ({ lable: a.usefulLinks[i] })),
      Enterprise: rows(footer.Enterprise, a.companyLinks, (_row, i) => ({ lable: a.companyLinks[i] })),
    },
  });
  updated += 2;

  payload.logger.info(`Translating test items (${locale})...`);
  for (const { prefix, collection, label } of testItems) {
    const { docs } = await payload.find({ collection, where: { slug: { like: prefix } }, limit: 0, depth: 0 });
    for (const doc of docs) {
      const slug = doc.slug as string;
      const title = `${label[locale]} ${numberOf(slug)}`;
      const data: Record<string, unknown> = { title, content: testBody[locale](title) };
      if (collection === "Sectors") data.description = locale === "en" ? `Short description of test sector ${numberOf(slug)}.` : `Breve descrizione del settore di test ${numberOf(slug)}.`;
      if (collection === "articles") data.excerpt = locale === "en" ? `Summary of test article ${numberOf(slug)}.` : `Sintesi dell'articolo di test ${numberOf(slug)}.`;
      if (collection === "catalogs") data.closingParagraph = locale === "en" ? "Test closing paragraph." : "Paragrafo di chiusura di test.";
      if (collection === "Services") {
        data.applicationAreas = [{ label: locale === "en" ? "Test area" : "Ambito di test", description: locale === "en" ? "Test description." : "Descrizione di test." }];
        data.deliverables = [{ label: locale === "en" ? "Test deliverable" : "Documento di test", description: locale === "en" ? "Test description." : "Descrizione di test." }];
      }
      await payload.update({ collection, id: doc.id, locale, data: { ...data, slug } });
      updated++;
    }
  }
  const testFaqs = (await payload.find({ collection: "faqs", locale: "fr", where: { question: { like: "[Test]" } }, limit: 0 })).docs;
  for (const doc of testFaqs) {
    const n = doc.question.match(/\d+/)?.[0] ?? "";
    await payload.update({
      collection: "faqs",
      id: doc.id,
      locale,
      data: {
        question: locale === "en" ? `[Test] Question ${n}?` : `[Test] Domanda ${n}?`,
        answer: richText(locale === "en" ? `Test answer ${n}.` : `Risposta di test ${n}.`),
      },
    });
    updated++;
  }
  const testPartners = (await payload.find({ collection: "partners", locale: "fr", where: { title: { like: "[Test]" } }, limit: 0, depth: 0 })).docs;
  for (const doc of testPartners) {
    const n = doc.title.match(/\d+/)?.[0] ?? "";
    await payload.update({ collection: "partners", id: doc.id, locale, data: { title: locale === "en" ? `[Test] Partner ${n}` : `[Test] Partner ${n}` } });
    updated++;
  }
}

payload.logger.info(`Done: ${updated} updates.${missing.length ? ` Not found (skipped): ${missing.join(", ")}` : ""}`);
process.exit(0);
