import type { SerializedEditorState } from "lexical";
import { MediaResponse } from "@/hooks/media/type";

export type ProjectCategory =
  | "residentiel"
  | "institutionnel"
  | "industriel"
  | "restauration"
  | "infrastructures";

export type ProjectResponse = {
  id: number;
  title: string;
  slug: string;
  category: ProjectCategory;
  image: MediaResponse | null;
  content: SerializedEditorState;
  updatedAt: string;
  createdAt: string;
};
