import { Media } from "../type";


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