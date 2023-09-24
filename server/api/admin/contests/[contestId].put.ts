import { PrismaClient } from "@prisma/client";
import { H3Event } from "h3";
import { User } from "~/types";

const prisma = new PrismaClient();

export default defineEventHandler(
  async (event: H3Event) => {
    protectRoute(event, ["volunteer", "admin"]);

    const { contestId } = event.context.params!;
    const id = parseInt(contestId);
    const { status } = await readBody(event);

    return prisma.contest.update({
      where: { id },
      data: { status },
    });
  },
);
