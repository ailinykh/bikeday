import { H3Event } from "h3";
import type { User } from "~~/types";
import prisma from "~~/server/libs/prisma";

export default defineEventHandler(
  async (event: H3Event) => {
    const user: User = event.context.user;
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      });
    }

    const body = await readBody(event);
    const { id, lastName, firstName, gender } = body;
    let birthday = null;
    if (body.birthday) {
      const [day, month, year] = body.birthday.split(".");
      birthday = new Date(
        `${year}-${month}-${day}T12:00:00Z`,
      );
    }

    return prisma.user.update({
      where: {
        id,
        status: "child",
        parentId: user.id,
      },
      data: {
        firstName,
        lastName,
        birthday,
        gender,
      },
    });
  },
);
