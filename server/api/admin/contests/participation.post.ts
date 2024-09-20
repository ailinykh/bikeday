import { H3Event } from "h3";
import prisma from "~~/server/libs/prisma";

export default defineEventHandler(
  async (event: H3Event) => {
    protectRoute(event, ["volunteer", "admin"]);

    const {
      eventId: eId,
      contestId: cId,
      userId: uId,
      score,
    } = await readBody(event);
    const [eventId, contestId, userId] = [
      parseInt(eId),
      parseInt(cId),
      parseInt(uId),
    ];

    return prisma.contestParticipation.upsert({
      where: {
        contestId_eventId_userId: {
          contestId,
          eventId,
          userId,
        },
      },
      update: {
        score,
      },
      create: {
        eventId,
        contestId,
        userId,
        score,
      },
    });
  },
);
