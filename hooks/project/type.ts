import type { SerializedEditorState } from "lexical";
import { MediaResponse } from "@/hooks/media/type";
import { SectorResponse } from "@/hooks/sector/type";

export type ProjectResponse = {
  id: number;
  title: string;
  slug: string;
  category: SectorResponse | number;
  image: MediaResponse | null;
  content: SerializedEditorState;
  updatedAt: string;
  createdAt: string;
};
