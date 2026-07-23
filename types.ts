/**
 * Simplified TypeScript type definitions for the 67 Design and Build core website pages.
 * These types match the schema of Payload CMS collections and globals but are simplified
 * for direct, easy consumption on the frontend.
 */

// Lexical RichText node structure is simplified to any for easy usage with components like RichTextRenderer
export interface RichText {
  [key: string]: unknown;
}

export interface Media {
  id: number;
  url: string;
  alt?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
    };
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
    };
    tablet?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
    };
  };
  createdAt: string;
  updatedAt: string;
}

/* ==========================================
   COLLECTIONS
   ========================================== */

export interface Service {
  id: number;
  title?: string | null;
  slug?: string | null;
  content?: RichText | null;
  preveiw?: Media | number | null; // Note: 'preveiw' is spelled this way in the collection schema
  createdAt: string;
  updatedAt: string;
}

export interface Sector {
  id: number;
  title?: string | null;
  slug?: string | null;
  image?: Media | number | null;
  content?: RichText | null;
  createdAt: string;
  updatedAt: string;
}

export interface Catalog {
  id: number;
  title?: string | null;
  slug?: string | null;
  content?: RichText | null;
  preveiw?: Media | number | null; // Note: 'preveiw' is spelled this way in the collection schema
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: number;
  title?: string | null;
  slug?: string | null;
  content?: RichText | null;
  preveiw?: Media | number | null; // Note: 'preveiw' is spelled this way in the collection schema
  createdAt: string;
  updatedAt: string;
}

export interface Career {
  id: number;
  title?: string | null;
  slug?: string | null;
  content?: RichText | null;
  preveiw?: Media | number | null; // Note: 'preveiw' is spelled this way in the collection schema
  createdAt: string;
  updatedAt: string;
}

export interface Partner {
  id: number;
  title: string;
  logo: Media | number;
  link?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Faq {
  id: number;
  question: string;
  answer: RichText;
  createdAt: string;
  updatedAt: string;
}

/* ==========================================
   GLOBALS (Landing / Meta Pages)
   ========================================== */

export interface HomeGlobal {
  id: number;
  heroImage?: Media | number | null;
  heroTitle?: string | null;
  heroContent?: string | null;
  heroCTA?: string | null;
  heroCTA2?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AboutGlobal {
  id: number;
  title?: string | null;
  slug?: string | null;
  content?: RichText | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// These resolve the slug/type conflicts between collections and index page globals
export interface ServicePageGlobal {
  id: number;
  title?: string | null;
  intro?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface SectorPageGlobal {
  id: number;
  title?: string | null;
  intro?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CatalogPageGlobal {
  id: number;
  title?: string | null;
  intro?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface FaqPageGlobal {
  id: number;
  title?: string | null;
  intro?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface NavbarGlobal {
  id: number;
  aboutUs?: string | null;
  services?: string | null;
  sectors?: string | null;
  catalogs?: string | null;
  blogs?: string | null;
  careers?: string | null;
  contact?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface FooterGlobal {
  id: number;
  contactInfo?: {
    contactEmail?: string | null;
    contactPhone?: string | null;
    contactAddress?: string | null;
  } | null;
  copyrightText?: string | null;
  socialLinks?: {
    platform?: string | null;
    url?: string | null;
    id?: string | null;
  }[] | null;
  usefullLinks?: { // Note: 'usefullLinks' is spelled this way in the schema
    lable?: string | null; // Note: 'lable' is spelled this way in the schema
    id?: string | null;
  }[] | null;
  Enterprise?: {
    lable?: string | null; // Note: 'lable' is spelled this way in the schema
    id?: string | null;
  }[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface CtaBannerGlobal {
  id: number;
  title?: string | null;
  content?: string | null;
  cta?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
