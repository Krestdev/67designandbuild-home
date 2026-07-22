export type LinkPlacement = "header" | "footer-entreprise" | "footer-liens-utiles";

export type LinkResponse = {
  id: number;
  label: string;
  url: string;
  placement: LinkPlacement;
  updatedAt: string;
  createdAt: string;
};
