export interface QuoteRequestInput {
  fullName: string;
  company?: string;
  email: string;
  phone: string;
  projectType: number; // Service id
  sector?: number; // Sector id
  location: string;
  timeline?: string;
  budget?: string;
  description: string;
  attachments?: number[]; // Media ids, uploaded separately first
}

export interface QuoteRequest extends QuoteRequestInput {
  id: number;
  status?: "new" | "contacted" | "closed";
  createdAt: string;
  updatedAt: string;
}