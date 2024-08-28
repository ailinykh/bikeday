import prisma from "~/server/libs/prisma";

export default defineEventHandler(async (event) => {
  return prisma.event.findFirst({
    orderBy: { date: "desc" },
  });
});
