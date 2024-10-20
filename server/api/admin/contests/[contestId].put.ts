import { H3Event } from "h3";
import prisma from "~~/server/libs/prisma";

export default defineEventHandler(
  async (event: H3Event) => {
    protectRoute(event, ["volunteer", "admin"]);

    const { contestId } = event.context.params!;
    const id = parseInt(contestId);
    const { status } = await readBody(event);

    return prisma.contest.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        status: true,
        title: true,
        ContestParticipation: {
          select: {
            score: true,
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                status: true,
                phone: true,
                EventParticipation: true,
              },
            },
          },
        },
      },
    });
  },
);
