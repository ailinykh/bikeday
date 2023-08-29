import jwt from "jsonwebtoken";

const config = useRuntimeConfig();

export default defineEventHandler(async (event) => {
  const cookie = getCookie(event, "__session");

  if (!cookie) {
    return;
  }

  try {
    const user = jwt.verify(cookie, config.tokenSecret);

    if (!user) {
      return;
    }

    event.context.user = user;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.info("❌ token expired");
    } else {
      console.error(err);
    }
  }
});
