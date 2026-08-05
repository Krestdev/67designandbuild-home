import { Media, RichText } from "../type";
import type { Service } from "@/hooks/service/type";
import type { Catalog } from "@/hooks/catalog/type";

export interface SectorPageGlobal {
  id: number;
  title?: string | null;
  intro?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface SectorGalleryImage {
  photo?: Media | number | null;
}

export interface Sector {
  id: number;
  title?: string | null;
  slug?: string | null;
  image?: Media | number | null;
  description?: string | null;
  content?: RichText | null;
  gallery?: SectorGalleryImage[] | null;
  associatedServices?: (Service | number)[] | null;
  relatedProjects?: (Catalog | number)[] | null;
  createdAt: string;
  updatedAt: string;
}