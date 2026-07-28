import { Media } from "@/types";
import { RichText } from "../type";

export type CareerProfile = "chantier-production" | "bureau-etudes";
export type ContractType = "cdi" | "cdd" | "stage";

export interface Career {
  id: number;
  title?: string | null;
  slug?: string | null;
  profile?: CareerProfile | null;
  contractType?: ContractType | null;
  location?: string | null;
  content?: RichText | null;
  heroImage?: Media | number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CareerGlobal {
  id: number;
  heroTitle?: string | null;
  heroSubtitle?: string | null;
  heroImage?: Media | number | null;
  listTitle?: string | null;
  listSubtitle?: string | null;
  emptyStateTitle?: string | null;
  emptyStateSubtitle?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}
