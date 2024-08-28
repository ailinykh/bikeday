import { H3Event } from "h3";
import prisma from "~/server/lib/prisma";

export default defineEventHandler(
  async (event: H3Event) => {
    protectRoute(event);
    const { eventId, contestId } = await readBody(event);

    return prisma.contestParticipation.delete({
      where: {
        contestId_eventId_userId: {
          contestId,
          eventId,
          userId: event.context.user.id,
        },
      },
    });
  },
);
