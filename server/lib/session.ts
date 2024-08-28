import jwt from "jsonwebtoken";
import { H3Event } from "h3";
import type { User } from "~/types";

const { tokenSecret } = useRuntimeConfig();

export const createSession = (
  event: H3Event,
  user: User,
) => {
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
  const token = jwt.sign(
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
  setCookie(event, "__session", token);
  setCookie(event, "user_id", id.toString());
};

export const destroySession = (event: H3Event) => {
  deleteCookie(event, "__session");
  deleteCookie(event, "user_id");
};
