import { H3Event } from "h3";
import prisma from "~~/server/libs/prisma";

export default defineEventHandler(
  async (event: H3Event) => {
    protectRoute(event, ["volunteer", "admin"]);

    return prisma.contest.findMany({
      orderBy: { order: "asc" },
    });
  },
);
