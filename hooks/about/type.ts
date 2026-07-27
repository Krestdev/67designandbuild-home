import { RichText } from "../type";

interface Stat {
  id: string;
  value?: string | null;
  label?: string | null;
}

interface StepItem {
  id: string;
  number?: string | null;
  title?: string | null;
  description?: string | null;
}

interface GuaranteeItem {
  id: string;
  number?: string | null;
  title?: string | null;
  description?: string | null;
}

interface Media {
  id: number;
  url?: string | null;
  alt?: string | null;
}

export interface AboutGlobal {
  id: number;
  title?: string | null;
  slug?: string | null;
  content?: RichText | null;

  hero?: {
    title?: string | null;
    subtitle?: string | null;
    backgroundImage?: Media | number | null;
  } | null;

  introExtras?: {
    eyebrow?: string | null;
    stats?: Stat[] | null;
  } | null;

  direction?: {
    title?: string | null;
    subtitle?: string | null;
    person?: {
      name?: string | null;
      role?: string | null;
      bio?: RichText | null;
      photo?: Media | number | null;
    } | null;
  } | null;

  steps?: {
    title?: string | null;
    subtitle?: string | null;
    items?: StepItem[] | null;
  } | null;

  guarantees?: {
    title?: string | null;
    subtitle?: string | null;
    items?: GuaranteeItem[] | null;
  } | null;

  createdAt?: string | null;
  updatedAt?: string | null;
}