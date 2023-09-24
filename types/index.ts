export type TelegramAuthRequest = {
  url: string;
  payload: string;
};

export type AuthRequest = {
  provider: string;
  context: string;
  createdAt: string;
};

export type IEvent = {
  id: number;
  title: string;
  date: Date;
};

export type User = {
  id: number;
  status: string;
  phone: string | null;
  birthday: string | null;
  gender: string | null;
  firstName: string;
  lastName: string;
  participation: IParticipation | null;
};

export type UserProfileFull = {
  id: number | null;
  firstName: string;
  lastName: string;
  birthday: string;
  gender: string;
};

export interface IParticipation {
  bike: string;
  district: string;
  band: string | null;
  bandBy: number | null;
}
