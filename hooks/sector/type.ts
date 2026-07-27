import { Media, RichText } from "../type";


export interface SectorPageGlobal {
  id: number;
  title?: string | null;
  intro?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Sector {
  id: number;
  title?: string | null;
  slug?: string | null;
  image?: Media | number | null;
  description?: string | null;
  content?: RichText | null;
  createdAt: string;
  updatedAt: string;
}