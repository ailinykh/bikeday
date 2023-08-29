import { destroySession } from "../../lib/session";
export default defineEventHandler(async (event) => {
  destroySession(event);
});
