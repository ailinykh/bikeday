import jwt from "jsonwebtoken";

const tokenSecret = process.env.JWT_TOKEN_SECRET;

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, "__session");

  if (!cookie) {
    return;
  }

  try {
    const user = await jwt.verify(cookie, tokenSecret);

    if (!user) {
      return;
    }

    console.log(user);
    event.context.user = user;
  } catch (err) {
    console.error(err);
  }
});
