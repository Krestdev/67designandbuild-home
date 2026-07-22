import type { SerializedEditorState } from "lexical";
import { MediaResponse } from "@/hooks/media/type";

export type SectorResponse = {
  id: number;
  title: string;
  slug: string;
  image: MediaResponse | null;
  content: SerializedEditorState;
  order: number | null;
  updatedAt: string;
  createdAt: string;
};
