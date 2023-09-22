export type TelegramAuthRequest = {
  url: string;
  payload: string;
};

export type AuthRequest = {
  provider: string;
  context: string;
  createdAt: string;
};

export type User = {
  id: number;
  status: string;
  phone: string | null;
  birthday: string | null;
  gender: string | null;
  firstName: string;
  lastName: string;
};

export interface IParticipation {
  bike: string;
  district: string;
  band: string | null;
  bandBy: number | null;
}
