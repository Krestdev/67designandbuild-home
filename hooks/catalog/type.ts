import type { Media, RichText } from "../type";
import type { Sector } from "../sector/type";
import type { Service } from "../service/type";

export interface CatalogPageGlobal {
  id: number;
  title?: string | null;
  intro?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export type CatalogStatus = "livre" | "en-cours" | "planifie";

export interface CatalogChallenge {
  text?: string | null;
}

export interface Catalog {
  id: number;
  title?: string | null;
  slug?: string | null;
  content?: RichText | null;
  preveiw?: Media | number | null;
  category?: Sector | number | null;
  client?: string | null;
  serviceCategory?: Service | number | null;
  duration?: string | null;
  status?: CatalogStatus | null;
  challenges?: CatalogChallenge[] | null;
  closingParagraph?: string | null;
  galleryPortrait?: Media | number | null;
  galleryLandscape?: Media | number | null;
  createdAt: string;
  updatedAt: string;
}