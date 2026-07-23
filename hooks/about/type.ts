import { RichText } from "../type";


export interface AboutGlobal {
  id: number;
  title?: string | null;
  slug?: string | null;
  content?: RichText | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}