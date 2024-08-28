import prisma from "~/server/lib/prisma";

export default defineEventHandler(async (event) => {
  protectRoute(event);

  const bikeday = await prisma.event.findFirst({
    orderBy: { date: "desc" },
  });

  const contests = await prisma.contest.findMany({
    orderBy: { order: "asc" },
    select: {
      id: true,
      title: true,
      status: true,
      ContestParticipation: {
        where: {
          userId: event.context.user.id,
          eventId: bikeday!.id,
        },
      },
    },
  });

  return contests.map((contest) => {
    return {
      ...contest,
      participation: contest.ContestParticipation[0],
    };
  });
});
