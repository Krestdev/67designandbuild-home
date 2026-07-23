import { Media } from "../type";

export interface Partner {
  id: number;
  title: string;
  logo: Media | number;
  link?: string | null;
  createdAt: string;
  updatedAt: string;
}