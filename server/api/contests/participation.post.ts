import { PrismaClient } from "@prisma/client";
import { H3Event } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(
  async (event: H3Event) => {
    protectRoute(event);
    const { eventId, contestId } = await readBody(event);

    return prisma.contestParticipation.create({
      data: {
        score: "",
        contestId,
        eventId,
        userId: event.context.user.id,
      },
    });
  },
);
