import { PrismaClient } from "@prisma/client";
import { H3Event } from "h3";
import type { User } from "~/types";

const prisma = new PrismaClient();

export default defineEventHandler(
  async (event: H3Event) => {
    const user: User = event.context.user;
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const id = parseInt(event.context.params!.id);
    // TODO: status helper
    if (user.status == "user" && id != user.id) {
      console.warn(
        `unauthorized access: id: ${id}, user.id: ${user.id}`,
      );
      throw createError({
        statusCode: 403,
        statusMessage: "Forbidden",
      });
    }

    return prisma.user.findFirst({
      where: {
        id,
      },
    });
  },
);
