export type FooterSocialLink = {
  id: string;
  platform: string;
  url: string;
};

export type FooterResponse = {
  id: number;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  copyrightText: string;
  socialLinks: FooterSocialLink[];
  updatedAt: string;
  createdAt: string;
  globalType: string;
};
