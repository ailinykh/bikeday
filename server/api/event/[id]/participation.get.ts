import { PrismaClient } from "@prisma/client";
import { H3Event } from "h3";
import { User } from "~/types";

const prisma = new PrismaClient();

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
  }
);
