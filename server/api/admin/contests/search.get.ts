import { H3Event } from "h3";
import prisma from "~/server/lib/prisma";

export default defineEventHandler(
  async (event: H3Event) => {
    protectRoute(event, ["volunteer", "admin"]);

    const { term } = getQuery(event);

    if (!term) {
      return [];
    }

    const by = term.toString();

    const bikeday = await prisma.event.findFirst({
      orderBy: { date: "desc" },
    });

    const users = await prisma.user.findMany({
      where: {
        phone: { endsWith: by },
      },
      select: {
        id: true,
        status: true,
        firstName: true,
        lastName: true,
        phone: true,
        EventParticipation: {
          select: {
            band: true,
          },
          where: { eventId: bikeday!.id },
        },
        ContestParticipation: true,
      },
    });

    const participations =
      await prisma.eventParticipation.findMany({
        where: { band: { endsWith: by } },
        select: {
          user: {
            select: {
              id: true,
              status: true,
              firstName: true,
              lastName: true,
              phone: true,
              EventParticipation: {
                select: {
                  band: true,
                },
                where: { eventId: bikeday!.id },
              },
            },
          },
        },
      });

    return [
      ...users,
      ...participations.map((p) => ({
        ...p.user,
      })),
    ];
  },
);
