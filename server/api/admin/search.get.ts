import { PrismaClient, Event } from "@prisma/client";
import { H3Event } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(
  async (event: H3Event) => {
    protectRoute(event, ["volunteer", "admin"]);

    const { phone: p } = getQuery(event);
    const phone = p!.toString();

    let users = await prisma.user.findMany({
      where: { phone: { endsWith: phone } },
      select: {
        id: true,
        status: true,
        firstName: true,
        lastName: true,
        phone: true,
        EventParticipation: true,
      },
    });

    if (phone.length > 5) {
      for (const u of users) {
        if (u.status != "child") {
          const children = await prisma.user.findMany({
            where: {
              parentId: u.id,
              status: { not: "removed" },
            },
            select: {
              id: true,
              status: true,
              firstName: true,
              lastName: true,
              phone: true,
              EventParticipation: true,
            },
          });
          users.push(...children);
        }
      }
    }

    const bikeday = await prisma.event.findFirst({
      orderBy: { date: "desc" },
    });

    return users.map((user) => {
      const participation = user.EventParticipation.find(
        (p) => (p.eventId = bikeday!.id),
      );
      return { ...user, participation };
    });
  },
);
