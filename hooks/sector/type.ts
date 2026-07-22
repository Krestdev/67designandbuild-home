import type { SerializedEditorState } from "lexical";
import { MediaResponse } from "@/hooks/media/type";

export type SectorResponse = {
  id: number;
  sectorsSectionTitle: string;
  sectorsSectionSubtitle: string;
  title: string;
  slug: string;
  image: MediaResponse | null;
  content: SerializedEditorState;
  updatedAt: string;
  createdAt: string;
};
