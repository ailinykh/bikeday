import { H3Event } from "h3";
import prisma from "~/server/lib/prisma";

export default defineEventHandler(
  async (event: H3Event) => {
    protectRoute(event, ["volunteer", "admin"]);

    const eventId = parseInt(event.context.params!.eventId);
    const userId = parseInt(event.context.params!.userId);

    const participation =
      await prisma.eventParticipation.findFirst({
        where: {
          userId,
          eventId,
        },
      });

    const { district, band } = await readBody(event);

    if (participation) {
      return prisma.eventParticipation.update({
        where: { eventId_userId: { eventId, userId } },
        data: {
          district,
          band,
          bandBy: event.context.user.id,
        },
      });
    }

    return prisma.eventParticipation.create({
      data: {
        eventId,
        userId,
        district,
        bike: "unknown",
        band,
        bandBy: event.context.user.id,
      },
    });
  },
);
