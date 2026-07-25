import type { Media, RichText } from "../type";
import type { Sector } from "../sector/type";

export interface CatalogPageGlobal {
  id: number;
  title?: string | null;
  intro?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Catalog {
  id: number;
  title?: string | null;
  slug?: string | null;
  content?: RichText | null;
  preveiw?: Media | number | null;
  category?: Sector | number | null;
  createdAt: string;
  updatedAt: string;
}