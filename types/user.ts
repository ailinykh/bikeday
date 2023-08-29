export type AuthRequest = {
  provider: string;
  context: string;
  createdAt: string;
};

export type User = {
  id: number;
  status: string;
  phone: string;
  firstName: string;
  lastName: string;
};
