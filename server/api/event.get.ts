import prisma from "~/server/lib/prisma";

export default defineEventHandler(async (event) => {
  return prisma.event.findFirst({
    orderBy: { date: "desc" },
  });
});
