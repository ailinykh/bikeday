import { destroySession } from "~~/server/libs/session";
export default defineEventHandler(async (event) => {
  destroySession(event);
});
