import type { SerializedEditorState } from "lexical";

export type FaqResponse = {
  id: number;
  question: string;
  answer: SerializedEditorState;
  order: number | null;
  updatedAt: string;
  createdAt: string;
};
