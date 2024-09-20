import { H3Event } from "h3";
import prisma from "~~/server/libs/prisma";

export default defineEventHandler(
  async (event: H3Event) => {
    protectRoute(event, ["volunteer", "admin"]);

    const {
      eventId: eId,
      contestId: cId,
      userId: uId,
    } = getQuery(event);
    const [eventId, contestId, userId] = [
      parseInt(eId!.toString()),
      parseInt(cId!.toString()),
      parseInt(uId!.toString()),
    ];

    return prisma.contestParticipation.findUnique({
      where: {
        contestId_eventId_userId: {
          eventId,
          contestId,
          userId,
        },
      },
      select: {
        score: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            status: true,
            phone: true,
            EventParticipation: true,
          },
        },
        contest: true,
      },
    });
  },
);
