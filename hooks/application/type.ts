export interface ApplicationInput {
  career?: number; // Career id; none = spontaneous application
  fullName: string;
  email: string;
  phone: string;
  message?: string;
}

export interface Application extends ApplicationInput {
  id: number;
  cv: number; // private-files id
  status?: "new" | "contacted" | "closed";
  createdAt: string;
  updatedAt: string;
}
