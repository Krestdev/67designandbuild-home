import type { SerializedEditorState } from "lexical";

export interface Media {
  id: number;
  url: string;
  alt?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
    };
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
    };
    tablet?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export type RichText = SerializedEditorState;