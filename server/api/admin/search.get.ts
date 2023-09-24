import { PrismaClient, Event } from "@prisma/client";
import { H3Event } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(
  async (event: H3Event) => {
    protectRoute(event, ["volunteer", "admin"]);

    const { phone } = getQuery(event);

    let users = await prisma.user.findMany({
      where: { phone: { endsWith: phone?.toString() } },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        EventParticipation: true,
      },
    });

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
