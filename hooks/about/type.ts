import type { SerializedEditorState } from "lexical";

export type AboutResponse = {
  id: number;
  title: string;
  slug: string;
  content: SerializedEditorState;
  updatedAt: string;
  createdAt: string;
  globalType: string;
};
