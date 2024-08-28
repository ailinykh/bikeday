import { H3Event } from "h3";
import type { User } from "~/types";
import prisma from "~/server/libs/prisma";

export default defineEventHandler(
  async (event: H3Event) => {
    const user: User = event.context.user;
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const { id } = await readBody(event);
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: "Bad request",
      });
    }

    return prisma.user.update({
      where: {
        id,
        status: "child",
        parentId: user.id,
      },
      data: {
        status: "removed",
      },
    });
  },
);
