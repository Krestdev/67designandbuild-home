export type FooterLink = {
  id: string;
  label: string;
  url: string;
};

export type FooterSocialLink = {
  id: string;
  platform: "linkedin" | "facebook" | "x";
  url: string;
  copyrightText: string;
};

export type FooterResponse = {
  id: number;
  companyLinks: FooterLink[];
  usefulLinks: FooterLink[];
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: FooterSocialLink[];
  updatedAt: string;
  createdAt: string;
  globalType: string;
};
