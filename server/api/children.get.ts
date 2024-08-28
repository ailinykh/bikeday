import prisma from "~/server/lib/prisma";
import type { User } from "~/types";

export default defineEventHandler(async (event) => {
  const user: User = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const bikeday = await prisma.event.findFirst({
    orderBy: { date: "desc" },
  });

  const children = await prisma.user.findMany({
    where: {
      parentId: user.id,
      status: "child",
    },
    select: {
      firstName: true,
      lastName: true,
      gender: true,
      birthday: true,
      EventParticipation: true,
    },
  });

  return children.map((child) => {
    const participation = child.EventParticipation.find(
      (p) => p.eventId == bikeday?.id,
    );
    return { ...child, participation };
  });
});
