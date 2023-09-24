import { PrismaClient } from "@prisma/client";
import { H3Event } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(
  async (event: H3Event) => {
    protectRoute(event, ["volunteer", "admin"]);

    const { contestId } = event.context.params!;
    const id = parseInt(contestId);

    return prisma.contest.findUnique({
      where: { id },
      select: {
        id: true,
        status: true,
        title: true,
        ContestParticipation: true,
      },
    });
  },
);
