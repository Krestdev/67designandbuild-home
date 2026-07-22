export type HeaderNavLink = {
  id: string;
  label: string;
  url: string;
};

export type HeaderResponse = {
  id: number;
  navLinks: HeaderNavLink[];
  updatedAt: string;
  createdAt: string;
  globalType: string;
};
