import { Media } from "../type";

export interface RealisationsGlobal {
  id: number;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: Media | number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}