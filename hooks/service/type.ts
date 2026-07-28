import { Media, RichText } from "../type";
import type { Catalog } from "@/hooks/catalog/type";

export interface ServicePageGlobal {
  id: number;
  title?: string | null;
  intro?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface ApplicationArea {
  label?: string | null;
  description?: string | null;
}

export interface Deliverable {
  label?: string | null;
  description?: string | null;
}

export interface Service {
  id: number;
  title?: string | null;
  slug?: string | null;
  content?: RichText | null;
  preveiw?: Media | number | null;
  applicationAreas?: ApplicationArea[] | null;
  deliverables?: Deliverable[] | null;
  relatedProjects?: (Catalog | number)[] | null;
  createdAt: string;
  updatedAt: string;
}