import { RichText } from "../type";

export interface FaqPageGlobal {
  id: number;
  title?: string | null;
  intro?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface Faq {
  id: number;
  question: string;
  answer: RichText;
  createdAt: string;
  updatedAt: string;
}