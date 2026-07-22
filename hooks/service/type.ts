import type { SerializedEditorState } from "lexical";

export type ServiceResponse = {
  id: number;
  title: string;
  slug: string;
  content: SerializedEditorState;
  updatedAt: string;
  createdAt: string;
};
