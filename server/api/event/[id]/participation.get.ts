import { H3Event } from "h3";
import type { User } from "~/types";
import prisma from "~/server/lib/prisma";

export default defineEventHandler(
  async (event: H3Event) => {
    const user: User = event.context.user;
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const id = parseInt(event.context.params!.id);
    return prisma.eventParticipation.findFirst({
      where: {
        userId: user.id,
        eventId: id,
      },
    });
  },
);
