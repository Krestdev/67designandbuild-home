export interface FooterGlobal {
  id: number;
  contactInfo?: {
    contactEmail?: string | null;
    contactPhone?: string | null;
    contactAddress?: string | null;
  } | null;
  copyrightText?: string | null;
  socialLinks?: {
    platform?: string | null;
    url?: string | null;
    id?: string | null;
  }[] | null;
  usefullLinks?: { // Note: 'usefullLinks' is spelled this way in the schema
    lable?: string | null; // Note: 'lable' is spelled this way in the schema
    id?: string | null;
  }[] | null;
  Enterprise?: {
    lable?: string | null; // Note: 'lable' is spelled this way in the schema
    id?: string | null;
  }[] | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}