import jwt from "jsonwebtoken";
import { H3Event } from "h3";
import { User } from "~/types/user";

const { tokenSecret } = useRuntimeConfig();

export const createSession = (
  event: H3Event,
  user: User
) => {
  if (tokenSecret.length == 0) {
    console.error("❌ secret token is empty");
  }

  const { id, phone, status, lastName, firstName } = user;
  const token = jwt.sign(
    {
      id,
      phone,
      status,
      firstName,
      lastName,
    },
    tokenSecret,
    {
      expiresIn: 3600,
    }
  );
  setCookie(event, "__session", token);
};

export const destroySession = (event: H3Event) => {
  deleteCookie(event, "__session");
};
