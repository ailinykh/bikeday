import jwt from "jsonwebtoken";
import { H3Event } from "h3";
import type { User } from "~/types";

const { tokenSecret } = useRuntimeConfig();

export const createToken = (user: User): string => {
  if (tokenSecret.length == 0) {
    console.error("❌ secret token is empty");
  }
  const {
    id,
    phone,
    status,
    lastName,
    firstName,
    birthday,
    gender,
  } = user;
  return jwt.sign(
    {
      id,
      phone,
      status,
      firstName,
      lastName,
      birthday,
      gender,
    },
    tokenSecret,
    {
      expiresIn: 86400 * 60,
    },
  );
};

export const createSession = (
  event: H3Event,
  user: User,
) => {
  setCookie(event, "__session", createToken(user));
  setCookie(event, "user_id", user.id.toString());
};

export const destroySession = (event: H3Event) => {
  deleteCookie(event, "__session");
  deleteCookie(event, "user_id");
};
