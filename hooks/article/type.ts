import { Media, RichText } from "../type";

export interface Category {
  id: number;
  title?: string | null;
  slug?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Article {
  id: number;
  title?: string | null;
  slug?: string | null;
  image?: Media | number | null;
  excerpt?: string | null;
  publishedDate?: string | null;
  featured?: boolean | null;
  category?: Category | number | null;
  content?: RichText | null;
  createdAt: string;
  updatedAt: string;
}

export interface ActualitesGlobal {
  id: number;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: Media | number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}