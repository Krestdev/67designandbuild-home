import { Media, RichText } from "../type";

export interface Blog {
  id: number;
  title?: string | null;
  slug?: string | null;
  content?: RichText | null;
  preveiw?: Media | number | null; // Note: 'preveiw' is spelled this way in the collection schema
  createdAt: string;
  updatedAt: string;
}