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

    const eventId = parseInt(event.context.params!.id);
    const participation =
      await prisma.eventParticipation.findFirst({
        where: {
          userId: user.id,
          eventId,
        },
      });

    if (participation) {
      throw createError({
        statusCode: 400,
        statusMessage: "Participation already exists",
      });
    }

    const { bike, district } = await readBody(event);
    if (!bike || bike.length < 1) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bike not specified",
      });
    }
    if (!district || district.length < 1) {
      throw createError({
        statusCode: 400,
        statusMessage: "District not specified",
      });
    }

    return prisma.eventParticipation.create({
      data: {
        eventId,
        userId: user.id,
        district,
        bike,
      },
    });
  },
);
