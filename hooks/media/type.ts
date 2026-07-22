export type MediaImageSize = {
  url: string | null;
  width: number | null;
  height: number | null;
  mimeType: string | null;
  filesize: number | null;
  filename: string | null;
};

export type MediaResponse = {
  id: number;
  alt: string;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
  sizes: {
    thumbnail: MediaImageSize;
    card: MediaImageSize;
    tablet: MediaImageSize;
  };
  updatedAt: string;
  createdAt: string;
};
