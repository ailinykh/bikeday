import { destroySession } from "~/server/lib/session";
export default defineEventHandler(async (event) => {
  destroySession(event);
});
