import { PrismaClient } from "@prisma/client";
import { User } from "~/types";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const user: User = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  return prisma.user.findMany({
    where: {
      parentId: user.id,
      status: "child",
    },
  });
});
