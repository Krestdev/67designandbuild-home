import { MediaResponse } from "@/hooks/media/type";

export type HomeResponse = {
  id: number;
  heroImage: MediaResponse | null;
  heroTitle: string;
  heroContent: string;
  heroCTA: string;
  heroCTA2: string;
  introContent: string;
  bannerImage: MediaResponse | null;
  updatedAt: string;
  createdAt: string;
  globalType: string;
}